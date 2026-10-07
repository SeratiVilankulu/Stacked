import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  ChevronDown,
  ChevronRight,
  Clock3,
  Compass,
  History,
} from "lucide-react";
import UserLayout from "../../components/UserLayout.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import LoanRow from "../../components/loans/LoanRow.jsx";
import LoanStats from "../../components/loans/LoanStats.jsx";
import {
  LOAN_PERIOD_DAYS,
  LOAN_STATUS_LABELS,
  SAMPLE_LOANS,
  addDays,
  loanStatus,
} from "./loanData.js";

const PAGE_SIZE = 5;

const TABS = {
  current: {
    label: "Current Loans",
    icon: BookOpen,
    match: (status) => status !== "RETURNED",
    empty: "You have no books on loan right now.",
  },
  history: {
    label: "Loan History",
    icon: History,
    match: (status) => status === "RETURNED",
    empty: "Books you return will show up here.",
  },
};

const STATUS_FILTERS = [
  ["ALL", "All Statuses"],
  ...["ON_LOAN", "DUE_SOON", "OVERDUE"].map((s) => [s, LOAN_STATUS_LABELS[s]]),
];

const QUICK_ACTIONS = [
  { to: "/books", icon: Compass, label: "Browse All Books" },
  { to: "/my-library", icon: Bookmark, label: "View My Library" },
];

const byDueDate = (a, b) => new Date(a.dueDate) - new Date(b.dueDate);
const byReturnedDesc = (a, b) =>
  new Date(b.returnedOn) - new Date(a.returnedOn);

function MyLoans() {
  const [loans, setLoans] = useState(SAMPLE_LOANS);
  const [tab, setTab] = useState("current");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c = { ON_LOAN: 0, DUE_SOON: 0, OVERDUE: 0, RETURNED: 0 };
    loans.forEach((loan) => (c[loanStatus(loan)] += 1));
    return c;
  }, [loans]);
  const currentCount = counts.ON_LOAN + counts.DUE_SOON + counts.OVERDUE;

  const filtered = useMemo(
    () =>
      loans
        .filter((loan) => {
          const status = loanStatus(loan);
          return (
            TABS[tab].match(status) &&
            (tab !== "current" ||
              statusFilter === "ALL" ||
              status === statusFilter)
          );
        })
        .sort(tab === "current" ? byDueDate : byReturnedDesc),
    [loans, tab, statusFilter],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageLoans = filtered.slice(start, start + PAGE_SIZE);

  const changeTab = (key) => {
    setTab(key);
    setStatusFilter("ALL");
    setPage(1);
  };

  // TODO: Call the renew endpoint once it exists.
  const renewLoan = (loan) =>
    setLoans((prev) =>
      prev.map((l) =>
        l.id === loan.id
          ? {
              ...l,
              dueDate: addDays(l.dueDate, LOAN_PERIOD_DAYS).toISOString(),
              renewals: l.renewals + 1,
            }
          : l,
      ),
    );

  const tabCounts = { current: currentCount, history: counts.RETURNED };

  return (
    <UserLayout>
      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-6">
          <div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to dashboard
            </Link>
            <div className="mt-3">
              <PageHeading
                eyebrow="My Loans"
                title="Your Loans"
                description="Keep track of what you've borrowed, when it's due and renew before the date passes."
              />
            </div>
          </div>

          {/* Tabs */}
          <div role="tablist" className="flex flex-wrap gap-3">
            {Object.entries(TABS).map(([key, { label, icon: Icon }]) => {
              const active = tab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => changeTab(key)}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-5 py-3 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? "border-teal bg-teal text-cream"
                      : "border-border bg-surface text-teal hover:bg-sky/30"
                  }`}
                >
                  <Icon size={18} aria-hidden="true" />
                  {label} ({tabCounts[key]})
                </button>
              );
            })}
          </div>

          {/* Loans panel */}
          <section className="rounded-[var(--radius-lg)] border border-sky bg-surface/60 shadow-card">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sky px-5 py-4">
              <div className="flex items-center gap-3">
                {tab === "current" ? (
                  <Clock3 size={24} aria-hidden="true" className="text-teal" />
                ) : (
                  <History size={24} aria-hidden="true" className="text-teal" />
                )}
                <div>
                  <h2 className="text-xl">{TABS[tab].label}</h2>
                  <p className="text-sm text-muted">
                    {tab === "current"
                      ? `${currentCount} book${currentCount === 1 ? "" : "s"} currently borrowed`
                      : `${counts.RETURNED} book${counts.RETURNED === 1 ? "" : "s"} returned`}
                  </p>
                </div>
              </div>

              {tab === "current" && (
                <span className="relative block">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                    aria-label="Filter by status"
                    className="w-40 cursor-pointer appearance-none rounded-md border border-sky bg-surface py-2.5 pr-10 pl-4 text-sm text-teal focus:outline-none!"
                  >
                    {STATUS_FILTERS.map(([v, text]) => (
                      <option key={v} value={v}>
                        {text}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-teal"
                  />
                </span>
              )}
            </header>

            {pageLoans.length === 0 ? (
              <p className="px-5 py-16 text-center text-muted">
                {statusFilter === "ALL"
                  ? TABS[tab].empty
                  : "No loans match this status."}
              </p>
            ) : (
              <ul className="divide-y divide-sky px-5">
                {pageLoans.map((loan) => (
                  <LoanRow
                    key={loan.id}
                    loan={loan}
                    onRenew={renewLoan}
                  />
                ))}
              </ul>
            )}

            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              noun="loans"
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <aside className="rounded-[var(--radius-lg)] border border-sky bg-surface/60 p-5 shadow-card">
            <h3 className="text-xl">Quick Actions</h3>
            <ul className="mt-4 space-y-3">
              {QUICK_ACTIONS.map(({ to, icon: Icon, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="flex w-full items-center gap-4 rounded-md bg-sky/40 px-4 py-3 text-sm transition-colors duration-200 hover:bg-sky"
                  >
                    <Icon size={22} aria-hidden="true" />
                    <span className="flex-1">{label}</span>
                    <ChevronRight size={18} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <LoanStats
            current={counts.ON_LOAN}
            dueSoon={counts.DUE_SOON}
            overdue={counts.OVERDUE}
            returned={counts.RETURNED}
          />

          <QuoteCard quote="A library card is a passport to new worlds." />
        </div>
      </div>
    </UserLayout>
  );
}

export default MyLoans;
