import { Link } from "react-router-dom";

function BookShelf({ books, renderBadge, renderMeta }) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      <ul className="flex min-w-full">
        {books.map((book) => (
          <li key={book.title} className="flex min-w-30 flex-[1_0_7.5rem] flex-col">
            <div className="flex h-48 items-end justify-center px-3">
              <Link
                to={`/books/${book.title}`}
                className="relative block w-full max-w-28 transition-transform duration-200 hover:-translate-y-1"
              >
                <img
                  src={book.coverImage}
                  alt={`Cover of ${book.title}`}
                  loading="lazy"
                  className="aspect-2/3 w-full rounded-sm object-cover shadow-lift"
                />
                {renderBadge && (
                  <span className="absolute top-2 left-2">{renderBadge(book)}</span>
                )}
              </Link>
            </div>

            {/* Shelf plank: the pieces join into one shelf across the row */}
            <div
              aria-hidden="true"
              className="h-3 bg-linear-to-b from-[#e2c49b] to-[#c4955f] shadow-[0_6px_10px_-4px_rgb(67_48_46/0.35)]"
            />

            <div className="px-3 pt-4">
              <Link
                to={`/books/${book.title}`}
                className="line-clamp-1 text-sm font-semibold text-teal hover:underline"
              >
                {book.title}
              </Link>
              <p className="line-clamp-1 text-xs text-muted">{book.author}</p>
              {renderMeta && <div className="mt-2">{renderMeta(book)}</div>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookShelf;
