import express from "express"; // import the express package
import dotenv from "dotenv"; // import the dotenv package
import { connectDB, disconnectDB } from "./prisma/db.ts";
dotenv.config(); // load environment variables from .env file

connectDB(); // connect to the database

// Import Routes
import userRoutes from "./routes/userRoute.js";
import bookRoutes from "./routes/bookRoute.js";

const app = express(); // create an instance of the express application

// API Routes
app.use("/users", userRoutes);
app.use("/books", bookRoutes);

const PORT = process.env.PORT; // set the port to listen on
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections and uncaught exceptions (e.g. database connection errors, etc.)
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Rejection:", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception:", err);
	server.close(async () => {
		await disconnectDB();
		process.exit(1);
	});
});

// Gracefully handle SIGTERM signal (e.g. when the application is terminated)
process.on("SIGTERM", () => {
	console.log("SIGTERM received, shutting down gracefully");
	server.close(async () => {
		await disconnectDB();
		process.exit(0);
	});
});
