import express from "express";

const router = express.Router();

// Define all routes for the book endpoints
router.get("/", (req, res) => {
	res.json({ message: "All Books" });
});

router.get("/:id", (req, res) => {
	res.json({ message: "A single book" });
});

router.post("/:id", (req, res) => {
	res.json({ message: "Post book" });
});

router.put("/:id", (req, res) => {
	res.json({ message: "Put book" });
});

router.delete("/:id", (req, res) => {
	res.json({ message: "Delete book" });
});

export default router;
