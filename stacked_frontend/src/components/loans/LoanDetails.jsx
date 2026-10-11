import CoverImage from "../book/CoverImage.jsx";

function LoanDetails({ loan, facts }) {
  return (
    <div className="flex gap-5">
      <CoverImage book={loan.book} className="w-20" />
      <div className="min-w-0 flex-1">
        <p className="font-heading text-lg text-teal">{loan.book.title}</p>
        <p className="text-sm text-muted">{loan.book.author}</p>
        <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm">
          {facts.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium text-teal">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default LoanDetails;
