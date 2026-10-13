// Date helpers and the copy calendar shared by loans and reservations

const DAY_MS = 24 * 60 * 60 * 1000;

// Days a member has to collect a reservation once it starts, before it expires
const COLLECT_WINDOW_DAYS = 3;

// UUID format. Postgres throws an error for any other format
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// "YYYY-MM-DD", the format the date columns store. Strings in this format compare in date order
const toDateString = (date) => new Date(date).toISOString().slice(0, 10);

// Change the date format which is sent from Postgres
const toIsoString = (value) =>
	value &&
	new Date(
		value.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00"),
	).toISOString();

const daysBetween = (from, to) =>
	Math.round(
		(new Date(toDateString(new Date(to))) -
			new Date(toDateString(new Date(from)))) /
			DAY_MS,
	);

const addDays = (date, days) =>
	new Date(new Date(date).getTime() + days * DAY_MS);

const today = () => toDateString(new Date());

// Last day a reservation can be collected
const collectBy = (reservation) =>
	toDateString(addDays(reservation.startDate, COLLECT_WINDOW_DAYS));

// Status is only saved when a reservation is collected or cancelled, so an uncollected one past its date window is reported as expired
const reservationStatus = (reservation) => {
	const status = reservation.status || "PENDING";
	if (status === "PENDING" && today() > collectBy(reservation)) return "EXPIRED";
	return status;
};

// A pending reservation can be collected from its start date
const readyToCollect = (reservation) =>
	reservationStatus(reservation) === "PENDING" &&
	reservation.startDate <= today();

/* Unreturned loans hold a copy until their due date (or today, if overdue) and
 pending reservations hold one from their start to end date. */
async function copiesFree(tx, bookId, from, to, { ignoreReservationId } = {}) {
	const copies = await tx.orm.public.BookCopy.where({ bookId }).all();
	if (copies.length === 0) return 0;

	const now = today();
	const loans = await tx.orm.public.LoanedBook.where((loan) =>
		loan.bookCopyId.in(copies.map((copy) => copy.id)),
	)
		.where({ returnedAt: null })
		.all();
	const reservations = await tx.orm.public.Reservation.where({
		bookId,
		status: "PENDING",
	}).all();

	const bookings = [
		...loans.map((loan) => [now, loan.dueDate > now ? loan.dueDate : now]),
		...reservations
			.filter(
				(reservation) =>
					reservation.id !== ignoreReservationId &&
					reservationStatus(reservation) === "PENDING",
			)
			.map((reservation) => [reservation.startDate, reservation.endDate]),
	].filter(([start, end]) => start <= to && end >= from);

	// The busiest day is always the first day or a day a booking starts
	const days = [from, ...bookings.map(([start]) => start).filter((d) => d > from)];
	const busiest = Math.max(
		0,
		...days.map(
			(day) =>
				bookings.filter(([start, end]) => start <= day && end >= day).length,
		),
	);

	return copies.length - busiest;
}

export {
	COLLECT_WINDOW_DAYS,
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
};
