import express from "express";
import { authorize } from "../middleware/authorize.js";
import { protect } from "../middleware/protect.js";
import {
	getMyLoans,
	getAllLoans,
	getLoan,
	borrowBook,
	renewLoan,
	returnLoan,
} from "../controllers/loanController.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getAllLoans);

router.get("/me", protect, getMyLoans);

// Users can only see their own loans, admins can see any loans
router.get("/:id", protect, getLoan);

router.post("/", protect, borrowBook);

router.patch("/:id/renew", protect, renewLoan);

// Only admins check books back in
router.patch("/:id/return", protect, authorize("ADMIN"), returnLoan);

export default router;
