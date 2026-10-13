import api from "./api.js";

// Reservation Endpoint calls

export const MAX_DAYS_AHEAD = 90;

export const RESERVATION_STATUS_LABELS = {
  PENDING: "Reserved",
  READY: "Ready to Collect",
  FULFILLED: "Collected",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

export const RESERVATION_STATUS_STYLES = {
  PENDING: "bg-sky text-teal",
  READY: "bg-success/10 text-success",
  FULFILLED: "bg-sand text-muted",
  CANCELLED: "bg-sand text-muted",
  EXPIRED: "bg-orange-soft text-orange-ink",
};

// A pending reservation whose start date has come shows as ready
export const reservationStatus = (reservation) =>
  reservation.readyToCollect ? "READY" : reservation.status;

// "YYYY-MM-DD" in local time, the format date inputs and the API use
export function toInputDate(date) {
  const d = new Date(date);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export async function fetchMyReservations() {
  const res = await api.get("/reservations/me");
  return res.data.data;
}

export async function createReservation({ bookId, startDate, endDate }) {
  const res = await api.post("/reservations", { bookId, startDate, endDate });
  return res.data.data;
}

export async function cancelReservation(id) {
  const res = await api.patch(`/reservations/${id}/cancel`);
  return res.data.data;
}

// Returns the new loan
export async function collectReservation(id) {
  const res = await api.post(`/reservations/${id}/collect`);
  return res.data.data;
}

// Admins only
export async function fetchAllReservations(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  );
  const res = await api.get("/reservations", { params: query });
  return res.data.data;
}
