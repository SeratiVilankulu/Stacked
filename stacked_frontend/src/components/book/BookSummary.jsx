import { ArrowRight, BookOpen, Calendar, ListPlus, Tag } from "lucide-react";
import Pill from "../Pill.jsx";
import { GENRE_LABELS, GENRE_STYLES } from "../../pages/admin/bookData.js";

const STATUS_COLOURS = {
  Available: "text-success",
  Unavailable: "text-orange-ink",
};

// Title block: genre, title, author, availability, description, quick facts
// and the borrow / save actions.
function BookSummary({ book }) {
  const genreLabel = GENRE_LABELS[book.genre] ?? book.genre;
  const available = book.status === "Available";

  // Only show facts the book actually has.
  const facts = [
    book.pages && [BookOpen, "Pages", book.pages],
    book.published && [Calendar, "Published", book.published],
    [Tag, "Genre", genreLabel],
  ].filter(Boolean);

  return (
    <div className="min-w-0">
      <Pill className={GENRE_STYLES[book.genre] ?? "bg-sky text-teal"}>
        {genreLabel}
      </Pill>

      <h1 className="mt-4 text-4xl xl:text-5xl">{book.title}</h1>
      <p className="mt-2 font-heading text-xl text-teal">{book.author}</p>

      <p
        className={`mt-5 flex items-center gap-2 text-sm font-medium ${
          STATUS_COLOURS[book.status] ?? "text-teal"
        }`}
      >
        <BookOpen size={18} aria-hidden="true" />
        {book.status}
      </p>

      <p className="mt-5 max-w-prose leading-relaxed text-ink">
        {book.description}
      </p>

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
        {facts.map(([label, value]) => (
          <div key={label} className="flex items-start gap-3">
            <div>
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-sm font-medium text-teal">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!available}
          className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BookOpen size={18} aria-hidden="true" />
          {available ? "Borrow Book" : "Currently Unavailable"}
          {available && <ArrowRight size={18} aria-hidden="true" />}
        </button>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border-strong px-6 py-3 text-sm font-semibold text-teal transition-colors duration-200 hover:bg-sky/30"
        >
          <ListPlus size={18} aria-hidden="true" />
          Save for Later
        </button>
      </div>
    </div>
  );
}

export default BookSummary;
