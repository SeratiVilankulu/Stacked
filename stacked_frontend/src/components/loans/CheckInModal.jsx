import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import Modal from "../Modal.jsx";
import LoanDetails from "./LoanDetails.jsx";
import { checkInLoan } from "../../lib/loans.js";
import { apiErrorMessage } from "../../lib/api.js";
import { formatDate, loanFine } from "../../pages/user/loanData.js";

// Admin confirms a book is back on the shelf. Calls onCheckedIn(loan) after it is saved.
function CheckInModal({ loan, onClose, onCheckedIn }) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const fine = loanFine(loan);

  const submit = async () => {
    setError("");
    setIsSaving(true);
    try {
      onCheckedIn(await checkInLoan(loan.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not check in this book."));
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Check In Book"
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel="Check In"
      busyLabel="Checking in..."
      size="md"
    >
      <LoanDetails
        loan={loan}
        facts={[
          ["Member", loan.user ? `${loan.user.name} ${loan.user.surname}` : "—"],
          ["Copy", loan.copy?.name ?? "—"],
          ["Borrowed", formatDate(loan.borrowedOn)],
          ["Due", formatDate(loan.dueDate)],
        ]}
      />

      {fine > 0 ? (
        <p className="mt-5 flex items-start gap-2 rounded-md bg-orange-soft p-3 text-sm text-orange-ink">
          <TriangleAlert size={18} aria-hidden="true" className="mt-0.5 shrink-0" />
          {loan.daysOverdue} day{loan.daysOverdue === 1 ? "" : "s"} late. A R
          {fine} fine will be issued to the member.
        </p>
      ) : (
        <p className="mt-5 text-sm text-muted">
          Returned on time. The copy goes back on the shelf.
        </p>
      )}
    </Modal>
  );
}

export default CheckInModal;
