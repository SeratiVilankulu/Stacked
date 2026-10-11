import api from "./api.js";

// Loan Endpoint calls

export async function fetchMyLoans() {
  const res = await api.get("/loans/me");
  return res.data.data;
}

export async function fetchLoan(id) {
  const res = await api.get(`/loans/${id}`);
  return res.data.data;
}

export async function renewLoan(id) {
  const res = await api.patch(`/loans/${id}/renew`);
  return res.data.data;
}
