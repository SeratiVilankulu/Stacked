import { db } from "../prisma/db.ts";

const CONDITIONS = ["NEW", "GOOD", "FAIR", "POOR"];

// Most copies that can be added in one go, so a typo can't create thousands of rows
const MAX_NEW_COPIES = 10;

// Recounts the book's available copies and saves the number on the book, so it always matches the BookCopy rows
async function syncCopiesAvailable(tx, bookId) {
	const { count } = await tx.orm.public.BookCopy.where({
		bookId,
		status: "AVAILABLE",
	}).aggregate((agg) => ({ count: agg.count() }));

	return tx.orm.public.Book.where({ id: bookId }).update({
		copiesAvailable: count,
	});
}

// Finds the highest "Copy N" number so new copies carry on from it, even after some were removed
const nextCopyNumber = (copies) =>
	copies.reduce((highest, copy) => {
		const number = parseInt(copy.name?.match(/^Copy (\d+)$/)?.[1]);
		return Number.isNaN(number) ? highest : Math.max(highest, number);
	}, 0) + 1;

// Lists every copy of a book, so the admin can see which ones are on loan
async function getBookCopies(req, res) {
	try {
		const bookId = req.params.id;

		const book = await db.orm.public.Book.where({ id: bookId }).first();

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		// Sorted here rather than in the database, which would put "Copy 10" before "Copy 2"
		const copies = (await db.orm.public.BookCopy.where({ bookId }).all()).sort(
			(a, b) =>
				(a.name || "").localeCompare(b.name || "", undefined, { numeric: true }),
		);

		res.status(200).json({ status: "success", data: copies });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch book copies" });
	}
}

// Lets an admin add more copies of a book that is already in the catalogue
async function addBookCopies(req, res) {
	try {
		const bookId = req.params.id;
		const count = Number(req.body.count ?? 1); // One copy unless a number is given
		const condition = (req.body.condition || "NEW").toUpperCase();

		if (!Number.isInteger(count) || count < 1 || count > MAX_NEW_COPIES) {
			return res.status(400).json({
				error: `Count must be a whole number from 1 to ${MAX_NEW_COPIES}`,
			});
		}

		if (!CONDITIONS.includes(condition)) {
			return res
				.status(400)
				.json({ error: `Condition must be one of: ${CONDITIONS.join(", ")}` });
		}

		const book = await db.orm.public.Book.where({ id: bookId }).first();

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		// The new copies and the updated count are saved together
		const { copies, updatedBook } = await db.transaction(async (tx) => {
			const existing = await tx.orm.public.BookCopy.where({ bookId })
				.select("name")
				.all();
			const first = nextCopyNumber(existing);

			const copies = await tx.orm.public.BookCopy.createAll(
				Array.from({ length: count }, (_, i) => ({
					bookId,
					name: `Copy ${first + i}`,
					condition,
					status: "AVAILABLE",
				})),
			);

			const updatedBook = await syncCopiesAvailable(tx, bookId);
			return { copies, updatedBook };
		});

		res.status(201).json({
			status: "success",
			data: { copies, copiesAvailable: updatedBook.copiesAvailable },
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not add book copies" });
	}
}

// Removes one copy, e.g. when it is lost or damaged, but only if it is on the shelf and was never loaned
async function removeBookCopy(req, res) {
	try {
		const { id: bookId, copyId } = req.params;

		// Looking up by both ids so a copy of another book is never removed
		const copy = await db.orm.public.BookCopy.where({ id: copyId, bookId }).first();

		if (!copy) {
			return res.status(404).json({ error: "Book copy not found" });
		}

		if (copy.status !== "AVAILABLE") {
			return res.status(400).json({
				error: `This copy is ${copy.status.toLowerCase()} and cannot be removed until it is back on the shelf`,
			});
		}

		// Loans must keep pointing at their copy, so the database blocks the delete
		const loan = await db.orm.public.LoanedBook.where({
			bookCopyId: copy.id,
		}).first();

		if (loan) {
			return res.status(400).json({
				error: "This copy has loan history and cannot be removed",
			});
		}

		// The copy and the updated count are saved together
		const updatedBook = await db.transaction(async (tx) => {
			await tx.orm.public.BookCopy.where({ id: copy.id }).delete();
			return syncCopiesAvailable(tx, bookId);
		});

		res.status(200).json({
			status: "success",
			message: "Book copy removed",
			data: { copiesAvailable: updatedBook.copiesAvailable },
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not remove book copy" });
	}
}

export { syncCopiesAvailable, getBookCopies, addBookCopies, removeBookCopy };
