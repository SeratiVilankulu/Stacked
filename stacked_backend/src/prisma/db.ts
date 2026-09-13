import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "./contract.d.ts";
import contractJson from "./contract.json" with { type: "json" };

const db = postgres<Contract>({
	contractJson,
	url: process.env["DATABASE_URL"]!,
});

const connectDB = async () => {
	try {
		await db.orm.public.User.first();
		console.log("Database connected successfully");
	} catch (error) {
		console.error("Error connecting to database:", error);
		process.exit(1);
	}
};

const disconnectDB = async () => {
	await db.close();
};

export { db, connectDB, disconnectDB };
