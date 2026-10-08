import { and, or } from "@prisma/orm-postgres/orm-client";
import { db } from "../prisma/db.ts";
import { uploadCoverImage, deleteCoverImage } from "../services/cloudinary.js";

// One BookCopy row is created per copy, so cap it to stop a typo creating thousands of rows
const MAX_COPIES = 10;

// Copies must be a whole number between 0 and MAX_COPIES
const isValidCopies = (value) =>
	Number.isInteger(value) && value >= 0 && value <= MAX_COPIES;

// Takes the search box, the Genre dropdown then returns one page of matching books
async function getAllBooks(req, res) {
	try {
		// Read query parameters if specific book has been searched (everything after "?" in the URL)
		const search = (req.query.search || "").trim();
		const genre = (req.query.genre || "").trim();
		const page = Math.max(parseInt(req.query.page) || 1, 1);
		const limit = Math.min(Math.max(parseInt(req.query.limit) || 8, 1), 50); // 8 per page by default, 50 at most

		// Build the search rule. Only the filters that were sent are applied
		const filter = (book) => {
			const conditions = [];
			if (genre) conditions.push(book.genre.ilike(genre));
			if (search) {
				// Check the search text against title, author and ISBN, ignoring case
				const pattern = `%${search}%`;
				conditions.push(
					or(
						book.title.ilike(pattern),
						book.author.ilike(pattern),
						book.isbn.ilike(pattern),
					),
				);
			}
			return and(...conditions); // Every filter must match
		};

		const matching = () => db.orm.public.Book.where(filter);

		// Run both queries at the same time
		const [{ count: total }, books] = await Promise.all([
			matching().aggregate((agg) => ({ count: agg.count() })),
			matching()
				.orderBy((book) => book.title.asc())
				.limit(limit)
				.offset((page - 1) * limit)
				.all(),
		]);

		res.status(200).json({
			status: "success",
			data: {
				books,
				pagination: {
					page,
					limit,
					total,
					totalPages: Math.ceil(total / limit),
				},
			},
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch books" });
	}
}

async function getBook(req, res) {
	try {
		const bookId = req.params.id;

		const book = await db.orm.public.Book.where({ id: bookId }).first();

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		res.status(200).json({ status: "success", data: book });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch book" });
	}
}

async function addBook(req, res) {
	try {
		const { title, description, genre, author, isbn, coverImageUrl } = req.body;
		const copiesAvailable = Number(req.body.copiesAvailable ?? 0); // None unless a number is given

		// Check that the required fields were filled in
		if (!title || !genre || !author || !isbn) {
			return res
				.status(400)
				.json({ error: "Title, genre, author and ISBN are required" });
		}

		if (!isValidCopies(copiesAvailable)) {
			return res
				.status(400)
				.json({
					error: `Copies available must be a whole number from 0 to ${MAX_COPIES}`,
				});
		}

		// The same book should only be catalogued once
		if (await db.orm.public.Book.where({ isbn }).first()) {
			return res
				.status(400)
				.json({ error: "Book with this ISBN already exists" });
		}

		// Upload the cover only once every check has passed
		let cover = null;
		if (req.file) {
			try {
				cover = await uploadCoverImage(req.file.buffer);
			} catch (error) {
				console.log(error);
				return res.status(502).json({ error: "Could not upload cover image" });
			}
		}

		try {
			// The book and its copies are saved together, so a failure never leaves a book without its copies
			const { book, copies } = await db.transaction(async (tx) => {
				// Taken from the signed-in admin, so the record shows who really added it
				const book = await tx.orm.public.Book.create({
					adminId: req.user.id,
					title,
					description: description || null,
					genre,
					author,
					isbn,
					// The Cloudinary link is stored, falling back to a link typed in the form
					coverImageUrl: cover?.secure_url || coverImageUrl || null,
					copiesAvailable,
				});

				// One row per physical copy, so each can be loaned out on its own
				const copies =
					copiesAvailable > 0
						? await tx.orm.public.BookCopy.createAll(
								Array.from({ length: copiesAvailable }, (_, i) => ({
									bookId: book.id,
									name: `Copy ${i + 1}`,
									condition: "NEW",
									status: "AVAILABLE",
								})),
							)
						: [];

				return { book, copies };
			});

			res.status(201).json({ status: "success", data: { ...book, copies } });
		} catch (error) {
			// if book could not be saved, Cover is removed from Cloudinary 
			if (cover) await deleteCoverImage(cover.public_id).catch(console.log);
			throw error;
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not add book" });
	}
}

async function updateBook(req, res) {
	try {
		const bookId = req.params.id;
		const { title, description, genre, author, isbn, coverImageUrl } = req.body;

		const book = await db.orm.public.Book.where({ id: bookId }).first();

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		// ISBN must stay unique
		if (isbn && isbn !== book.isbn) {
			if (await db.orm.public.Book.where({ isbn }).first()) {
				return res
					.status(400)
					.json({ error: "Book with this ISBN already exists" });
			}
		}

		// Only change the fields which sent in
		const updateData = {};
		if (title) updateData.title = title;
		if (genre) updateData.genre = genre;
		if (author) updateData.author = author;
		if (isbn) updateData.isbn = isbn;

		if (description !== undefined) updateData.description = description || null;
		if (coverImageUrl !== undefined)
			updateData.coverImageUrl = coverImageUrl || null;
		// The count follows the BookCopy rows, so typing a new number here would make it wrong
		if (req.body.copiesAvailable !== undefined) {
			return res.status(400).json({
				error: "Copies available cannot be edited directly. Add or remove book copies instead.",
			});
		}

		// When there is nothing to change
		if (Object.keys(updateData).length === 0) {
			return res.status(400).json({ error: "No fields to update" });
		}

		const updatedBook = await db.orm.public.Book.where({ id: bookId }).update(
			updateData,
		);

		res.status(200).json({ status: "success", data: updatedBook });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not update book" });
	}
}

// Deletes a book only if none of its copies have ever been loaned
async function deleteBook(req, res) {
	try {
		const bookId = req.params.id;

		// Make sure the book exists
		const book = await db.orm.public.Book.where({ id: bookId }).first();

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		// Loans must keep pointing at their copy, so the database blocks the delete
		const copies = await db.orm.public.BookCopy.where({ bookId })
			.select("id")
			.all();

		if (copies.length > 0) {
			const loan = await db.orm.public.LoanedBook.where((loanedBook) =>
				loanedBook.bookCopyId.in(copies.map((copy) => copy.id)),
			).first();

			if (loan) {
				return res.status(400).json({
					error:
						"This book has loan history and cannot be deleted. Retrieve all loaned books.",
				});
			}
		}

		// Copies, reservations and library entries are removed with it
		await db.orm.public.Book.where({ id: book.id }).delete();

		res.status(200).json({ status: "success", message: "Book deleted" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not delete book" });
	}
}

export { getAllBooks, getBook, addBook, updateBook, deleteBook };
