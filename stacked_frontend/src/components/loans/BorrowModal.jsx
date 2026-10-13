import { useState } from "react";
import Modal from "../Modal.jsx";
import LoanDetails from "./LoanDetails.jsx";
import { borrowBook } from "../../lib/loans.js";
import { apiErrorMessage } from "../../lib/api.js";
import {
  LOAN_PERIOD_DAYS,
  MAX_RENEWALS,
  addDays,
  formatDate,
} from "../../pages/user/loanData.js";

function BorrowModal({ book, onClose, onBorrowed }) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    setError("");
    setIsSaving(true);
    try {
      onBorrowed(await borrowBook(book.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not borrow this book."));
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Borrow Book"
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel="Borrow"
      busyLabel="Borrowing..."
      size="md"
    >
      <LoanDetails
        loan={{ book }}
        facts={[
          ["Borrowed", formatDate(new Date())],
          ["Due date", formatDate(addDays(new Date(), LOAN_PERIOD_DAYS))],
        ]}
      />
      <p className="mt-5 text-sm text-muted">
        You'll have this book for {LOAN_PERIOD_DAYS} days and can renew it up to{" "}
        {MAX_RENEWALS} times if no one has reserved it.
      </p>
    </Modal>
  );
}

export default BorrowModal;
