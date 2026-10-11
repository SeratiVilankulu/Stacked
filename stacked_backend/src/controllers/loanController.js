import { db } from "../prisma/db.ts";
import { syncCopiesAvailable } from "./bookCopyController.js";

const LOAN_PERIOD_DAYS = 30;
const MAX_RENEWALS = 2;
const FINE_PER_DAY = 15; // R15

const STATUSES = ["LOANED", "OVERDUE", "RETURNED"];

// UUID format. Postgres throws an error for any other format
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const DAY_MS = 24 * 60 * 60 * 1000;

// "YYYY-MM-DD", the format the ReturnDate column stores
const toDateString = (date) => date.toISOString().slice(0, 10);

const daysBetween = (from, to) =>
	Math.round(
		(new Date(toDateString(new Date(to))) -
			new Date(toDateString(new Date(from)))) /
			DAY_MS,
	);

const addDays = (date, days) =>
	new Date(new Date(date).getTime() + days * DAY_MS);

// Days a loan is past its due date, days remain 0 while it is still on time
const daysOverdue = (loan, on = new Date()) =>
	Math.max(daysBetween(loan.dueDate, on), 0);

// Status is only updated on return, so an unreturned loan past its due date is reported as overdue
const currentStatus = (loan) => {
	if (loan.returnedAt) return "RETURNED";
	return daysOverdue(loan) > 0 ? "OVERDUE" : "LOANED";
};

async function withBookDetails(loans) {
	if (loans.length === 0) return [];

	const copyIds = [...new Set(loans.map((loan) => loan.bookCopyId))];
	const copies = await db.orm.public.BookCopy.where((copy) =>
		copy.id.in(copyIds),
	).all();

	const bookIds = [...new Set(copies.map((copy) => copy.bookId))];
	const books = await db.orm.public.Book.where((book) =>
		book.id.in(bookIds),
	).all();

	const copyById = new Map(copies.map((copy) => [copy.id, copy]));
	const bookById = new Map(books.map((book) => [book.id, book]));

	return loans.map((loan) => {
		const copy = copyById.get(loan.bookCopyId);
		const book = copy && bookById.get(copy.bookId);
		const status = currentStatus(loan);

		return {
			id: loan.id,
			userId: loan.userId,
			status,
			borrowedOn: loan.loanDate,
			dueDate: loan.dueDate,
			returnedOn: loan.returnedAt,
			renewals: loan.renewals,
			daysOverdue: status === "RETURNED" ? 0 : daysOverdue(loan),
			fine: status === "RETURNED" ? 0 : daysOverdue(loan) * FINE_PER_DAY,
			copy: copy && { id: copy.id, name: copy.name },
			book: book && {
				id: book.id,
				title: book.title,
				author: book.author,
				genre: book.genre,
				coverImageUrl: book.coverImageUrl,
			},
		};
	});
}

// Finds a loan the signed-in user is allowed to see
async function findLoan(req, res) {
	const loanId = req.params.id;

	if (!UUID_PATTERN.test(loanId)) {
		res.status(404).json({ error: "Loan not found" });
		return null;
	}

	const loan = await db.orm.public.LoanedBook.where({ id: loanId }).first();

	if (!loan || (req.user.role !== "ADMIN" && loan.userId !== req.user.id)) {
		res.status(404).json({ error: "Loan not found" });
		return null;
	}

	return loan;
}

// Lists the signed-in user's loans, newest first
async function getMyLoans(req, res) {
	try {
		const loans = await db.orm.public.LoanedBook.where({ userId: req.user.id })
			.orderBy((loan) => loan.loanDate.desc())
			.all();

		res
			.status(200)
			.json({ status: "success", data: await withBookDetails(loans) });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch loans" });
	}
}

async function getAllLoans(req, res) {
	try {
		const status = (req.query.status || "").trim().toUpperCase();
		const userId = (req.query.userId || "").trim();

		if (status && !STATUSES.includes(status)) {
			return res
				.status(400)
				.json({ error: `Status must be one of: ${STATUSES.join(", ")}` });
		}

		if (userId && !UUID_PATTERN.test(userId)) {
			return res.status(400).json({ error: "Invalid user id" });
		}

		const loans = await (
			userId
				? db.orm.public.LoanedBook.where({ userId })
				: db.orm.public.LoanedBook
		)
			.orderBy((loan) => loan.loanDate.desc())
			.all();

		// Filtered after loading because overdue is worked out from the due date
		const detailed = await withBookDetails(loans);
		const data = status
			? detailed.filter((loan) => loan.status === status)
			: detailed;

		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch loans" });
	}
}

async function getLoan(req, res) {
	try {
		const loan = await findLoan(req, res);
		if (!loan) return;

		const [data] = await withBookDetails([loan]);
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch loan" });
	}
}

