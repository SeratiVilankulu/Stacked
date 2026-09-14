import { db } from "../prisma/db.ts";
import bcrypt from "bcryptjs";

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

		res.status(201).json({
			status: "success",
			data: {
				user: {
					id: user.id,
					name: name,
					surname: surname,
					email: email,
				},
			},
		});
	} catch (error) {
		return res.status(500).json({
			message: error.message,
		});
	}
}

export { register };
