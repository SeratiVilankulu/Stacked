import { useMemo, useState } from "react";
import UserLayout from "../../components/UserLayout.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import BrowseToolbar from "../../components/browse/BrowseToolbar.jsx";
import BrowseBookCard from "../../components/browse/BrowseBookCard.jsx";
import CategoryPanel from "../../components/browse/CategoryPanel.jsx";
import {
  GENRE_LABELS,
  SAMPLE_BOOKS,
  PAGE_SIZE,
  STATUS_OPTIONS,
} from "../admin/bookData.js";

const SORTS = {
  "title-asc": ["Title (A – Z)", (a, b) => a.title.localeCompare(b.title)],
  "title-desc": ["Title (Z – A)", (a, b) => b.title.localeCompare(a.title)],
};

const SORT_OPTIONS = Object.entries(SORTS).map(([key, [label]]) => [
  key,
  label,
]);

const GENRE_OPTIONS = [["ALL", "All Genres"], ...Object.entries(GENRE_LABELS)];
const AVAILABILITY_OPTIONS = [
  ["ALL", "All Books"],
  ...STATUS_OPTIONS.map((s) => [s, s]),
];

function BrowseBooks() {
  const [books] = useState(SAMPLE_BOOKS);
  const [sort, setSort] = useState("title-asc");
  const [genre, setGenre] = useState("ALL");
  const [statuses, setStatuses] = useState([]); // Empty means every status
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      books
        .filter(
          (b) =>
            (genre === "ALL" || b.genre === genre) &&
            (statuses.length === 0 || statuses.includes(b.status)),
        )
        .sort(SORTS[sort][1]),
    [books, genre, statuses, sort],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageBooks = filtered.slice(start, start + PAGE_SIZE);

  // Any filter change starts back on page 1.
  const filterReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const setAvailability = filterReset((value) =>
    setStatuses(value === "ALL" ? [] : [value]),
  );

  const toggleStatus = filterReset((s) =>
    setStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    ),
  );

  const clearFilters = () => {
    setGenre("ALL");
    setStatuses([]);
    setPage(1);
  };

  return (
    <UserLayout>
      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            eyebrow="Explore our collection"
            title="Browse All Books"
            description="Discover new authors, explore different genres and find your next great read."
          />

          <BrowseToolbar
            sort={sort}
            sortOptions={SORT_OPTIONS}
            onSortChange={filterReset(setSort)}
            genre={genre}
            genreOptions={GENRE_OPTIONS}
            onGenreChange={filterReset(setGenre)}
            availability={statuses.length === 1 ? statuses[0] : "ALL"}
            availabilityOptions={AVAILABILITY_OPTIONS}
            onAvailabilityChange={setAvailability}
            onClear={clearFilters}
            canClear={genre !== "ALL" || statuses.length > 0}
          />

          <Pagination
            currentPage={currentPage}
            pageCount={pageCount}
            pageSize={PAGE_SIZE}
            total={filtered.length}
            noun="books"
            onPageChange={setPage}
            className=""
          />

          {pageBooks.length === 0 ? (
            <p className="rounded-[var(--radius-lg)] border border-dashed border-border-strong py-16 text-center text-muted">
              No books match your filters.
            </p>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {pageBooks.map((book) => (
                <BrowseBookCard key={book.title} book={book} />
              ))}
            </div>
          )}
        </div>

        {/* Right column: the toolbar covers these filters */}
        <div className="hidden space-y-6 xl:block">
          <CategoryPanel
            books={books}
            genre={genre}
            onGenreChange={filterReset(setGenre)}
            statuses={statuses}
            statusOptions={STATUS_OPTIONS}
            onToggleStatus={toggleStatus}
          />
          <QuoteCard quote="Great books are always in season." />
        </div>
      </div>
    </UserLayout>
  );
}

export default BrowseBooks;
