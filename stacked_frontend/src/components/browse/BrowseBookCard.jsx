import { ArrowRight, ListPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Pill from "../Pill.jsx";
import { GENRE_LABELS, GENRE_STYLES } from "../../pages/admin/bookData.js";

const STATUS_DOTS = {
  Available: "bg-success",
  Unavailable: "bg-orange",
};

function BrowseBookCard({ book }) {
  return (
    <article className="flex flex-col gap-4 rounded-md border border-border bg-surface p-4 shadow-card">
      <div className="flex gap-4">
        <img
          src={book.coverImage}
          alt={`Cover of ${book.title}`}
          loading="lazy"
          className="aspect-2/3 w-24 shrink-0 rounded-sm object-cover shadow-card"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Pill className={GENRE_STYLES[book.genre] ?? "bg-sky text-teal"}>
              {GENRE_LABELS[book.genre] ?? book.genre}
            </Pill>
            <button
              type="button"
              aria-label={`Save ${book.title}`}
              className="-mt-1 -mr-1 cursor-pointer rounded-full p-1.5 text-teal transition-colors duration-200 hover:bg-sky/40"
            >
            </button>
          </div>

          <p className="mt-2 line-clamp-1 font-medium text-teal">
            {book.title}
          </p>
          <p className="mt-1 text-sm text-muted">{book.author}</p>

          <p className="mt-3 flex items-center gap-2 text-sm text-teal">
            <span
              aria-hidden="true"
              className={`size-2 rounded-full ${STATUS_DOTS[book.status] ?? "bg-muted"}`}
            />
            {book.status}
          </p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link
          to={`/books/${book.title}`}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-md)] bg-teal px-2 py-2.5 text-[13px] whitespace-nowrap font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep"
        >
          View Details
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
        <button
          type="button"
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[var(--radius-md)] border border-border-strong px-2 py-2.5 text-[13px] whitespace-nowrap font-semibold text-teal transition-colors duration-200 hover:bg-sky/30"
        >
          Add to Library
        </button>
      </div>
    </article>
  );
}

export default BrowseBookCard;
