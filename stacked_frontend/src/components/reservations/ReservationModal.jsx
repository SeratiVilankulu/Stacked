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
    note: (r, member) =>
      `The book goes on loan to ${member ?? "you"} now and is due back on ${formatDate(r.endDate)}.`,
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

// Admin lists include the member, so the details and message name them
const memberName = (r) => r.user && `${r.user.name} ${r.user.surname}`;

function ReservationModal({ reservation, action, onClose, onDone }) {
  const { save, failed, note, ...labels } = ACTIONS[action];
  // Admins check the book out to the member rather than collecting it themselves
  const { title, submitLabel, busyLabel, cancelLabel } =
    action === "collect" && reservation.user
      ? { ...labels, title: "Check Out Book", submitLabel: "Check Out", busyLabel: "Checking out..." }
      : labels;
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
          ...(reservation.user ? [["Member", memberName(reservation)]] : []),
          ["From", formatDate(reservation.startDate)],
          ["Until", formatDate(reservation.endDate)],
          ["Collect by", formatDate(reservation.collectBy)],
        ]}
      />
      <p className="mt-5 text-sm text-muted">{note(reservation, memberName(reservation))}</p>
    </Modal>
  );
}

export default ReservationModal;
