export const LOAN_PERIOD_DAYS = 30;
export const MAX_RENEWALS = 2;
export const FINE_PER_DAY = 15; // R15

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

// Whole days from today until 'date'
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
