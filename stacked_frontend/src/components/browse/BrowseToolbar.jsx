import ToolbarSelect from "./ToolbarSelect";
import {
  ArrowDownUp,
  BookOpen,
  SlidersHorizontal,
  Tag,
} from "lucide-react";

// Sort, genre and availability dropdowns plus a clear-all button.
function BrowseToolbar({
  sort,
  sortOptions,
  onSortChange,
  genre,
  genreOptions,
  onGenreChange,
  availability,
  availabilityOptions,
  onAvailabilityChange,
  onClear,
  canClear,
}) {
  return (
    <section className="grid gap-3 rounded-md border border-border bg-surface/60 p-4 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto]">
      <ToolbarSelect
        icon={ArrowDownUp}
        label="Sort by"
        value={sort}
        onChange={onSortChange}
        options={sortOptions}
      />
      <ToolbarSelect
        icon={Tag}
        label="Genre"
        value={genre}
        onChange={onGenreChange}
        options={genreOptions}
      />
      <ToolbarSelect
        icon={BookOpen}
        label="Availability"
        value={availability}
        onChange={onAvailabilityChange}
        options={availabilityOptions}
      />
      <button
        type="button"
        onClick={onClear}
        disabled={!canClear}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-sm bg-teal px-4 py-2 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SlidersHorizontal size={18} aria-hidden="true" />
        Clear Filters
      </button>
    </section>
  );
}

export default BrowseToolbar;
