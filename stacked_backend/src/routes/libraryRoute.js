import express from "express";
import {
	addToLibrary,
	updateLibrary,
	removeFromLibrary,
} from "../controllers/libraryController.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// Define all routes for the library endpoints, protect added to ensure frontend sends the login cookie with this request
router.post("/", protect, addToLibrary);

router.delete("/:id", protect, removeFromLibrary);

router.patch("/:id", protect, updateLibrary);

export default router;
