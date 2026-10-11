import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { CircleCheck } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "../../components/FilterSelect.jsx";
import Pill from "../../components/Pill.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import CoverImage from "../../components/book/CoverImage.jsx";
import CheckInModal from "../../components/loans/CheckInModal.jsx";
import LoanStats from "../../components/loans/LoanStats.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import {
  LOAN_STATUS_LABELS,
  LOAN_STATUS_STYLES,
  formatDate,
  loanStatus,
} from "../user/loanData.js";
import { fetchAllLoans } from "../../lib/loans.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";

const PAGE_SIZE = 8;

const STATUS_FILTERS = [
  ["ALL", "All Statuses"],
  ...["ON_LOAN", "DUE_SOON", "OVERDUE", "RETURNED"].map((s) => [
    s,
    LOAN_STATUS_LABELS[s],
  ]),
];

// Show unreturned loans first, soonest due at the top; then returns, newest first
const byUrgency = (a, b) => {
  if (Boolean(a.returnedOn) !== Boolean(b.returnedOn)) return a.returnedOn ? 1 : -1;
  return a.returnedOn
    ? new Date(b.returnedOn) - new Date(a.returnedOn)
    : new Date(a.dueDate) - new Date(b.dueDate);
};

const memberName = (loan) =>
  loan.user ? `${loan.user.name} ${loan.user.surname}` : "Unknown member";

function ManageLoans() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [checkingIn, setCheckingIn] = useState(null); // The loan in the check-in modal
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch all loans in one request, then search, filter and display them on the browser
  const request = useRequest(fetchAllLoans, `all-loans-${reloadKey}`);
  const { isLoading } = request;
  const error = request.error && apiErrorMessage(request.error);

  const loans = useMemo(() => request.data ?? [], [request.data]);

  const counts = useMemo(() => {
    const c = { ON_LOAN: 0, DUE_SOON: 0, OVERDUE: 0, RETURNED: 0 };
    loans.forEach((loan) => (c[loanStatus(loan)] += 1));
    return c;
  }, [loans]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return loans
      .filter(
        (loan) =>
          (status === "ALL" || loanStatus(loan) === status) &&
          (!q ||
            `${loan.book?.title} ${memberName(loan)} ${loan.user?.email}`
              .toLowerCase()
              .includes(q)),
      )
      .sort(byUrgency);
  }, [loans, query, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageLoans = filtered.slice(start, start + PAGE_SIZE);

  // Any filter change starts back on page 1.
  const filterReset = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const closeCheckIn = useCallback(() => setCheckingIn(null), []);

  const handleCheckedIn = (loan) => {
    toast.success(
      loan.fineIssued
        ? `${loan.book.title} checked in. A R${loan.fineIssued.amountOwed} fine was issued.`
        : `${loan.book.title} checked in`,
    );
    setCheckingIn(null);
    setReloadKey((k) => k + 1);
  };

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PageHeading
            title="Manage Loans"
            description="Track every loan and check books back in when they are returned."
          />

          <FilterBar
            searchLabel="Search Loans"
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

          {/* Loans table */}
          <section className="overflow-hidden rounded-lg border border-sky bg-surface shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full min-w-3xl text-left text-[13px]">
                <thead className="bg-sky/40 text-teal">
                  <tr>
                    <th className="py-4 pl-5 font-semibold">Book</th>
                    <th className="px-2.5 py-4 font-semibold">Member</th>
                    <th className="px-2.5 py-4 font-semibold">Borrowed</th>
                    <th className="px-2.5 py-4 font-semibold">Due</th>
                    <th className="px-2.5 py-4 font-semibold">Status</th>
                    <th className="px-2.5 py-4 pr-5 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody
                  aria-busy={isLoading}
                  className={`divide-y divide-border transition-opacity ${isLoading ? "opacity-60" : ""}`}
                >
                  {!error &&
                    pageLoans.map((loan) => {
                      const loanState = loanStatus(loan);
                      return (
                        <tr
                          key={loan.id}
                          className="transition-colors hover:bg-sky/10"
                        >
                          <td className="py-3 pl-5">
                            <div className="flex items-center gap-3">
                              <CoverImage book={loan.book} className="w-10" />
                              <div className="min-w-0">
                                <p className="font-medium text-teal">
                                  {loan.book.title}
                                </p>
                                <p className="text-xs text-muted">
                                  {loan.copy?.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2.5 py-3">
                            <p className="whitespace-nowrap text-teal">
                              {memberName(loan)}
                            </p>
                            <p className="text-xs text-muted">
                              {loan.user?.email}
                            </p>
                          </td>
                          <td className="px-2.5 py-3 whitespace-nowrap text-muted">
                            {formatDate(loan.borrowedOn)}
                          </td>
                          <td
                            className={`px-2.5 py-3 whitespace-nowrap ${loanState === "OVERDUE" ? "font-medium text-alert" : "text-muted"}`}
                          >
                            {formatDate(loan.dueDate)}
                          </td>
                          <td className="px-2.5 py-3">
                            <Pill className={LOAN_STATUS_STYLES[loanState]}>
                              {LOAN_STATUS_LABELS[loanState]}
                            </Pill>
                          </td>
                          <td className="px-2.5 py-3 pr-5">
                            {loan.returnedOn ? (
                              <span className="whitespace-nowrap text-muted">
                                Returned {formatDate(loan.returnedOn)}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setCheckingIn(loan)}
                                className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border-strong px-3 py-2 text-xs font-semibold whitespace-nowrap text-teal transition-colors hover:bg-sky/30"
                              >
                                <CircleCheck size={15} aria-hidden="true" />
                                Check In
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                  {(error || pageLoans.length === 0) && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted">
                        {error ||
                          (isLoading
                            ? "Loading loans..."
                            : "No loans match your filters.")}
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
              noun="loans"
              onPageChange={setPage}
            />
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <LoanStats
            current={counts.ON_LOAN}
            dueSoon={counts.DUE_SOON}
            overdue={counts.OVERDUE}
            returned={counts.RETURNED}
          />
          <QuoteCard quote="A library card is a passport to new worlds." />
        </div>
      </div>

      {checkingIn && (
        <CheckInModal
          loan={checkingIn}
          onClose={closeCheckIn}
          onCheckedIn={handleCheckedIn}
        />
      )}
    </AdminLayout>
  );
}

export default ManageLoans;
