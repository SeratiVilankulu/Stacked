import express from "express";
import { authorize } from "../middleware/authorize.js";
import { protect } from "../middleware/protect.js";
import {
	getAllUsers,
	getUserStats,
	getUser,
	createUser,
	updateUser,
	deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Every user management route needs a signed-in admin
router.use(protect, authorize("ADMIN"));

router.get("/", getAllUsers);

// Must come before "/:id", otherwise Express treats "stats" as a user id
router.get("/stats", getUserStats);

router.get("/:id", getUser);

router.post("/", createUser);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;
