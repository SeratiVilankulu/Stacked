import { useCallback, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Bookmark,
  CalendarClock,
  ChevronDown,
  Clock3,
  Compass,
  History,
} from "lucide-react";
import UserLayout from "../../components/UserLayout.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import TabBar from "../../components/TabBar.jsx";
import QuickActionsPanel from "../../components/QuickActionsPanel.jsx";
import LoanRow from "../../components/loans/LoanRow.jsx";
import LoanStats from "../../components/loans/LoanStats.jsx";
import { toast } from "sonner";
import { LOAN_STATUS_LABELS, formatDate, loanStatus } from "./loanData.js";
import RenewModal from "../../components/loans/RenewModal.jsx";
import ReservationRow from "../../components/reservations/ReservationRow.jsx";
import ReservationModal from "../../components/reservations/ReservationModal.jsx";
import { fetchMyLoans } from "../../lib/loans.js";
import { fetchMyReservations } from "../../lib/reservations.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";

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
  reservations: {
    label: "Reservations",
    icon: CalendarClock,
    empty: "Reserve a book from its page to hold a copy for later dates.",
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

// Upcoming reservations first, soonest at the top; then past ones, newest first
const isActive = (r) => r.status === "PENDING";
const byStartDate = (a, b) => {
  if (isActive(a) !== isActive(b)) return isActive(a) ? -1 : 1;
  return isActive(a)
    ? a.startDate.localeCompare(b.startDate)
    : b.startDate.localeCompare(a.startDate);
};

function MyLoans() {
  const [reloadKey, setReloadKey] = useState(0);
  const loansRequest = useRequest(fetchMyLoans, `my-loans-${reloadKey}`);
  const reservationsRequest = useRequest(
    fetchMyReservations,
    `my-reservations-${reloadKey}`,
  );
  const { data } = loansRequest;
  // Renewed loans replace the loaded ones, so the page updates without fetching everything again
  const [renewed, setRenewed] = useState({});
  const loans = useMemo(
    () => (data ?? []).map((loan) => renewed[loan.id] ?? loan),
    [data, renewed],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = TABS[searchParams.get("tab")] ? searchParams.get("tab") : "current";
  const reservations = useMemo(
    () => [...(reservationsRequest.data ?? [])].sort(byStartDate),
    [reservationsRequest.data],
  );
  const activeReservations = reservations.filter(isActive).length;
  const { isLoading, error } =
    tab === "reservations" ? reservationsRequest : loansRequest;
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
      tab === "reservations"
        ? reservations
        : loans
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
    [loans, reservations, tab, statusFilter],
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageLoans = filtered.slice(start, start + PAGE_SIZE);

  const changeTab = (key) => {
    setSearchParams(key === "current" ? {} : { tab: key }, { replace: true });
    setStatusFilter("ALL");
    setPage(1);
  };

  const [renewing, setRenewing] = useState(null); // The loan in the renew modal
  const closeRenew = useCallback(() => setRenewing(null), []);

  const handleRenewed = (updated) => {
    setRenewed((prev) => ({ ...prev, [updated.id]: updated }));
    toast.success(`${updated.book.title} renewed until ${formatDate(updated.dueDate)}`);
    setRenewing(null);
  };

  // The reservation in the collect or cancel modal, with which action
  const [reservationAction, setReservationAction] = useState(null);
  const closeReservation = useCallback(() => setReservationAction(null), []);

  const handleReservationDone = (result) => {
    const { action, reservation } = reservationAction;
    toast.success(
      action === "collect"
        ? `${reservation.book.title} is on loan until ${formatDate(result.dueDate)}`
        : `Reservation for ${reservation.book.title} cancelled`,
    );
    setReservationAction(null);
    setReloadKey((k) => k + 1);
  };

  const tabCounts = {
    current: currentCount,
    history: counts.RETURNED,
    reservations: activeReservations,
  };

  const subtitle = {
    current: `${currentCount} book${currentCount === 1 ? "" : "s"} currently borrowed`,
    history: `${counts.RETURNED} book${counts.RETURNED === 1 ? "" : "s"} returned`,
    reservations: `${activeReservations} upcoming reservation${activeReservations === 1 ? "" : "s"}`,
  }[tab];

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

          <TabBar
            tabs={Object.entries(TABS).map(([key, { label, icon }]) => ({
              key,
              label,
              icon,
              count: tabCounts[key],
            }))}
            active={tab}
            onChange={changeTab}
          />

          {/* Loans panel */}
          <section className="rounded-lg border border-sky bg-surface/60 shadow-card">
            <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sky px-5 py-4">
              <div className="flex items-center gap-3">
                {tab === "current" ? (
                  <Clock3 size={24} aria-hidden="true" className="text-teal" />
                ) : tab === "history" ? (
                  <History size={24} aria-hidden="true" className="text-teal" />
                ) : (
                  <CalendarClock size={24} aria-hidden="true" className="text-teal" />
                )}
                <div>
                  <h2 className="text-xl">{TABS[tab].label}</h2>
                  <p className="text-sm text-muted">{subtitle}</p>
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

            {isLoading ? (
              <p className="px-5 py-16 text-center text-muted">
                Loading your {tab === "reservations" ? "reservations" : "loans"}...
              </p>
            ) : error ? (
              <p className="px-5 py-16 text-center text-alert">
                {apiErrorMessage(
                  error,
                  `Could not load your ${tab === "reservations" ? "reservations" : "loans"}.`,
                )}
              </p>
            ) : pageLoans.length === 0 ? (
              <p className="px-5 py-16 text-center text-muted">
                {statusFilter === "ALL"
                  ? TABS[tab].empty
                  : "No loans match this status."}
              </p>
            ) : (
              <ul className="divide-y divide-sky px-5">
                {tab === "reservations"
                  ? pageLoans.map((reservation) => (
                      <ReservationRow
                        key={reservation.id}
                        reservation={reservation}
                        onCollect={(r) =>
                          setReservationAction({ action: "collect", reservation: r })
                        }
                        onCancel={(r) =>
                          setReservationAction({ action: "cancel", reservation: r })
                        }
                      />
                    ))
                  : pageLoans.map((loan) => (
                      <LoanRow key={loan.id} loan={loan} onRenew={setRenewing} />
                    ))}
              </ul>
            )}

            <Pagination
              currentPage={currentPage}
              pageCount={pageCount}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              noun={tab === "reservations" ? "reservations" : "loans"}
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <QuickActionsPanel actions={QUICK_ACTIONS} />

          <LoanStats
            current={counts.ON_LOAN}
            dueSoon={counts.DUE_SOON}
            overdue={counts.OVERDUE}
            returned={counts.RETURNED}
          />

          <QuoteCard quote="A library card is a passport to new worlds." />
        </div>
      </div>

      {renewing && (
        <RenewModal
          loan={renewing}
          onClose={closeRenew}
          onRenewed={handleRenewed}
        />
      )}

      {reservationAction && (
        <ReservationModal
          reservation={reservationAction.reservation}
          action={reservationAction.action}
          onClose={closeReservation}
          onDone={handleReservationDone}
        />
      )}
    </UserLayout>
  );
}

export default MyLoans;
