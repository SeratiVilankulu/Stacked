import api from "./api.js";

export const FINE_STATUS_LABELS = { UNPAID: "Unpaid", PAID: "Paid" };

export const FINE_STATUS_STYLES = {
  UNPAID: "bg-orange-soft text-orange-ink",
  PAID: "bg-success/10 text-success",
};

// Rand amounts formats (R100.00)
export const formatRand = (amount) => `R${Number(amount).toFixed(2)}`;

export async function fetchAllFines(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  );
  const res = await api.get("/fines", { params: query });
  return res.data.data;
}

export async function fetchMyFines() {
  const res = await api.get("/fines/me");
  return res.data.data;
}

export async function payFine(id) {
  const res = await api.patch(`/fines/${id}/pay`);
  return res.data.data;
}
