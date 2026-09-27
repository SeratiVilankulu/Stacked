import { db } from "../prisma/db.ts";

const READING_STATUSES = ["WANT_TO_READ", "READING", "COMPLETED", "ABANDONED"];

async function addToLibrary(req, res) {
	try {
		const { bookId, status } = req.body;
		// Taken from the signed-in user, not the body, so nobody can edit another user's library
		const userId = req.user.id;

		if (!bookId) {
			return res.status(400).json({ error: "bookId is required" });
		}

		if (!READING_STATUSES.includes(status)) {
			return res.status(400).json({ error: "Invalid reading status" });
		}

		// Verify that book exists
		const bookExist = await db.orm.public.Book.where({
			id: bookId,
		}).first();

		if (!bookExist) {
			return res.status(404).json({ error: "Book not found" });
		}

		// Check if already added to library
		const existingInLibrary = await db.orm.public.Library.where({
			userId: userId,
			bookId: bookId,
		}).first();

		if (existingInLibrary) {
			return res.status(400).json({ error: "Book already in the library" });
		}

		// Create library item
		const libraryBook = await db.orm.public.Library.create({
			userId,
			bookId,
			status,
		});

		res.status(201).json({
			status: "Success",
			data: libraryBook,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Could not add book to library" });
	}
}

async function updateLibrary(req, res) {
	try {
		// Taken from the signed-in user, not the body, so nobody can edit another user's library
		const userId = req.user.id;
		const bookId = req.params.id;

		const { status } = req.body;

		// Status is the only field that can change, so it must be a valid reading status
		const newStatus = typeof status === "string" ? status.toUpperCase() : null;
		if (!READING_STATUSES.includes(newStatus)) {
			return res.status(400).json({
				error: `Status must be one of: ${READING_STATUSES.join(", ")}`,
			});
		}

		// Looking up by both ids so another user's entry is never found
		const libraryItem = await db.orm.public.Library.where({
			userId,
			bookId,
		}).first();

		if (!libraryItem) {
			return res.status(404).json({ error: "Book not found in library" });
		}

		// Update library status
		const updatedItem = await db.orm.public.Library.where({
			id: libraryItem.id,
		}).update({ status: newStatus });

		res.status(200).json({
			status: "Success",
			data: updatedItem,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			error: "Could not update status of book",
		});
	}
}

async function removeFromLibrary(req, res) {
	try {
		// Taken from the signed-in user, not the body, so nobody can edit another user's library
		const userId = req.user.id;
		const bookId = req.params.id;

		const libraryItem = await db.orm.public.Library.where({
			userId,
			bookId,
		}).first();

		if (!libraryItem) {
			return res.status(404).json({ error: "Book not found in library" });
		}

		// Remove book from library of specific user
		await db.orm.public.Library.where({
			id: libraryItem.id,
		}).delete();

		res.status(200).json({
			status: "Success",
			message: "Book removed from library",
		});
	} catch (error) {
		console.log(error);
		return res
			.status(500)
			.json({ error: "Could not remove book from library" });
	}
}

export { addToLibrary, updateLibrary, removeFromLibrary };
