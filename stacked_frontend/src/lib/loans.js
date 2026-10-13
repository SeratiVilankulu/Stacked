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

// Returns the new loan
export async function borrowBook(bookId) {
  const res = await api.post("/loans", { bookId });
  return res.data.data;
}

export async function renewLoan(id) {
  const res = await api.patch(`/loans/${id}/renew`);
  return res.data.data;
}

// Admins only
export async function fetchAllLoans(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  );
  const res = await api.get("/loans", { params: query });
  return res.data.data;
}

// Admin only
export async function checkInLoan(id) {
  const res = await api.patch(`/loans/${id}/return`);
  return res.data.data;
}
