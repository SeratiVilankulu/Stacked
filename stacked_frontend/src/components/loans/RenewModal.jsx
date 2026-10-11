import { useState } from "react";
import Modal from "../Modal.jsx";
import LoanDetails from "./LoanDetails.jsx";
import { renewLoan } from "../../lib/loans.js";
import { apiErrorMessage } from "../../lib/api.js";
import {
  LOAN_PERIOD_DAYS,
  MAX_RENEWALS,
  addDays,
  formatDate,
} from "../../pages/user/loanData.js";

// Confirms a renewal and shows the new due date. Calls onRenewed(loan) after it is saved.
function RenewModal({ loan, onClose, onRenewed }) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    setError("");
    setIsSaving(true);
    try {
      onRenewed(await renewLoan(loan.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not renew this loan."));
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Renew Book"
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel="Renew"
      busyLabel="Renewing..."
      size="md"
    >
      <LoanDetails
        loan={loan}
        facts={[
          ["Current due date", formatDate(loan.dueDate)],
          ["New due date", formatDate(addDays(loan.dueDate, LOAN_PERIOD_DAYS))],
          ["Renewals used", `${loan.renewals} of ${MAX_RENEWALS}`],
        ]}
      />
      <p className="mt-5 text-sm text-muted">
        Renewing gives you another {LOAN_PERIOD_DAYS} days with this book.
      </p>
    </Modal>
  );
}

export default RenewModal;
