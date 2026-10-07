import bcrypt from "bcryptjs";
import { and, or } from "@prisma/orm-postgres/orm-client";
import { db } from "../prisma/db.ts";

// Allowed values, used to check what the frontend sends
const ROLES = ["ADMIN", "USER"];
const STATUSES = ["ACTIVE", "SUSPENDED"];

// Every field except the password hash
const PUBLIC_FIELDS = [
	"id",
	"name",
	"surname",
	"username",
	"email",
	"role",
	"status",
	"createdAt",
];

// Returns the user without the password, safe to send to the browser
const toPublicUser = ({ password: _password, ...user }) => user;

// Postgres LIKE is case-sensitive, so try the term as typed, lowercase and capitalised
const searchVariants = (term) => {
	const lower = term.toLowerCase();
	const capitalised = lower.charAt(0).toUpperCase() + lower.slice(1);
	return [...new Set([term, lower, capitalised])].map((t) => `%${t}%`);
};

// Takes the search box, the Role and Status dropdowns, and the page number from the URL, then returns one page of matching users
async function getAllUsers(req, res) {
	try {
		// Read query parameters (everything after "?" in the URL)
		const search = (req.query.search || "").trim(); // "" when no search was sent
		const role = req.query.role?.toUpperCase(); // "user" -> "USER"
		const status = req.query.status?.toUpperCase();
		const page = Math.max(parseInt(req.query.page) || 1, 1); // Page 1 or higher
		const limit = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 50); // 8 per page by default, 50 at most

		// Role check, only if a role was sent
		if (role && !ROLES.includes(role)) {
			return res
				.status(400)
				.json({ error: `Role must be one of: ${ROLES.join(", ")}` });
		}

		// Status check, only if a status was sent
		if (status && !STATUSES.includes(status)) {
			return res
				.status(400)
				.json({ error: `Status must be one of: ${STATUSES.join(", ")}` });
		}

		// Build the search rule. Only the filters that were sent are applied
		const filter = (user) => {
			const conditions = [];
			if (role) conditions.push(user.role.eq(role));
			if (status) conditions.push(user.status.eq(status));
			if (search) {
				// Check the search text against name, surname, username and email
				const matches = searchVariants(search).flatMap((pattern) => [
					user.name.like(pattern),
					user.surname.like(pattern),
					user.username.like(pattern),
					user.email.like(pattern),
				]);
				conditions.push(or(...matches)); // A match in any one field is enough
			}
			return and(...conditions); // Every filter must match
		};

		// Starts a fresh query with the filter each time it is called
		const matching = () => db.orm.public.User.where(filter);

		// Run both queries at the same time
		const [{ count: total }, users] = await Promise.all([
			// 1. How many users match in total
			matching().aggregate((agg) => ({ count: agg.count() })),
			// 2. The users on this page
			matching()
				.select(...PUBLIC_FIELDS) // Everything except the password
				.orderBy((user) => user.createdAt.desc()) // Newest first
				.limit(limit)
				.offset((page - 1) * limit) // Skip the earlier pages
				.all(),
		]);

		res.status(200).json({
			status: "success",
			data: {
				users,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit), // Round up
				},
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch users" });
	}
}

