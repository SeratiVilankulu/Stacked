import { GENRE_LABELS } from "../pages/admin/bookData.js";

const OPTIONS = [["ALL", "All"], ...Object.entries(GENRE_LABELS)];

function GenreFilter({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="Filter books by genre"
      className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {OPTIONS.map(([key, label]) => {
        const active = key === value;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(key)}
            className={`shrink-0 cursor-pointer rounded-pill border px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
              active
                ? "border-teal bg-teal text-cream"
                : "border-border-strong bg-surface text-teal hover:bg-sky/40"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default GenreFilter;
