import { db } from "../prisma/db.ts";

const STATUSES = ["PAID", "UNPAID"];

// UUID format. Postgres throws an error for any other format
const UUID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Change the date format which if sent from Postgres
const toIsoString = (value) =>
	value &&
	new Date(
		value.replace(" ", "T").replace(/([+-]\d{2})$/, "$1:00"),
	).toISOString();

// Finds rows of one model by a list of ids, returned as a Map keyed by id
async function byId(model, ids, fields) {
	const unique = [...new Set(ids)];
	if (unique.length === 0) return new Map();

	let query = db.orm.public[model].where((row) => row.id.in(unique));
	if (fields) query = query.select(...fields);
	const rows = await query.all();
	return new Map(rows.map((row) => [row.id, row]));
}

const PERSON_FIELDS = ["id", "name", "surname", "email"];

// Attach the loan, book, member and issuing admin to fine
async function withDetails(fines) {
	const loans = await byId(
		"LoanedBook",
		fines.map((fine) => fine.loanId),
	);
	const copies = await byId(
		"BookCopy",
		[...loans.values()].map((loan) => loan.bookCopyId),
	);
	const books = await byId(
		"Book",
		[...copies.values()].map((copy) => copy.bookId),
	);
	const people = await byId(
		"User",
		fines.flatMap((fine) => [fine.userId, fine.adminId]),
		PERSON_FIELDS,
	);

	return fines.map((fine) => {
		const loan = loans.get(fine.loanId);
		const book = books.get(copies.get(loan?.bookCopyId)?.bookId);

		return {
			id: fine.id,
			loanId: fine.loanId,
			status: fine.datePaid ? "PAID" : "UNPAID",
			amount: Number(fine.amountOwed),
			daysOverdue: fine.daysOverDue,
			// Fines are issued when the late book is checked in
			issuedOn: toIsoString(loan?.returnedAt),
			datePaid: toIsoString(fine.datePaid),
			dueDate: loan?.dueDate,
			book: book && {
				id: book.id,
				title: book.title,
				author: book.author,
				coverImageUrl: book.coverImageUrl,
			},
			user: people.get(fine.userId),
			issuedBy: people.get(fine.adminId),
		};
	});
}

// Newest fines first, by the date the book came back
const byIssuedDesc = (a, b) =>
	new Date(b.issuedOn ?? 0) - new Date(a.issuedOn ?? 0);


async function getAllFines(req, res) {
	try {
		const status = (req.query.status || "").trim().toUpperCase();

		if (status && !STATUSES.includes(status)) {
			return res
				.status(400)
				.json({ error: `Status must be one of: ${STATUSES.join(", ")}` });
		}

		const fines = await db.orm.public.Fine.all();

		const data = (await withDetails(fines))
			.filter((fine) => !status || fine.status === status)
			.sort(byIssuedDesc);
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch fines" });
	}
}


async function getMyFines(req, res) {
	try {
		const fines = await db.orm.public.Fine.where({
			userId: req.user.id,
		}).all();

		const data = (await withDetails(fines)).sort(byIssuedDesc);
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not fetch fines" });
	}
}


async function payFine(req, res) {
	try {
		const fineId = req.params.id;

		if (!UUID_PATTERN.test(fineId)) {
			return res.status(404).json({ error: "Fine not found" });
		}

		const fine = await db.orm.public.Fine.where({ id: fineId }).first();

		if (!fine) {
			return res.status(404).json({ error: "Fine not found" });
		}

		if (fine.datePaid) {
			return res.status(400).json({ error: "This fine has already been paid" });
		}

		const updated = await db.orm.public.Fine.where({ id: fine.id }).update({
			datePaid: new Date().toISOString(),
		});

		const [data] = await withDetails([updated]);
		res.status(200).json({ status: "success", data });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Could not record payment" });
	}
}

export { getAllFines, getMyFines, payFine };