async function borrowBook(req, res) {
	try {
		const { bookId } = req.body;
		const userId =
			req.user.role === "ADMIN" && req.body.userId
				? req.body.userId
				: req.user.id;

		if (!bookId || !UUID_PATTERN.test(bookId)) {
			return res.status(400).json({ error: "A valid bookId is required" });
		}

		if (!UUID_PATTERN.test(userId)) {
			return res.status(400).json({ error: "Invalid user id" });
		}

		const [book, borrower] = await Promise.all([
			db.orm.public.Book.where({ id: bookId }).first(),
			db.orm.public.User.where({ id: userId }).first(),
		]);

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		if (!borrower) {
			return res.status(404).json({ error: "User not found" });
		}

		if (borrower.status === "SUSPENDED") {
			return res
				.status(403)
				.json({ error: "Suspended accounts cannot borrow books" });
		}

		const copies = await db.orm.public.BookCopy.where({ bookId }).all();

		// A user can only hold one copy of the same book at a time
		if (copies.length > 0) {
			const activeLoan = await db.orm.public.LoanedBook.where((loan) =>
				loan.bookCopyId.in(copies.map((copy) => copy.id)),
			)
				.where({ userId, returnedAt: null })
				.first();

			if (activeLoan) {
				return res
					.status(400)
					.json({ error: "This book is already on loan to this user" });
			}
		}

		const now = new Date();

		// The loan, the copy's status and the book's count are saved together
		const loan = await db.transaction(async (tx) => {

			const copy = await tx.orm.public.BookCopy.where({
				bookId,
				status: "AVAILABLE",
			}).first();

			if (!copy) return null;

			await tx.orm.public.BookCopy.where({ id: copy.id }).update({
				status: "LOANED",
			});

			const loan = await tx.orm.public.LoanedBook.create({
				bookCopyId: copy.id,
				userId,
				loanDate: now.toISOString(),
				dueDate: toDateString(addDays(now, LOAN_PERIOD_DAYS)),
				returnedAt: null,
				status: "LOANED",
				renewals: 0,
			});

			await syncCopiesAvailable(tx, bookId);
			return loan;
		});

		if (!loan) {
			return res
				.status(400)
				.json({ error: "No copies of this book are available right now" });
		}

		const [data] = await withBookDetails([loan]);
		res.status(201).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not borrow book" });
	}
}

// Pushes the due date back by another loan perio
async function renewLoan(req, res) {
	try {
		const loan = await findLoan(req, res);
		if (!loan) return;

		const status = currentStatus(loan);

		if (status === "RETURNED") {
			return res
				.status(400)
				.json({ error: "This book has already been returned" });
		}

		if (status === "OVERDUE") {
			return res
				.status(400)
				.json({ error: "Overdue books must be returned, not renewed" });
		}

		if (loan.renewals >= MAX_RENEWALS) {
			return res
				.status(400)
				.json({ error: `A loan can only be renewed ${MAX_RENEWALS} times` });
		}
	
		const copy = await db.orm.public.BookCopy.where({
			id: loan.bookCopyId,
		}).first();
		const reservation = await db.orm.public.Reservation.where({
			bookId: copy.bookId,
			status: "PENDING",
		}).first();

		if (reservation) {
			return res.status(400).json({
				error: "This book is reserved by another member and cannot be renewed",
			});
		}

		const updated = await db.orm.public.LoanedBook.where({
			id: loan.id,
		}).update({
			dueDate: toDateString(addDays(loan.dueDate, LOAN_PERIOD_DAYS)),
			renewals: loan.renewals + 1,
		});

		const [data] = await withBookDetails([updated]);
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not renew loan" });
	}
}

// Only the Admin checks a book back in. A fine is issued if it comes back late
async function returnLoan(req, res) {
	try {
		const loan = await findLoan(req, res);
		if (!loan) return;

		if (loan.returnedAt) {
			return res
				.status(400)
				.json({ error: "This book has already been returned" });
		}

		const now = new Date();
		const lateDays = daysOverdue(loan, now);

		// The loan, the copy, the book's count and any fine are saved together
		const { updated, fine } = await db.transaction(async (tx) => {
			const updated = await tx.orm.public.LoanedBook.where({
				id: loan.id,
			}).update({
				returnedAt: now.toISOString(),
				status: "RETURNED",
			});

			const copy = await tx.orm.public.BookCopy.where({
				id: loan.bookCopyId,
			}).update({
				status: "AVAILABLE",
			});
			await syncCopiesAvailable(tx, copy.bookId);

			const fine =
				lateDays > 0
					? await tx.orm.public.Fine.create({
							loanId: loan.id,
							userId: loan.userId,
							// Record shows who checked book in
							adminId: req.user.id,
							daysOverDue: lateDays,
							amountOwed: String(lateDays * FINE_PER_DAY),
							datePaid: null,
						})
					: null;

			return { updated, fine };
		});

		const [data] = await withBookDetails([updated]);
		res
			.status(200)
			.json({ status: "success", data: { ...data, fineIssued: fine } });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not return book" });
	}
}

export { getMyLoans, getAllLoans, getLoan, borrowBook, renewLoan, returnLoan };
