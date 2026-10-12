import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Banknote, CircleCheck, Receipt, Wallet } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "../../components/FilterSelect.jsx";
import Pill from "../../components/Pill.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import CoverImage from "../../components/book/CoverImage.jsx";
import StatsPanel from "../../components/StatsPanel.jsx";
import RecordPaymentModal from "../../components/fines/RecordPaymentModal.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import {
  FINE_STATUS_LABELS,
  FINE_STATUS_STYLES,
  fetchAllFines,
  formatRand,
} from "../../lib/fines.js";
import { formatDate } from "../user/loanData.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";

const PAGE_SIZE = 8;

const STATUS_FILTERS = [
  ["ALL", "All Statuses"],
  ...Object.entries(FINE_STATUS_LABELS),
];

// Unpaid fines first, then newest first
const byUrgency = (a, b) => {
  if (a.status !== b.status) return a.status === "UNPAID" ? -1 : 1;
  return new Date(b.issuedOn ?? 0) - new Date(a.issuedOn ?? 0);
};

const memberName = (fine) =>
  fine.user ? `${fine.user.name} ${fine.user.surname}` : "Unknown member";

const sum = (fines) => fines.reduce((total, fine) => total + fine.amount, 0);

function ManageFines() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [paying, setPaying] = useState(null); // The fine in the payment modal
  const [reloadKey, setReloadKey] = useState(0); // Bumped to refetch after a payment

  // Fetch all fines in one request, then search, filter and page them in the browser
  const request = useRequest(fetchAllFines, `all-fines-${reloadKey}`);
  const { isLoading } = request;
  const error = request.error && apiErrorMessage(request.error);

  const fines = useMemo(() => request.data ?? [], [request.data]);

  const stats = useMemo(() => {
    const unpaid = fines.filter((fine) => fine.status === "UNPAID");
    const paid = fines.filter((fine) => fine.status === "PAID");
    return [
      { icon: Wallet, value: formatRand(sum(unpaid)), label: "Outstanding", alert: unpaid.length > 0 },
      { icon: Receipt, value: unpaid.length, label: "Unpaid Fines" },
      { icon: Banknote, value: formatRand(sum(paid)), label: "Collected" },
      { icon: CircleCheck, value: paid.length, label: "Paid Fines" },
    ];
  }, [fines]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fines
      .filter(
        (fine) =>
          (status === "ALL" || fine.status === status) &&
          (!q ||
            `${fine.book?.title} ${memberName(fine)} ${fine.user?.email}`
              .toLowerCase()
              .includes(q)),
      )
      .sort(byUrgency);
  }, [fines, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageFines = filtered.slice(start, start + PAGE_SIZE);

  // Any filter change starts back on page 1.
  const filterReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const closePayment = useCallback(() => setPaying(null), []);

  const handlePaid = (fine) => {
    toast.success(
      `${formatRand(fine.amount)} fine for ${memberName(fine)} marked as paid`,
    );
    setPaying(null);
    setReloadKey((k) => k + 1);
  };

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            title="Manage Fines"
            description="Track late return fines and record payments made at the desk."
          />

          <FilterBar
            searchLabel="Search Fines"
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

          {/* Fines table */}
          <section className="overflow-hidden rounded-lg border border-sky bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-[13px]">
                <thead className="bg-sky/40 text-teal">
                  <tr>
                    <th className="py-4 pl-5 font-semibold">Book</th>
                    <th className="px-2.5 py-4 font-semibold">Member</th>
                    <th className="px-2.5 py-4 font-semibold">Days Late</th>
                    <th className="px-2.5 py-4 font-semibold">Amount</th>
                    <th className="px-2.5 py-4 font-semibold">Issued</th>
                    <th className="px-2.5 py-4 font-semibold">Status</th>
                    <th className="px-2.5 py-4 pr-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody
                  aria-busy={isLoading}
                  className={`divide-y divide-border transition-opacity ${isLoading ? "opacity-60" : ""}`}
                >
                  {!error &&
                    pageFines.map((fine) => (
                      <tr
                        key={fine.id}
                        className="transition-colors hover:bg-sky/10"
                      >
                        <td className="py-3 pl-5">
                          <div className="flex items-center gap-3">
                            {fine.book && (
                              <CoverImage book={fine.book} className="w-10" />
                            )}
                            <p className="font-medium text-teal">
                              {fine.book?.title ?? "Unknown book"}
                            </p>
                          </div>
                        </td>
                        <td className="px-2.5 py-3">
                          <p className="whitespace-nowrap text-teal">
                            {memberName(fine)}
                          </p>
                          <p className="text-xs text-muted">{fine.user?.email}</p>
                        </td>
                        <td className="px-2.5 py-3 text-muted">
                          {fine.daysOverdue}
                        </td>
                        <td className="px-2.5 py-3 font-medium whitespace-nowrap text-teal">
                          {formatRand(fine.amount)}
                        </td>
                        <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                          {fine.issuedOn ? formatDate(fine.issuedOn) : "—"}
                        </td>
                        <td className="px-2.5 py-3">
                          <Pill className={FINE_STATUS_STYLES[fine.status]}>
                            {FINE_STATUS_LABELS[fine.status]}
                          </Pill>
                        </td>
                        <td className="px-2.5 py-3 pr-5">
                          {fine.status === "PAID" ? (
                            <span className="whitespace-nowrap text-muted">
                              Paid {formatDate(fine.datePaid)}
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setPaying(fine)}
                              className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-xs font-semibold whitespace-nowrap text-teal transition-colors hover:bg-sky/30"
                            >
                              <Banknote size={15} aria-hidden="true" />
                              Record Payment
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}

                  {(error || pageFines.length === 0) && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted">
                        {error ||
                          (isLoading
                            ? "Loading fines..."
                            : fines.length === 0
                              ? "No fines yet. Fines are issued when a late book is checked in."
                              : "No fines match your filters.")}
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
              noun="fines"
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <StatsPanel title="Fine Stats" stats={stats} />
          <QuoteCard quote="A library card is a passport to new worlds." />
        </div>
      </div>

      {paying && (
        <RecordPaymentModal
          fine={paying}
          onClose={closePayment}
          onPaid={handlePaid}
        />
      )}
    </AdminLayout>
  );
}

export default ManageFines;
