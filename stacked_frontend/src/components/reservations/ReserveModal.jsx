import { useState } from "react";
import Modal from "../Modal.jsx";
import FormField from "../FormField.jsx";
import LoanDetails from "../loans/LoanDetails.jsx";
import { INPUT_CLASSES } from "../../lib/forms.js";
import { apiErrorMessage } from "../../lib/api.js";
import {
  MAX_DAYS_AHEAD,
  createReservation,
  toInputDate,
} from "../../lib/reservations.js";
import {
  LOAN_PERIOD_DAYS,
  addDays,
  formatDate,
} from "../../pages/user/loanData.js";

// Days a reservation can be collected after it starts, before it expires
const COLLECT_WINDOW_DAYS = 3;

// Date inputs give "YYYY-MM-DD", read here as local midnight so the day never shifts
const fromInputDate = (value) => new Date(`${value}T00:00`);
const shift = (value, days) => toInputDate(addDays(fromInputDate(value), days));

// Lets a member hold a copy for dates in the future. Calls onReserved(reservation) after it is saved.
function ReserveModal({ book, onClose, onReserved }) {
  const firstDay = toInputDate(addDays(new Date(), 1));
  const lastStart = toInputDate(addDays(new Date(), MAX_DAYS_AHEAD));

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(shift(firstDay, LOAN_PERIOD_DAYS - 1));
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const lastEnd = startDate && shift(startDate, LOAN_PERIOD_DAYS - 1);
  const valid = startDate && endDate && endDate >= startDate && endDate <= lastEnd;
  const days = valid
    ? Math.round((fromInputDate(endDate) - fromInputDate(startDate)) / 864e5) + 1
    : 0;

  // Moving the start keeps the end inside the allowed length
  const changeStart = (value) => {
    setStartDate(value);
    if (value && (endDate < value || endDate > shift(value, LOAN_PERIOD_DAYS - 1))) {
      setEndDate(shift(value, LOAN_PERIOD_DAYS - 1));
    }
  };

  const submit = async () => {
    setError("");
    setIsSaving(true);
    try {
      onReserved(await createReservation({ bookId: book.id, startDate, endDate }));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not reserve this book."));
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Reserve Book"
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel="Reserve"
      busyLabel="Reserving..."
      size="md"
    >
      <LoanDetails
        loan={{ book }}
        facts={
          valid
            ? [
                ["Collect between", `${formatDate(fromInputDate(startDate))} - ${formatDate(addDays(fromInputDate(startDate), COLLECT_WINDOW_DAYS))}`],
                ["Return by", formatDate(fromInputDate(endDate))],
                ["Length", `${days} day${days === 1 ? "" : "s"}`],
              ]
            : []
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <FormField label="From">
          <input
            type="date"
            value={startDate}
            min={firstDay}
            max={lastStart}
            onChange={(e) => changeStart(e.target.value)}
            className={INPUT_CLASSES}
            required
          />
        </FormField>
        <FormField label="Until">
          <input
            type="date"
            value={endDate}
            min={startDate || firstDay}
            max={lastEnd}
            onChange={(e) => setEndDate(e.target.value)}
            className={INPUT_CLASSES}
            required
          />
        </FormField>
      </div>

      <p className="mt-5 text-sm text-muted">
        A copy is held for you for up to {LOAN_PERIOD_DAYS} days, starting any
        day in the next {MAX_DAYS_AHEAD} days. Collect it within{" "}
        {COLLECT_WINDOW_DAYS} days of the start date or the reservation expires.
      </p>
    </Modal>
  );
}

export default ReserveModal;
