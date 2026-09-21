import express from "express";
import {
	register,
	login,
	logout,
	user,
} from "../controllers/authController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// Define all routes for the user endpoints
router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

// Returns the signed-in user, or 401 when the cookie is missing or expired.
router.get("/user", protect, user);

export default router;
