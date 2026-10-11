import { useMemo, useState } from "react";
import {
  BookCheck,
  BookOpen,
  BookmarkX,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  History,
  Star,
} from "lucide-react";
import UserLayout from "../../components/UserLayout.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import Pill from "../../components/Pill.jsx";
import TabBar from "../../components/TabBar.jsx";
import StatsPanel from "../../components/StatsPanel.jsx";
import QuickActionsPanel from "../../components/QuickActionsPanel.jsx";
import BookShelf from "../../components/library/BookShelf.jsx";
import ReadingHistoryList from "../../components/library/ReadingHistoryList.jsx";
import {
  LOAN_STATUS_LABELS,
  LOAN_STATUS_STYLES,
  SAMPLE_LOANS,
  formatDate,
  loanStatus,
} from "./loanData.js";
import { SAMPLE_SAVED } from "./libraryData.js";

const PREVIEW_COUNT = 3;

const SORTS = {
  "due-asc": [
    "Due Date (Soonest)",
    (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
  ],
  "due-desc": [
    "Due Date (Latest)",
    (a, b) => new Date(b.dueDate) - new Date(a.dueDate),
  ],
  title: ["Title (A – Z)", (a, b) => a.book.title.localeCompare(b.book.title)],
};

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// Bordered panel with an icon heading and an optional control on the right.
function LibraryPanel({ icon: Icon, title, subtitle, action, children }) {
  return (
    <section className="min-w-0 rounded-lg border border-sky bg-surface/60 shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-4 px-5 pt-5">
        <div className="flex items-center gap-3">
          <Icon size={24} aria-hidden="true" className="text-teal" />
          <div>
            <h2 className="text-xl">{title}</h2>
            <p className="text-sm text-muted">{subtitle}</p>
          </div>
        </div>
        {action}
      </header>
      <div className="px-5 pt-2 pb-5">{children}</div>
    </section>
  );
}

function ViewAllButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1 text-sm font-medium text-teal hover:underline"
    >
      View all
      <ChevronRight size={15} aria-hidden="true" />
    </button>
  );
}

function EmptyShelf({ children }) {
  return (
    <p className="rounded-md border border-dashed border-border-strong py-12 text-center text-sm text-muted">
      {children}
    </p>
  );
}

