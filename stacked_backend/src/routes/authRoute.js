import express from "express";
import { register } from "../controllers/authController.js";

const router = express.Router();

// Define all routes for the user endpoints
router.post("/register", register);

export default router;
