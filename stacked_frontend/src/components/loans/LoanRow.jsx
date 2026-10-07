import { Link } from "react-router-dom";
import { BookOpen, CalendarDays, CreditCard, RefreshCw } from "lucide-react";
import Pill from "../Pill.jsx";
import { GENRE_LABELS } from "../../pages/admin/bookData.js";
import {
  LOAN_STATUS_LABELS,
  LOAN_STATUS_STYLES,
  MAX_RENEWALS,
  daysUntil,
  formatDate,
  loanFine,
  loanStatus,
} from "../../pages/user/loanData.js";

const ACTION_CLASSES =
  "flex w-28 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

// Due-date hint under the date: "In 5 days", "Due today", "10 days late".
function dueHint(days) {
  if (days === 0) return "Due today";
  if (days > 0) return `In ${days} day${days === 1 ? "" : "s"}`;
  return `${-days} day${days === -1 ? "" : "s"} late`;
}

function LoanRow({ loan, onRenew }) {
  const { book } = loan;
  const status = loanStatus(loan);
  const returned = status === "RETURNED";
  const overdue = status === "OVERDUE";
  const canRenew = loan.renewals < MAX_RENEWALS;

  return (
    <li className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-4 gap-y-3 py-4 md:grid-cols-[4rem_minmax(0,1fr)_7rem_9rem_7rem] md:items-center">
      <img
        src={book.coverImage}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        className="row-span-2 aspect-2/3 w-16 rounded-sm object-cover shadow-card md:row-span-1"
      />

      <div className="min-w-0">
        <Link
          to={`/books/${book.title}`}
          className="line-clamp-1 font-heading text-lg text-teal hover:underline"
        >
          {book.title}
        </Link>
        <p className="text-sm text-muted">{book.author}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <BookOpen size={13} aria-hidden="true" />
          {GENRE_LABELS[book.genre] ?? book.genre}
        </p>
      </div>

      {/* On mobile these sit in a row under the title */}
      <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-3 md:contents">
        <div>
          <Pill className={LOAN_STATUS_STYLES[status]}>
            {LOAN_STATUS_LABELS[status]}
          </Pill>
        </div>

        <div className="flex items-center gap-2.5">
          <CalendarDays size={18} aria-hidden="true" className="text-muted" />
          <div>
            <p className="text-xs text-muted">
              {returned ? "Returned" : "Due Date"}
            </p>
            <p
              className={`text-sm font-semibold ${overdue ? "text-alert" : "text-teal"}`}
            >
              {formatDate(returned ? loan.returnedOn : loan.dueDate)}
            </p>
            {!returned && (
              <p className={`text-xs ${overdue ? "text-alert" : "text-muted"}`}>
                {dueHint(daysUntil(loan.dueDate))}
              </p>
            )}
          </div>
        </div>

        <div className="md:justify-self-end">
          {returned ? (
            <Link
              to={`/books/${book.title}`}
              className={`${ACTION_CLASSES} border-border-strong text-teal hover:bg-sky/30`}
            >
              Borrow again
            </Link>
          ) : overdue ? (
            <Link
              to={`/loans/${loan.id}/pay`}
              className={`${ACTION_CLASSES} border-teal text-teal hover:bg-sky/40`}
            >
              <CreditCard size={16} aria-hidden="true" />
              Pay R{loanFine(loan)}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => onRenew(loan)}
              disabled={!canRenew}
              title={
                canRenew
                  ? `Renewed ${loan.renewals} of ${MAX_RENEWALS} times`
                  : "Renewal limit reached"
              }
              className={`${ACTION_CLASSES} border-border-strong text-teal hover:bg-sky/30`}
            >
              Renew
              <RefreshCw size={14} aria-hidden="true" className="text-muted" />
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

export default LoanRow;
