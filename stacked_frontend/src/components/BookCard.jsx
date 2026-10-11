import { Link } from "react-router-dom";
import CoverImage from "./book/CoverImage.jsx";
import { genreStyle } from "../lib/books.js";

function BookCard({ book }) {
  return (
    <div className="flex w24 shrink-0 snap-start flex-col gap-3 rounded-md border border-border bg-surface p-3 shadow-card sm:w-48">
      <CoverImage book={book} className="w-full shadow-none" />
      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-sm font-semibold text-teal">
          {book.title}
        </p>
        <p className="text-xs text-muted">{book.author}</p>
        <span className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs text-muted">
          <span className={`size-1.5 rounded-full ${genreStyle(book.genre)}`} />
          {book.genre}
        </span>
      </div>
      <Link
        to={`/books/${book.id}`}
        className="mt-1 cursor-pointer rounded-pill bg-teal py-2 text-center text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep active:translate-y-px"
      >
        View Book
      </Link>
    </div>
  );
}

export default BookCard;
