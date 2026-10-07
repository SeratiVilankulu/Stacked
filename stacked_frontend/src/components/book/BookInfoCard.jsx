const STATUS_DOTS = {
  Available: "bg-success",
  Unavailable: "bg-orange",
};

// "Book Details" side card plus the availability summary.
function BookInfoCard({ book }) {
  // Optional fields are skipped until the book data includes them.
  const details = [
    ["ISBN", book.isbn],
    ["Author", book.author],
    ["Publisher", book.publisher],
    ["Language", book.language],
    ["Format", book.format],
  ].filter(([, value]) => value);

  const copies = book.total ?? 0;

  return (
    <aside className="rounded-md border border-border bg-surface/60 p-6 shadow-card">
      <h3 className="text-2xl">Book Details</h3>
      <dl className="mt-4 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm">
        {details.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted">{label}</dt>
            <dd className="break-words text-teal">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="my-6 border-t border-border" />

      <h3 className="text-2xl">Availability</h3>
      <p className="mt-4 flex items-center gap-3 font-medium text-teal">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${STATUS_DOTS[book.status] ?? "bg-muted"}`}
        />
        {book.status}
      </p>
      <p className="mt-1 pl-5.5 text-xs text-muted">
        {copies === 1 ? "1 copy" : `${copies} copies`} in stock
      </p>
    </aside>
  );
}

export default BookInfoCard;
