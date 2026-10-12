import express from "express";
import { authorize } from "../middleware/authorize.js";
import { protect } from "../middleware/protect.js";
import {
	getAllFines,
	getMyFines,
	payFine,
} from "../controllers/fineController.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getAllFines);

router.get("/me", protect, getMyFines);

router.patch("/:id/pay", protect, authorize("ADMIN"), payFine);

export default router;
