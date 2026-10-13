import { db } from "../prisma/db.ts";
import {
	LOAN_PERIOD_DAYS,
	lendBook,
	withBookDetails,
} from "./loanController.js";
import {
	UUID_PATTERN,
	toDateString,
	toIsoString,
	daysBetween,
	addDays,
	today,
	collectBy,
	reservationStatus,
	readyToCollect,
	copiesFree,
} from "../utils/bookSchedule.js";

// How far ahead a book can be reserved
const MAX_DAYS_AHEAD = 30;
// Reservations a member can have waiting at once
const MAX_ACTIVE_RESERVATIONS = 3;

const STATUSES = ["PENDING", "FULFILLED", "CANCELLED", "EXPIRED"];

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // Date format

// A real calendar date in "YYYY-MM-DD" form
const isDate = (value) =>
	typeof value === "string" &&
	DATE_PATTERN.test(value) &&
	!Number.isNaN(Date.parse(value)) &&
	toDateString(value) === value;

async function withDetails(reservations) {
	if (reservations.length === 0) return [];

	const bookIds = [...new Set(reservations.map((r) => r.bookId))];
	const books = await db.orm.public.Book.where((book) =>
		book.id.in(bookIds),
	).all();
	const bookById = new Map(books.map((book) => [book.id, book]));

	return reservations.map((reservation) => {
		const book = bookById.get(reservation.bookId);

		return {
			id: reservation.id,
			userId: reservation.userId,
			status: reservationStatus(reservation),
			readyToCollect: readyToCollect(reservation),
			reservedOn: toIsoString(reservation.reservationDate),
			startDate: reservation.startDate,
			endDate: reservation.endDate,
			collectBy: collectBy(reservation),
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

// Finds a reservation the signed-in user is allowed to see
async function findReservation(req, res) {
	const reservationId = req.params.id;

	if (!UUID_PATTERN.test(reservationId)) {
		res.status(404).json({ error: "Reservation not found" });
		return null;
	}

	const reservation = await db.orm.public.Reservation.where({
		id: reservationId,
	}).first();

	if (
		!reservation ||
		(req.user.role !== "ADMIN" && reservation.userId !== req.user.id)
	) {
		res.status(404).json({ error: "Reservation not found" });
		return null;
	}

	return reservation;
}

async function getMyReservations(req, res) {
	// Lists the signed-in user's reservations, soonest first
	try {
		const reservations = await db.orm.public.Reservation.where({
			userId: req.user.id,
		})
			.orderBy((reservation) => reservation.startDate.asc())
			.all();

		res
			.status(200)
			.json({ status: "success", data: await withDetails(reservations) });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch reservations" });
	}
}

async function getAllReservations(req, res) {
	try {
		const status = (req.query.status || "").trim().toUpperCase();

		if (status && !STATUSES.includes(status)) {
			return res
				.status(400)
				.json({ error: `Status must be one of: ${STATUSES.join(", ")}` });
		}

		const reservations = await db.orm.public.Reservation.orderBy(
			(reservation) => reservation.startDate.asc(),
		).all();

		// Filtered after loading because expired date is worked out from the dates
		const detailed = await withDetails(reservations);
		const filtered = status
			? detailed.filter((reservation) => reservation.status === status)
			: detailed;

		// Attach the user's name and email, so admins can see who reserved each book
		const userIds = [...new Set(filtered.map((r) => r.userId))];
		const users =
			userIds.length > 0
				? await db.orm.public.User.where((user) => user.id.in(userIds))
						.select("id", "name", "surname", "email")
						.all()
				: [];
		const userById = new Map(users.map((user) => [user.id, user]));
		const data = filtered.map((reservation) => ({
			...reservation,
			user: userById.get(reservation.userId),
		}));

		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch reservations" });
	}
}

async function createReservation(req, res) {
	// Holds a copy of a book for the signed-in user between two future dates
	try {
		const { bookId, startDate, endDate } = req.body;
		const userId = req.user.id;

		if (!bookId || !UUID_PATTERN.test(bookId)) {
			return res.status(400).json({ error: "A valid bookId is required" });
		}

		if (!isDate(startDate) || !isDate(endDate)) {
			return res
				.status(400)
				.json({
					error: "Start and end dates must be valid dates (YYYY-MM-DD)",
				});
		}

		const now = today();

		if (startDate <= now) {
			return res.status(400).json({
				error:
					"Reservations must start from tomorrow. Borrow the book to take it today",
			});
		}

		if (daysBetween(now, startDate) > MAX_DAYS_AHEAD) {
			return res.status(400).json({
				error: `Books can only be reserved up to ${MAX_DAYS_AHEAD} days ahead`,
			});
		}

		if (endDate < startDate) {
			return res
				.status(400)
				.json({ error: "The end date must be on or after the start date" });
		}

		if (daysBetween(startDate, endDate) + 1 > LOAN_PERIOD_DAYS) {
			return res.status(400).json({
				error: `A reservation can be at most ${LOAN_PERIOD_DAYS} days long`,
			});
		}

		const book = await db.orm.public.Book.where({ id: bookId }).first();

		if (!book) {
			return res.status(404).json({ error: "Book not found" });
		}

		const pending = (
			await db.orm.public.Reservation.where({ userId, status: "PENDING" }).all()
		).filter((r) => reservationStatus(r) === "PENDING");

		if (pending.some((r) => r.bookId === bookId)) {
			return res
				.status(400)
				.json({ error: "You already have a reservation for this book" });
		}

		if (pending.length >= MAX_ACTIVE_RESERVATIONS) {
			return res.status(400).json({
				error: `You can only have ${MAX_ACTIVE_RESERVATIONS} reservations at a time`,
			});
		}

		// A member still holding the book on the start date can't reserve it as well
		const copies = await db.orm.public.BookCopy.where({ bookId }).all();
		const activeLoan =
			copies.length > 0
				? await db.orm.public.LoanedBook.where((loan) =>
						loan.bookCopyId.in(copies.map((copy) => copy.id)),
					)
						.where({ userId, returnedAt: null })
						.first()
				: null;

		if (activeLoan && activeLoan.dueDate >= startDate) {
			return res.status(400).json({
				error:
					"You'll still have this book on loan then. Choose dates after it is due back",
			});
		}

		if ((await copiesFree(db, bookId, startDate, endDate)) < 1) {
			return res.status(400).json({
				error: "No copies are free for these dates. Try different dates",
			});
		}

		const reservation = await db.orm.public.Reservation.create({
			userId,
			bookId,
			reservationDate: new Date().toISOString(),
			startDate,
			endDate,
			status: "PENDING",
		});

		const [data] = await withDetails([reservation]);
		res.status(201).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not reserve book" });
	}
}

async function cancelReservation(req, res) {
	try {
		const reservation = await findReservation(req, res);
		if (!reservation) return;

		const status = reservationStatus(reservation);

		if (status !== "PENDING") {
			return res.status(400).json({
				error: `This reservation is ${status.toLowerCase()} and cannot be cancelled`,
			});
		}

		const updated = await db.orm.public.Reservation.where({
			id: reservation.id,
		}).update({ status: "CANCELLED" });

		const [data] = await withDetails([updated]);
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not cancel reservation" });
	}
}

async function collectReservation(req, res) {
	try {
		const reservation = await findReservation(req, res);
		if (!reservation) return;

		const status = reservationStatus(reservation);

		if (status !== "PENDING") {
			return res.status(400).json({
				error: `This reservation is ${status.toLowerCase()} and cannot be collected`,
			});
		}

		if (!readyToCollect(reservation)) {
			return res.status(400).json({
				error: `This reservation can be collected from ${reservation.startDate}`,
			});
		}

		// lendBook finds the reservation itself and marks it fulfilled
		const { loan, status: errorStatus, error } = await lendBook(
			reservation.bookId,
			reservation.userId,
		);

		if (!loan) {
			return res.status(errorStatus).json({ error });
		}

		const [data] = await withBookDetails([loan]);
		res.status(201).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not collect reservation" });
	}
}

export {
	getMyReservations,
	getAllReservations,
	createReservation,
	cancelReservation,
	collectReservation,
};
