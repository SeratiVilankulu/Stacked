import { fetchBooks } from "../../lib/books.js";

// TODO: Will remove once the saved books endpoint is called in the frontend
const SAMPLE_SAVED_TITLES = [
  "The Seven Husbands of Evelyn Hugo",
  "The Alchemist",
  "The Martian",
];

// Looks the sample titles up in the catalogue, so they have real ids and covers
export async function fetchSampleSaved() {
  const results = await Promise.all(
    SAMPLE_SAVED_TITLES.map((title) => fetchBooks({ search: title, limit: 1 })),
  );
  return results.map((r) => r.books[0]).filter(Boolean);
}
