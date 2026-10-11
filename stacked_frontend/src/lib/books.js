import api from "./api.js";

export const PAGE_SIZE = 6;

export const STATUS_OPTIONS = ["Available", "Unavailable"];

export const STATUS_STYLES = {
  Available: "bg-success/10 text-success",
  Unavailable: "bg-orange-soft text-orange-ink",
};

export const STATUS_DOTS = {
  Available: "bg-success",
  Unavailable: "bg-orange",
};

// Genres are string in the database, so styles are matched on the lower-cased name.
const GENRE_STYLES = {
  "sci-fi": "bg-green-100 text-green-800",
  science: "bg-green-100 text-green-800",
  fantasy: "bg-orange-soft text-orange-ink",
  romance: "bg-pink-100 text-pink-800",
  mystery: "bg-mocha/10 text-mocha",
  thriller: "bg-mocha/10 text-mocha",
  "psychological thriller": "bg-mocha/10 text-mocha",
  "non-fiction": "bg-yellow-100 text-yellow-800",
  "self-help": "bg-yellow-100 text-yellow-800",
  psychology: "bg-purple-100 text-purple-800",
  philosophy: "bg-purple-100 text-purple-800",
  horror: "bg-red-100 text-red-800",
  biography: "bg-blue-100 text-blue-800",
  memoir: "bg-blue-100 text-blue-800",
};

export const genreStyle = (genre) =>
  GENRE_STYLES[genre?.toLowerCase()] ?? "bg-sky text-teal";

// A book is available while at least one copy is on the shelf.
export const bookStatus = (book) =>
  book.copiesAvailable > 0 ? "Available" : "Unavailable";

// Genre names from the stats endpoint, sorted A – Z.
export const genreNames = (stats) =>
  Object.keys(stats?.byGenre ?? {}).sort((a, b) => a.localeCompare(b));

// Endpoint calls. 

// params: [ search, genre, status: "available" | "unavailable", sort, page, limit ]
export async function fetchBooks(params = {}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v != null),
  );
  const res = await api.get("/books", { params: query });
  return res.data.data; // { books, pagination }
}

export async function fetchBookStats() {
  const res = await api.get("/books/stats");
  return res.data.data; // { total, available, unavailable, by Genre }
}

export async function fetchBook(id) {
  const res = await api.get(`/books/${id}`);
  return res.data.data;
}

// formData carries the fields plus an optional "coverImage" file.
export async function createBook(formData) {
  const res = await api.post("/books", formData);
  return res.data.data;
}

export async function updateBook(id, formData) {
  const res = await api.patch(`/books/${id}`, formData);
  return res.data.data;
}

export async function deleteBook(id) {
  await api.delete(`/books/${id}`);
}
