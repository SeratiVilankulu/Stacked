import express from "express";

const router = express.Router();

// Define all routes for the user endpoints
router.get("/", (req, res) => {
	res.json({ message: "User route is working!" });
});

export default router;
