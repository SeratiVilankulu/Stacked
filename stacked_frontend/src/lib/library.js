import api from "./api.js";

// Library Endpoint calls.

// Each entry comes back as { id, status, addedAt, book }
export async function fetchSavedBooks() {
  const res = await api.get("/library", { params: { status: "WANT_TO_READ" } });
  return res.data.data;
}

export async function saveBook(bookId) {
  const res = await api.post("/library", { bookId, status: "WANT_TO_READ" });
  return res.data.data;
}

// The library routes take the book id
export async function removeFromLibrary(bookId) {
  await api.delete(`/library/${bookId}`);
}