// Statistics numbers for the User Activity cards
async function getUserStats(req, res) {
	try {
		// Midnight on the 1st of this month, for "New This Month"
		const startOfMonth = new Date();
		startOfMonth.setDate(1);
		startOfMonth.setHours(0, 0, 0, 0);

		// Counts the users that match a filter
		const count = (filter) =>
			db.orm.public.User.where(filter).aggregate((agg) => ({
				count: agg.count(),
			}));

		// Run all four counts at the same time
		const [total, newThisMonth, active, suspended] = await Promise.all([
			db.orm.public.User.aggregate((agg) => ({ count: agg.count() })), // All users
			count((user) => user.createdAt.gte(startOfMonth.toISOString())), // Joined this month
			count({ status: "ACTIVE" }),
			count({ status: "SUSPENDED" }),
		]);

		res.status(200).json({
			status: "success",
			data: {
				total: total.count,
				newThisMonth: newThisMonth.count,
				active: active.count,
				suspended: suspended.count,
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch user statistics" });
	}
}

// Returns one user by id
async function getUser(req, res) {
	try {
		const userId = req.params.id;

		// Find the user by the id without the password
		const user = await db.orm.public.User.where({ id: userId }).first();

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json({ status: "success", data: user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch user" });
	}
}

// Lets an admin add a new member
async function createUser(req, res) {
	try {
		const { name, surname, email, username, password } = req.body;
		const role = (req.body.role || "USER").toUpperCase(); // Member unless a role is chosen

		// Check that every field was filled in
		if (!name || !surname || !email || !username || !password) {
			return res.status(400).json({ error: "All fields are required" });
		}

		// Role check
		if (!ROLES.includes(role)) {
			return res
				.status(400)
				.json({ error: `Role must be one of: ${ROLES.join(", ")}` });
		}

		// Check that email and username don't belong to someone else
		if (await db.orm.public.User.where({ email }).first()) {
			return res
				.status(400)
				.json({ error: "User with this email already exists" });
		}
		if (await db.orm.public.User.where({ username }).first()) {
			return res
				.status(400)
				.json({ error: "User with this username already exists" });
		}

		// Save the user with a hashed password
		const salt = await bcrypt.genSalt(10);
		const user = await db.orm.public.User.create({
			name,
			surname,
			email,
			username,
			password: await bcrypt.hash(password, salt),
			role,
			status: "ACTIVE",
		});

		res.status(201).json({
			status: "success",
			data: { user: toPublicUser(user) },
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not create user" });
	}
}

// Lets an admin edit a user's details or suspend/reactivate them
async function updateUser(req, res) {
	try {
		const userId = req.params.id; // The user being edited
		const { name, surname, email, username } = req.body;
		const role = req.body.role?.toUpperCase();
		const status = req.body.status?.toUpperCase();

		// Make sure the user exists
		const user = await db.orm.public.User.where({ id: userId }).first();

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Role and status checks
		if (role !== undefined && !ROLES.includes(role)) {
			return res
				.status(400)
				.json({ error: `Role must be one of: ${ROLES.join(", ")}` });
		}

		if (status !== undefined && !STATUSES.includes(status)) {
			return res
				.status(400)
				.json({ error: `Status must be one of the two: ${STATUSES.join(", ")}` });
		}

		// An admin locking themselves out could leave the library with no admin
		const isSelf = userId === req.user.id;
		if (isSelf && (role === "USER" || status === "SUSPENDED")) {
			return res
				.status(400)
				.json({ error: "You cannot suspend your own account" });
		}

		// Email and username must stay unique
		if (email && email !== user.email) {
			if (await db.orm.public.User.where({ email }).first()) {
				return res
					.status(400)
					.json({ error: "User with this email already exists" });
			}
		}
		if (username && username !== user.username) {
			if (await db.orm.public.User.where({ username }).first()) {
				return res
					.status(400)
					.json({ error: "User with this username already exists" });
			}
		}

		// Only the fields that were sent are changed
		const updateData = {};
		if (name) updateData.name = name;
		if (surname) updateData.surname = surname;
		if (email) updateData.email = email;
		if (username) updateData.username = username;
		if (role) updateData.role = role;
		if (status) updateData.status = status;

		// Nothing was sent, so there is nothing to change
		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({ error: "No fields to update" });
		}

		// Save the changes and get the updated user back
		const updatedUser = await db.orm.public.User.where({ id: userId }).update(
			updateData,
		);

		res.status(200).json({
			status: "success",
			data: { user: toPublicUser(updatedUser) },
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not update user" });
	}
}

// Deletes a user, but only if they have no loans, fines, or books
async function deleteUser(req, res) {
	try {
		const id = req.params.id; // The user being deleted

		// Admins cannot delete themselves
		if (id === req.user.id) {
			return res
				.status(400)
				.json({ error: "You cannot delete your own account" });
		}

		// Make sure the user exists
		const user = await db.orm.public.User.where({ id }).first();

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// These records must keep pointing at the user, so the database blocks the delete
		const [loan, fineReceived, fineIssued, bookAdded] = await Promise.all([
			db.orm.public.LoanedBook.where({ userId: id }).first(),
			db.orm.public.Fine.where({ userId: id }).first(),
			db.orm.public.Fine.where({ adminId: id }).first(),
			db.orm.public.Book.where({ adminId: id }).first(),
		]);

		// If any history means the user must be suspended instead
		if (loan || fineReceived || fineIssued || bookAdded) {
			return res.status(400).json({
				error:
					"This user has loan, fine, or book history and cannot be deleted. Suspend the account instead.",
			});
		}

		// User library and reservations are removed with them
		await db.orm.public.User.where({ id: user.id }).delete();

		res.status(200).json({ status: "success", message: "User deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not delete user" });
	}
}

export {
	getAllUsers,
	getUserStats,
	getUser,
	createUser,
	updateUser,
	deleteUser,
};
