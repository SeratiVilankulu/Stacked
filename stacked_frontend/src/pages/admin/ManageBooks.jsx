import { useState, useMemo } from "react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "../../components/FilterSelect.jsx";
import Checkbox from "../../components/Checkbox.jsx";
import Pill from "../../components/Pill.jsx";
import IconButton from "../../components/IconButton.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import BookActivity from "./BookActivity.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import {
  PAGE_SIZE,
  SAMPLE_BOOKS,
  GENRE_LABELS,
  GENRE_STYLES,
  STATUS_STYLES,
} from "./bookData.js";
import { Pencil, Trash2 } from "lucide-react";

function ManageBooks() {
  const [books, setBooks] = useState(SAMPLE_BOOKS);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter(
      (b) =>
        (genre === "ALL" || b.genre === genre) &&
        (status === "ALL" || b.status === status) &&
        (!q ||
          `${b.title} ${b.author} ${b.isbn} ${GENRE_LABELS[b.genre]}`
            .toLowerCase()
            .includes(q)),
    );
  }, [books, query, genre, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageBooks = filtered.slice(start, start + PAGE_SIZE);

  const allOnPageSelected =
    pageBooks.length > 0 && pageBooks.every((b) => selected.has(b.title));

  // Any filter change starts back on page 1.
  const filterReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const toggleOne = (title) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });

  const toggleAllOnPage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      pageBooks.forEach((b) =>
        allOnPageSelected ? next.delete(b.title) : next.add(b.title),
      );
      return next;
    });

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            title="Manage Books"
            description="View, add, edit and manage library books."
          />

          <FilterBar
            searchLabel="Search Books"
            query={query}
            onQueryChange={filterReset(setQuery)}
            placeholder="Search by title, author or isbn..."
            actionLabel="Add Book"
          >
            <FilterSelect
              label="Genre"
              value={genre}
              onChange={filterReset(setGenre)}
              options={[
                ["ALL", "All Genres"],
                ...Object.entries(GENRE_LABELS),
              ]}
            />
            <FilterSelect
              label="Status"
              value={status}
              onChange={filterReset(setStatus)}
              options={[
                ["ALL", "All Statuses"],
                ["Available", "Available"],
                ["Unavailable", "Unavailable"],
              ]}
            />
          </FilterBar>

          {/* Books table */}
          <section className="overflow-hidden rounded-[var(--radius-lg)] border border-sky bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-[13px]">
                <thead className="bg-sky/40 text-teal">
                  <tr>
                    <th className="w-12 py-4 pl-5">
                      <Checkbox
                        checked={allOnPageSelected}
                        onChange={toggleAllOnPage}
                        label="Select all books on this page"
                      />
                    </th>
                    <th className="px-2.5 py-4 font-semibold">Cover</th>
                    <th className="px-2.5 py-4 font-semibold">Title</th>
                    <th className="px-2.5 py-4 font-semibold">Author</th>
                    <th className="px-2.5 py-4 font-semibold">Genre</th>
                    <th className="px-2.5 py-4 font-semibold">Status</th>
                    <th className="px-2.5 py-4 font-semibold">Total</th>
                    <th className="px-2.5 py-4 pr-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageBooks.map((b) => (
                    <tr
                      key={b.title}
                      className="transition-colors hover:bg-sky/10"
                    >
                      <td className="py-3 pl-5">
                        <Checkbox
                          checked={selected.has(b.title)}
                          onChange={() => toggleOne(b.title)}
                          label={`Select ${b.title}`}
                        />
                      </td>
                      <td className="px-2.5 py-3">
                        <img
                          src={b.coverImage}
                          alt={`Cover of ${b.title}`}
                          loading="lazy"
                          className="aspect-2/3 w-10 shrink-0 object-cover shadow-card sm:w-12 lg:w-14 rounded"
                        />
                      </td>
                      <td className="px-2.5 py-3">
                        <span className="font-medium whitespace-nowrap text-teal">
                          {b.title}
                        </span>
                      </td>
                      <td className="px-2.5 py-3 text-teal">{b.author}</td>
                      <td className="px-2.5 py-3">
                        <Pill className={GENRE_STYLES[b.genre]}>
                          {GENRE_LABELS[b.genre]}
                        </Pill>
                      </td>
                      <td className="px-2.5 py-3">
                        <Pill className={STATUS_STYLES[b.status]}>
                          {b.status}
                        </Pill>
                      </td>
                      <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                        {b.total}
                      </td>
                      <td className="px-2.5 py-3 pr-5">
                        <div className="flex gap-2">
                          <IconButton label={`Edit ${b.title}`}>
                            <Pencil size={16} />
                          </IconButton>
                          <IconButton label={`Delete ${b.title}`} danger>
                            <Trash2 size={16} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {pageBooks.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted">
                        No books match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              noun="books"
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <BookActivity books={books} />
          <QuoteCard
            quote={"A book is a dream you hold in your hands."}
            from={"Neil Gaiman"}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default ManageBooks;