function MyLibrary() {
  // TODO: Load loans and saved books from the backend once endpoints exist.
  const [loans] = useState(SAMPLE_LOANS);
  const [saved, setSaved] = useState(SAMPLE_SAVED);
  const [tab, setTab] = useState("borrowed");
  const [sort, setSort] = useState("due-asc");

  const borrowed = useMemo(
    () => loans.filter((l) => !l.returnedOn).sort(SORTS[sort][1]),
    [loans, sort],
  );
  const history = useMemo(
    () =>
      loans
        .filter((l) => l.returnedOn)
        .sort((a, b) => new Date(b.returnedOn) - new Date(a.returnedOn)),
    [loans],
  );
  const overdueCount = borrowed.filter(
    (l) => loanStatus(l) === "OVERDUE",
  ).length;

  // Shelf only knows about books, so look the loan back up by title.
  const loanFor = (book) => borrowed.find((l) => l.book.title === book.title);

  const removeSaved = (book) =>
    setSaved((prev) => prev.filter((b) => b.title !== book.title));

  const showTab = (key) => {
    setTab(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Each section renders in full when its tab is open, or as a short preview.
  const SECTIONS = {
    borrowed: {
      label: "Borrowed Books",
      icon: BookOpen,
      count: borrowed.length,
      subtitle: `${plural(borrowed.length, "book")} currently borrowed`,
      render: (limit) =>
        borrowed.length === 0 ? (
          <EmptyShelf>You have no books on loan right now.</EmptyShelf>
        ) : (
          <BookShelf
            books={borrowed.slice(0, limit).map((l) => l.book)}
            renderBadge={(book) => {
              const status = loanStatus(loanFor(book));
              return (
                <Pill className={`shadow-card ${LOAN_STATUS_STYLES[status]}`}>
                  {LOAN_STATUS_LABELS[status]}
                </Pill>
              );
            }}
            renderMeta={(book) => {
              const loan = loanFor(book);
              const overdue = loanStatus(loan) === "OVERDUE";
              return (
                <p
                  className={`flex items-center gap-1.5 text-xs ${overdue ? "font-medium text-alert" : "text-teal"}`}
                >
                  <CalendarDays size={14} aria-hidden="true" />
                  Due {formatDate(loan.dueDate)}
                </p>
              );
            }}
          />
        ),
    },
    saved: {
      label: "Saved Books",
      icon: Star,
      count: saved.length,
      subtitle: `${plural(saved.length, "book")} saved for later`,
      render: (limit) =>
        saved.length === 0 ? (
          <EmptyShelf>Save books while browsing to find them here.</EmptyShelf>
        ) : (
          <BookShelf
            books={saved.slice(0, limit)}
            renderMeta={(book) => (
              <button
                type="button"
                onClick={() => removeSaved(book)}
                aria-label={`Remove ${book.title} from saved books`}
                title="Remove from saved"
                className="-ml-1 cursor-pointer rounded-full p-1 text-teal transition-colors duration-200 hover:bg-alert/10 hover:text-alert"
              >
                <BookmarkX size={16} aria-hidden="true" />
              </button>
            )}
          />
        ),
    },
    history: {
      label: "Reading History",
      icon: History,
      subtitle: "Recently read or completed",
      render: (limit) =>
        history.length === 0 ? (
          <EmptyShelf>Books you return will show up here.</EmptyShelf>
        ) : (
          <ReadingHistoryList loans={history.slice(0, limit)} />
        ),
    },
  };

  const active = SECTIONS[tab];
  const others = Object.keys(SECTIONS).filter((key) => key !== tab);

  return (
    <UserLayout>
      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            eyebrow="My Library"
            title="My Library"
            description="View the books you've borrowed, saved and added to your library."
          />

          <TabBar
            tabs={Object.entries(SECTIONS).map(([key, s]) => ({
              key,
              label: s.label,
              icon: s.icon,
              count: s.count,
            }))}
            active={tab}
            onChange={setTab}
          />

          <LibraryPanel
            icon={active.icon}
            title={active.label}
            subtitle={active.subtitle}
            action={
              tab === "borrowed" &&
              borrowed.length > 0 && (
                <span className="relative block">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort borrowed books"
                    className="w-52 cursor-pointer appearance-none rounded-md border border-sky bg-surface py-2.5 pr-10 pl-4 text-sm text-teal focus:outline-none!"
                  >
                    {Object.entries(SORTS).map(([key, [label]]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-teal"
                  />
                </span>
              )
            }
          >
            {active.render()}
          </LibraryPanel>

          {/* Previews of the other two sections */}
          <div className="grid gap-6 lg:grid-cols-2">
            {others.map((key) => {
              const s = SECTIONS[key];
              return (
                <LibraryPanel
                  key={key}
                  icon={s.icon}
                  title={s.label}
                  subtitle={s.subtitle}
                  action={<ViewAllButton onClick={() => showTab(key)} />}
                >
                  {s.render(PREVIEW_COUNT)}
                </LibraryPanel>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <StatsPanel
            title="Library Stats"
            stats={[
              { icon: BookOpen, value: borrowed.length, label: "Borrowed" },
              { icon: Star, value: saved.length, label: "Saved" },
              {
                icon: Clock3,
                value: overdueCount,
                label: "Overdue",
                alert: overdueCount > 0,
              },
              { icon: BookCheck, value: history.length, label: "Books Read" },
            ]}
          />

          <QuoteCard quote="A library card is a passport to new worlds." />

          <QuickActionsPanel
            actions={[
              { to: "/books", icon: Compass, label: "Browse All Books" },
              { to: "/loans", icon: Clock3, label: "Manage My Loans" },
              {
                onClick: () => showTab("saved"),
                icon: Star,
                label: "View Saved Books",
              },
            ]}
          />
        </div>
      </div>
    </UserLayout>
  );
}

export default MyLibrary;
