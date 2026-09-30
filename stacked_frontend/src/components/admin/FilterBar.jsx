import { Plus, Search } from "lucide-react";

// Search box, filter dropdowns (passed as children) and an optional add button.
function FilterBar({
  searchLabel,
  query,
  onQueryChange,
  placeholder,
  actionLabel,
  onAction,
  children,
}) {
  return (
    <section className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-sky bg-surface/60 p-5 lg:flex-row lg:items-end">
      <label className="flex-1">
        <span className="text-sm font-medium text-teal">{searchLabel}</span>
        <span className="relative mt-2 block">
          <Search
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-teal"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-pill border border-sky py-2.5 pr-4 pl-11 text-sm text-ink placeholder:text-muted focus:outline-none!"
          />
        </span>
      </label>

      {children && (
        <div className="grid grid-cols-2 gap-4 lg:flex">{children}</div>
      )}

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep"
        >
          <Plus size={18} />
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export default FilterBar;
