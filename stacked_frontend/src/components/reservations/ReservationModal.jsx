import { useState } from "react";
import Modal from "../Modal.jsx";
import LoanDetails from "../loans/LoanDetails.jsx";
import { apiErrorMessage } from "../../lib/api.js";
import {
  cancelReservation,
  collectReservation,
} from "../../lib/reservations.js";
import { formatDate } from "../../pages/user/loanData.js";

const ACTIONS = {
  collect: {
    title: "Collect Book",
    submitLabel: "Collect",
    busyLabel: "Collecting...",
    cancelLabel: "Not Yet",
    save: collectReservation,
    failed: "Could not collect this reservation.",
    note: (r) =>
      `The book goes on loan to you now and is due back on ${formatDate(r.endDate)}.`,
  },
  cancel: {
    title: "Cancel Reservation",
    submitLabel: "Cancel Reservation",
    busyLabel: "Cancelling...",
    cancelLabel: "Keep It",
    save: cancelReservation,
    failed: "Could not cancel this reservation.",
    note: () => "The copy will be released for other members to reserve or borrow.",
  },
};

function ReservationModal({ reservation, action, onClose, onDone }) {
  const { title, submitLabel, busyLabel, cancelLabel, save, failed, note } =
    ACTIONS[action];
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const submit = async () => {
    setError("");
    setIsSaving(true);
    try {
      onDone(await save(reservation.id));
    } catch (err) {
      setError(apiErrorMessage(err, failed));
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel={submitLabel}
      busyLabel={busyLabel}
      cancelLabel={cancelLabel}
      size="md"
    >
      <LoanDetails
        loan={reservation}
        facts={[
          ["From", formatDate(reservation.startDate)],
          ["Until", formatDate(reservation.endDate)],
          ["Collect by", formatDate(reservation.collectBy)],
        ]}
      />
      <p className="mt-5 text-sm text-muted">{note(reservation)}</p>
    </Modal>
  );
}

export default ReservationModal;
