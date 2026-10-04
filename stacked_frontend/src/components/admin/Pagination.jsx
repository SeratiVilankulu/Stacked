import { ChevronLeft, ChevronRight } from "lucide-react";
import PageButton from "../PageButton.jsx";

// Table footer: "Showing x – y of z" plus page buttons.
// `noun` is the plural shown in the summary, e.g. "books" or "users".
function Pagination({
  currentPage,
  pageCount,
  pageSize,
  total,
  noun,
  onPageChange,
}) {
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-sky px-5 py-4 text-sm text-muted sm:flex-row">
      <p>
        {total === 0
          ? `No ${noun}`
          : `Showing ${start + 1} – ${end} of ${total} ${noun}`}
      </p>
      <nav aria-label="Pagination" className="flex items-center gap-2">
        <PageButton
          label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </PageButton>
        {Array.from({ length: pageCount }, (_, n) => n + 1).map((n) => (
          <PageButton
            key={n}
            label={`Page ${n}`}
            active={n === currentPage}
            onClick={() => onPageChange(n)}
          >
            {n}
          </PageButton>
        ))}
        <PageButton
          label="Next page"
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </PageButton>
      </nav>
    </div>
  );
}

export default Pagination;
