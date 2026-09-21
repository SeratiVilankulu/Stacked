import { db } from "../prisma/db.ts";
import bcrypt from "bcryptjs";
import { sendTokenCookie } from "../utils/generateToken.js";

async function register(req, res) {
	try {
		const { name, surname, email, username, password } = req.body;

		// Check if all required fields are provided
		if (!name || !surname || !email || !username || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user with the same email
		const userExists = await db.orm.public.User.where({
			email,
		}).first();

		if (userExists) {
			return res
				.status(400)
				.json({ message: "User with this email already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create a user
		const user = await db.orm.public.User.create({
			name,
			surname,
			email,
			username,
			password: hashedPassword,
			role: "USER",
		});

		// New user login set the auth cookie
		sendTokenCookie(user, 201, res, {
			status: "success",
			data: { user: { id: user.id, name: user.name, email: user.email } },
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

async function login(req, res) {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		// Check if user email exists
		const user = await db.orm.public.User.where({
			email,
		}).first();

		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// The token is not in the body, the browser holds it in the cookie.
		sendTokenCookie(user, 200, res, { message: "User successfully logged in" });
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

async function logout(req, res) {
	res.clearCookie("token", "", {
		httpOnly: true,
		expires: new Date(0),
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
	});
	res.status(200).json({
		status: "success",
		message: "User logged out",
	});
}

// Who is signed in? 'protect' has already verified the cookie and loaded the account, so this just hands it back.
async function user(req, res) {
	res.status(200).json({
		status: "success",
		data: { user: req.user },
	});
}

export { register, login, logout, user };
