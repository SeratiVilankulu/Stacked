import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Pill from "../Pill.jsx";
import CoverImage from "../book/CoverImage.jsx";
import { STATUS_DOTS, bookStatus, genreStyle } from "../../lib/books.js";

function BrowseBookCard({ book }) {
  const status = bookStatus(book);

  return (
    <article className="flex flex-col gap-4 rounded-md border border-border bg-surface p-4 shadow-card">
      <div className="flex gap-4">
        <CoverImage book={book} className="w-24" />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Pill className={genreStyle(book.genre)}>{book.genre}</Pill>
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
              className={`size-2 rounded-full ${STATUS_DOTS[status]}`}
            />
            {status}
          </p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link
          to={`/books/${book.id}`}
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
