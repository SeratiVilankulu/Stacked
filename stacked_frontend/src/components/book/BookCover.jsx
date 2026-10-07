// Large book cover on a soft sky backdrop.
function BookCover({ book }) {
  return (
    <div className="grid place-items-center rounded-md p-6 sm:p-2">
      <img
        src={book.coverImage}
        alt={`Cover of ${book.title}`}
        className="aspect-2/3 w-full max-w-64 rounded-sm object-cover shadow-card"
      />
    </div>
  );
}

export default BookCover;
