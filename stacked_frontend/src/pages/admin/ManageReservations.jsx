import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  CalendarX,
  CircleCheck,
  PackageCheck,
  X,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "../../components/FilterSelect.jsx";
import Pill from "../../components/Pill.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import CoverImage from "../../components/book/CoverImage.jsx";
import StatsPanel from "../../components/StatsPanel.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import ReservationModal from "../../components/reservations/ReservationModal.jsx";
import {
  RESERVATION_STATUS_LABELS,
  RESERVATION_STATUS_STYLES,
  fetchAllReservations,
  reservationStatus,
} from "../../lib/reservations.js";
import { formatDate } from "../user/loanData.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";

const PAGE_SIZE = 8;

const STATUSES = ["READY", "PENDING", "FULFILLED", "CANCELLED", "EXPIRED"];

const STATUS_FILTERS = [
  ["ALL", "All Statuses"],
  ...STATUSES.map((s) => [s, RESERVATION_STATUS_LABELS[s]]),
];

const ACTION_CLASSES =
  "flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold whitespace-nowrap transition-colors";

// Ready to collect first, then upcoming soonest first; then the rest, newest first
const RANK = { READY: 0, PENDING: 1 };
const byUrgency = (a, b) => {
  const rankA = RANK[reservationStatus(a)] ?? 2;
  const rankB = RANK[reservationStatus(b)] ?? 2;
  if (rankA !== rankB) return rankA - rankB;
  return rankA < 2
    ? a.startDate.localeCompare(b.startDate)
    : b.startDate.localeCompare(a.startDate);
};

const memberName = (reservation) =>
  reservation.user
    ? `${reservation.user.name} ${reservation.user.surname}`
    : "Unknown member";

function ManageReservations() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  // The reservation in the collect or cancel modal, with which action
  const [modal, setModal] = useState(null);

  // Fetch every reservation in one request, then search, filter and display them on the browser
  const request = useRequest(
    fetchAllReservations,
    `all-reservations-${reloadKey}`,
  );
  const { isLoading } = request;
  const error = request.error && apiErrorMessage(request.error);

  const reservations = useMemo(() => request.data ?? [], [request.data]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    reservations.forEach((r) => (c[reservationStatus(r)] += 1));
    return c;
  }, [reservations]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reservations
      .filter(
        (r) =>
          (status === "ALL" || reservationStatus(r) === status) &&
          (!q ||
            `${r.book?.title} ${memberName(r)} ${r.user?.email}`
              .toLowerCase()
              .includes(q)),
      )
      .sort(byUrgency);
  }, [reservations, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageReservations = filtered.slice(start, start + PAGE_SIZE);

  // Any filter change starts back on page 1.
  const filterReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const closeModal = useCallback(() => setModal(null), []);

  const handleDone = (result) => {
    const { action, reservation } = modal;
    toast.success(
      action === "collect"
        ? `${reservation.book.title} checked out to ${memberName(reservation)} until ${formatDate(result.dueDate)}`
        : `Reservation for ${reservation.book.title} cancelled`,
    );
    setModal(null);
    setReloadKey((k) => k + 1);
  };

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            title="Manage Reservations"
            description="See which books members have reserved and check them out when they come to collect."
          />

          <FilterBar
            searchLabel="Search Reservations"
            query={query}
            onQueryChange={filterReset(setQuery)}
            placeholder="Search by book, member or email..."
          >
            <FilterSelect
              label="Status"
              value={status}
              onChange={filterReset(setStatus)}
              options={STATUS_FILTERS}
            />
          </FilterBar>

          {/* Reservations table */}
          <section className="overflow-hidden rounded-lg border border-sky bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl text-left text-[13px]">
                <thead className="bg-sky/40 text-teal">
                  <tr>
                    <th className="py-4 pl-5 font-semibold">Book</th>
                    <th className="px-2.5 py-4 font-semibold">Member</th>
                    <th className="px-2.5 py-4 font-semibold">From</th>
                    <th className="px-2.5 py-4 font-semibold">Until</th>
                    <th className="px-2.5 py-4 font-semibold">Status</th>
                    <th className="px-2.5 py-4 pr-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody
                  aria-busy={isLoading}
                  className={`divide-y divide-border transition-opacity ${isLoading ? "opacity-60" : ""}`}
                >
                  {!error &&
                    pageReservations.map((reservation) => {
                      const state = reservationStatus(reservation);
                      const active = state === "READY" || state === "PENDING";
                      return (
                        <tr
                          key={reservation.id}
                          className="transition-colors hover:bg-sky/10"
                        >
                          <td className="py-3 pl-5">
                            <div className="flex items-center gap-3">
                              <CoverImage
                                book={reservation.book}
                                className="w-10"
                              />
                              <div className="min-w-0">
                                <p className="font-medium text-teal">
                                  {reservation.book.title}
                                </p>
                                <p className="text-xs text-muted">
                                  {reservation.book.author}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2.5 py-3">
                            <p className="whitespace-nowrap text-teal">
                              {memberName(reservation)}
                            </p>
                            <p className="text-xs text-muted">
                              {reservation.user?.email}
                            </p>
                          </td>
                          <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                            {formatDate(reservation.startDate)}
                            {state === "READY" && (
                              <p className="text-xs font-medium text-success">
                                Collect by {formatDate(reservation.collectBy)}
                              </p>
                            )}
                          </td>
                          <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                            {formatDate(reservation.endDate)}
                          </td>
                          <td className="px-2.5 py-3">
                            <Pill className={RESERVATION_STATUS_STYLES[state]}>
                              {RESERVATION_STATUS_LABELS[state]}
                            </Pill>
                          </td>
                          <td className="px-2.5 py-3 pr-5">
                            {active ? (
                              <div className="flex gap-2">
                                {state === "READY" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setModal({ action: "collect", reservation })
                                    }
                                    className={`${ACTION_CLASSES} border-teal bg-teal text-cream hover:bg-teal-deep`}
                                  >
                                    <PackageCheck size={15} aria-hidden="true" />
                                    Check Out
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setModal({ action: "cancel", reservation })
                                  }
                                  className={`${ACTION_CLASSES} border-border-strong text-teal hover:bg-sky/30`}
                                >
                                  <X size={15} aria-hidden="true" />
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <span className="whitespace-nowrap text-muted">
                                Reserved {formatDate(reservation.reservedOn)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                  {(error || pageReservations.length === 0) && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted">
                        {error ||
                          (isLoading
                            ? "Loading reservations..."
                            : "No reservations match your filters.")}
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
              noun="reservations"
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <StatsPanel
            title="Reservation Stats"
            stats={[
              { icon: PackageCheck, value: counts.READY, label: "Ready to Collect" },
              { icon: CalendarClock, value: counts.PENDING, label: "Upcoming" },
              { icon: CircleCheck, value: counts.FULFILLED, label: "Collected" },
              { icon: CalendarX, value: counts.EXPIRED, label: "Expired" },
            ]}
          />
          <QuoteCard quote="A library card is a passport to new worlds." />
        </div>
      </div>

      {modal && (
        <ReservationModal
          reservation={modal.reservation}
          action={modal.action}
          onClose={closeModal}
          onDone={handleDone}
        />
      )}
    </AdminLayout>
  );
}

export default ManageReservations;
