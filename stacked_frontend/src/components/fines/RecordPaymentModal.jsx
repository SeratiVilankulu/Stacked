import { useState } from "react";
import Modal from "../Modal.jsx";
import LoanDetails from "../loans/LoanDetails.jsx";
import { formatRand, payFine } from "../../lib/fines.js";
import { apiErrorMessage } from "../../lib/api.js";
import { formatDate } from "../../pages/user/loanData.js";

function RecordPaymentModal({ fine, onClose, onPaid }) {
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    setError("");
    setIsSaving(true);
    try {
      onPaid(await payFine(fine.id));
    } catch (err) {
      setError(apiErrorMessage(err, "Could not record this payment."));
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Record Payment"
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel="Mark as Paid"
      busyLabel="Recording..."
      size="md"
    >
      <LoanDetails
        loan={fine}
        facts={[
          ["Member", fine.user ? `${fine.user.name} ${fine.user.surname}` : "—"],
          ["Days late", fine.daysOverdue],
          ["Issued", fine.issuedOn ? formatDate(fine.issuedOn) : "—"],
          ["Amount", formatRand(fine.amount)],
        ]}
      />
      <p className="mt-5 text-sm text-muted">
        Only mark this fine as paid once the member has paid{" "}
        {formatRand(fine.amount)} at the desk.
      </p>
    </Modal>
  );
}

export default RecordPaymentModal;
