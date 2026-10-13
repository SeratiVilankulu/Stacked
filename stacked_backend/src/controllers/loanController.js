import { db } from "../prisma/db.ts";
import { syncCopiesAvailable } from "./bookCopyController.js";
import {
	UUID_PATTERN,
	toDateString,
	toIsoString,
	daysBetween,
	addDays,
	readyToCollect,
	copiesFree,
} from "../utils/bookSchedule.js";

const LOAN_PERIOD_DAYS = 30;
const MAX_RENEWALS = 2;
const FINE_PER_DAY = 15; // R15

const STATUSES = ["LOANED", "OVERDUE", "RETURNED"];

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
			borrowedOn: toIsoString(loan.loanDate),
			dueDate: loan.dueDate,
			returnedOn: toIsoString(loan.returnedAt),
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
		const filtered = status
			? detailed.filter((loan) => loan.status === status)
			: detailed;

		// Attach the user's name and email, so admins can see who has each book
		const userIds = [...new Set(filtered.map((loan) => loan.userId))];
		const users =
			userIds.length > 0
				? await db.orm.public.User.where((user) => user.id.in(userIds))
						.select("id", "name", "surname", "email")
						.all()
				: [];
		const userById = new Map(users.map((user) => [user.id, user]));
		const data = filtered.map((loan) => ({
			...loan,
			user: userById.get(loan.userId),
		}));

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

/* Lends a copy of the book to the user. If they have a reservation for it that has
 started, the reservation is collected and the loan runs until its end date.
 Returns { loan }, or { status, error } when the book can't be lent. */
async function lendBook(bookId, userId) {
	const [book, borrower] = await Promise.all([
		db.orm.public.Book.where({ id: bookId }).first(),
		db.orm.public.User.where({ id: userId }).first(),
	]);

	if (!book) return { status: 404, error: "Book not found" };

	if (!borrower) return { status: 404, error: "User not found" };

	if (borrower.status === "SUSPENDED") {
		return { status: 403, error: "Suspended accounts cannot borrow books" };
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
			return { status: 400, error: "This book is already on loan to this user" };
		}
	}

	const now = new Date();
	const reservation = (
		await db.orm.public.Reservation.where({
			bookId,
			userId,
			status: "PENDING",
		}).all()
	).find(readyToCollect);
	const dueDate = reservation
		? reservation.endDate
		: toDateString(addDays(now, LOAN_PERIOD_DAYS));

	// Copies held for other members' reservations can't be lent out
	const free = await copiesFree(db, bookId, toDateString(now), dueDate, {
		ignoreReservationId: reservation?.id,
	});

	if (free < 1) {
		return {
			status: 400,
			error: "All copies of this book are on loan or reserved for the next few weeks",
		};
	}

	// The loan, the copy's status, the book's count and the reservation are saved together
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
			dueDate,
			returnedAt: null,
			status: "LOANED",
			renewals: 0,
		});

		if (reservation) {
			await tx.orm.public.Reservation.where({ id: reservation.id }).update({
				status: "FULFILLED",
			});
		}

		await syncCopiesAvailable(tx, bookId);
		return loan;
	});

	if (!loan) {
		return { status: 400, error: "No copies of this book are available right now" };
	}

	return { loan };
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

		const { loan, status, error } = await lendBook(bookId, userId);

		if (!loan) {
			return res.status(status).json({ error });
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
		const newDueDate = toDateString(addDays(loan.dueDate, LOAN_PERIOD_DAYS));

		// The extra days must not take a copy another member has reserved
		const free = await copiesFree(
			db,
			copy.bookId,
			toDateString(addDays(loan.dueDate, 1)),
			newDueDate,
		);

		if (free < 1) {
			return res.status(400).json({
				error: "This book is reserved by another member and cannot be renewed",
			});
		}

		const updated = await db.orm.public.LoanedBook.where({
			id: loan.id,
		}).update({
			dueDate: newDueDate,
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

export {
	LOAN_PERIOD_DAYS,
	lendBook,
	withBookDetails,
	getMyLoans,
	getAllLoans,
	getLoan,
	borrowBook,
	renewLoan,
	returnLoan,
};
