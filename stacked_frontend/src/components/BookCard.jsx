import { GENRE_LABELS, GENRE_STYLES } from "../pages/admin/bookData.js";

function BookCard({ book }) {
  console.log("These are our props", book);
  return (
    <div className="flex w-44 shrink-0 snap-start flex-col gap-3 rounded-md border border-border bg-surface p-3 shadow-card sm:w-48">
      <div className="aspect-2/3 w-full overflow-hidden rounded-sm">
        <img
          src={book.coverImage}
          alt={`${book.title} cover`}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-1">
        <p className="line-clamp-1 text-sm font-semibold text-teal">
          {book.title}
        </p>
        <p className="text-xs text-muted">{book.author}</p>
        <span className="mt-1 inline-flex w-fit items-center gap-1.5 text-xs text-muted">
          <span
            className={`size-1.5 rounded-full ${
              GENRE_STYLES[book.genre] ?? "bg-sky"
            }`}
          />
          {GENRE_LABELS[book.genre] ?? book.genre}
        </span>
      </div>
      <button
        type="button"
        className="mt-1 cursor-pointer rounded-pill bg-teal py-2 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep active:translate-y-px"
      >
        Borrow
      </button>
    </div>
  );
}

export default BookCard;
