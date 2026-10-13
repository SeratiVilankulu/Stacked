import { Link } from "react-router-dom";
import { BookOpen, CalendarClock, PackageCheck, X } from "lucide-react";
import Pill from "../Pill.jsx";
import CoverImage from "../book/CoverImage.jsx";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
  reservationStatus,
} from "../../lib/reservations.js";
import { daysUntil, formatDate } from "../../pages/user/loanData.js";

const ACTION_CLASSES =
  "flex w-28 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors duration-200";

function dateHint(reservation, status) {
  if (status === "READY") return `Collect by ${formatDate(reservation.collectBy)}`;
  if (status !== "PENDING") return null;
  const days = daysUntil(reservation.startDate);
  return days === 1 ? "Starts tomorrow" : `Starts in ${days} days`;
}

function ReservationRow({ reservation, onCollect, onCancel }) {
  const { book } = reservation;
  const status = reservationStatus(reservation);
  const active = status === "PENDING" || status === "READY";
  const hint = dateHint(reservation, status);

  return (
    <li className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-4 gap-y-3 py-4 md:grid-cols-[4rem_minmax(0,1fr)_8rem_10rem_7rem] md:items-center">
      <CoverImage book={book} className="row-span-2 w-16 md:row-span-1" />

      <div className="min-w-0">
        <Link
          to={`/books/${book.id}`}
          className="line-clamp-1 font-heading text-lg text-teal hover:underline"
        >
          {book.title}
        </Link>
        <p className="text-sm text-muted">{book.author}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted">
          <BookOpen size={13} aria-hidden="true" />
          {book.genre}
        </p>
      </div>

      {/* On mobile these sit in a row under the title */}
      <div className="col-start-2 flex flex-wrap items-center gap-x-6 gap-y-3 md:contents">
        <div>
          <Pill className={RESERVATION_STATUS_STYLES[status]}>
            {RESERVATION_STATUS_LABELS[status]}
          </Pill>
        </div>

        <div className="flex items-center gap-2.5">
          <CalendarClock size={18} aria-hidden="true" className="text-muted" />
          <div>
            <p className="text-xs text-muted">Reserved for</p>
            <p className="text-sm font-semibold whitespace-nowrap text-teal">
              {formatDate(reservation.startDate)}
            </p>
            <p className="text-xs whitespace-nowrap text-muted">
              until {formatDate(reservation.endDate)}
            </p>
            {hint && (
              <p
                className={`text-xs ${status === "READY" ? "font-medium text-success" : "text-muted"}`}
              >
                {hint}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:justify-self-end">
          {status === "READY" && (
            <button
              type="button"
              onClick={() => onCollect(reservation)}
              className={`${ACTION_CLASSES} border-teal bg-teal text-cream hover:bg-teal-deep`}
            >
              <PackageCheck size={16} aria-hidden="true" />
              Collect
            </button>
          )}
          {active ? (
            <button
              type="button"
              onClick={() => onCancel(reservation)}
              className={`${ACTION_CLASSES} border-border-strong text-teal hover:bg-sky/30`}
            >
              <X size={16} aria-hidden="true" />
              Cancel
            </button>
          ) : (
            <Link
              to={`/books/${book.id}`}
              className={`${ACTION_CLASSES} border-border-strong text-teal hover:bg-sky/30`}
            >
              Reserve again
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

export default ReservationRow;
