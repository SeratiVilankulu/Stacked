import { SAMPLE_BOOKS } from "../admin/bookData.js";

const book = (title) => SAMPLE_BOOKS.find((b) => b.title === title);

// TODO: Will remove once the saved books endpoint is called in the frontend
export const SAMPLE_SAVED = [
  "The Seven Husbands of Evelyn Hugo",
  "The Alchemist",
  "The Martian",
].map(book);
