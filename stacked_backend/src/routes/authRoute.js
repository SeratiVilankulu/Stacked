import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Define all routes for the user endpoints
router.post("/register", register);

router.post("/login", login);

export default router;
