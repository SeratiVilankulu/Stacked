import express from "express";
import { authorize } from "../middleware/authorize.js";
import { protect } from "../middleware/protect.js";
import {
	getMyReservations,
	getAllReservations,
	createReservation,
	cancelReservation,
	collectReservation,
} from "../controllers/reservationController.js";

const router = express.Router();

router.get("/", protect, authorize("ADMIN"), getAllReservations);

router.get("/me", protect, getMyReservations);

router.post("/", protect, createReservation);

// Members can cancel and collect their own reservations, admins can do it for anyone
router.patch("/:id/cancel", protect, cancelReservation);

router.post("/:id/collect", protect, collectReservation);

export default router;
