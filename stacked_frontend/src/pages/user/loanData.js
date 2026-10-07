import { SAMPLE_BOOKS } from "../admin/bookData.js";

export const LOAN_PERIOD_DAYS = 14;
export const MAX_RENEWALS = 2;
export const FINE_PER_DAY = 5; // Rands

export const LOAN_STATUS_LABELS = {
  ON_LOAN: "On Loan",
  DUE_SOON: "Due Soon",
  OVERDUE: "Overdue",
  RETURNED: "Returned",
};

export const LOAN_STATUS_STYLES = {
  ON_LOAN: "bg-success/10 text-success",
  DUE_SOON: "bg-sky text-teal",
  OVERDUE: "bg-orange-soft text-orange-ink",
  RETURNED: "bg-sand text-muted",
};

const DAY_MS = 24 * 60 * 60 * 1000;

// Whole days from today until `date` (negative once it has passed).
export function daysUntil(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / DAY_MS);
}

export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Status is derived from the dates so it never goes stale.
export function loanStatus(loan) {
  if (loan.returnedOn) return "RETURNED";
  const days = daysUntil(loan.dueDate);
  if (days < 0) return "OVERDUE";
  if (days <= 3) return "DUE_SOON";
  return "ON_LOAN";
}

export function loanFine(loan) {
  if (loan.returnedOn) return 0;
  return Math.max(0, -daysUntil(loan.dueDate)) * FINE_PER_DAY;
}

const book = (title) => SAMPLE_BOOKS.find((b) => b.title === title);

// Dates are relative to today so the sample always shows every status.
const daysFromNow = (n) => addDays(new Date(), n).toISOString();

// TODO: Will remove once endpoint call is made in the frontend
export const SAMPLE_LOANS = [
  {
    id: 1,
    book: book("Atomic Habits"),
    borrowedOn: daysFromNow(-9),
    dueDate: daysFromNow(5),
    renewals: 0,
  },
  {
    id: 2,
    book: book("The Midnight Library"),
    borrowedOn: daysFromNow(-12),
    dueDate: daysFromNow(2),
    renewals: 0,
  },
  {
    id: 3,
    book: book("Thinking, Fast and Slow"),
    borrowedOn: daysFromNow(-4),
    dueDate: daysFromNow(10),
    renewals: 1,
  },
  {
    id: 4,
    book: book("Educated"),
    borrowedOn: daysFromNow(-2),
    dueDate: daysFromNow(12),
    renewals: 0,
  },
  {
    id: 5,
    book: book("Sapiens"),
    borrowedOn: daysFromNow(-24),
    dueDate: daysFromNow(-10),
    renewals: 2,
  },
  {
    id: 6,
    book: book("Project Hail Mary"),
    borrowedOn: daysFromNow(-40),
    dueDate: daysFromNow(-26),
    returnedOn: daysFromNow(-28),
    renewals: 0,
  },
  {
    id: 7,
    book: book("The Silent Patient"),
    borrowedOn: daysFromNow(-60),
    dueDate: daysFromNow(-46),
    returnedOn: daysFromNow(-47),
    renewals: 1,
  },
  {
    id: 8,
    book: book("Circe"),
    borrowedOn: daysFromNow(-90),
    dueDate: daysFromNow(-76),
    returnedOn: daysFromNow(-80),
    renewals: 0,
  },
];
