import express from "express";
import { authorize } from "../middleware/authorize.js";
import { protect } from "../middleware/protect.js";
import { uploadImage } from "../middleware/uploadImage.js";
import {
	getAllBooks,
	getBook,
	addBook,
	updateBook,
	deleteBook,
} from "../controllers/bookController.js";
import {
	getBookCopies,
	addBookCopies,
	removeBookCopy,
} from "../controllers/bookCopyController.js";

const router = express.Router();

// Any signed-in user can browse the catalogue
router.get("/", protect, getAllBooks);

router.get("/:id", protect, getBook);

// Only admins can change the catalogue. The cover arrives as a file in the "coverImage" form field
router.post("/", protect, authorize("ADMIN"), uploadImage("coverImage"), addBook);

router.patch("/:id", protect, authorize("ADMIN"), updateBook);

router.delete("/:id", protect, authorize("ADMIN"), deleteBook);

// Physical copies of a book, managed by admins
router.get("/:id/copies", protect, authorize("ADMIN"), getBookCopies);

router.post("/:id/copies", protect, authorize("ADMIN"), addBookCopies);

router.delete(
	"/:id/copies/:copyId",
	protect,
	authorize("ADMIN"),
	removeBookCopy,
);

export default router;
