import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
} from "lucide-react";
import UserLayout from "../../components/UserLayout.jsx";
import IconChip from "../../components/IconChip.jsx";
import LibraryCardPanel from "../../components/loans/LibraryCardPanel.jsx";
import CardPaymentForm from "../../components/loans/CardPaymentForm.jsx";
import { SAMPLE_LOANS, formatDate, loanFine } from "./loanData.js";

const BACK_LINK =
  "inline-flex items-center gap-2 text-sm font-medium text-teal hover:underline";

function PayFine() {
  const { loanId } = useParams();
  // TODO: Fetch the loan from the backend once the endpoint exists.
  const loan = SAMPLE_LOANS.find((l) => String(l.id) === loanId);
  const amount = loan ? loanFine(loan) : 0;
  const [paid, setPaid] = useState(false);

  if (!loan || (amount === 0 && !paid)) {
    return (
      <UserLayout>
        <div className="px-5 py-16 text-center sm:px-8 lg:px-10">
          <h1 className="text-3xl xl:text-4xl">No fine to pay</h1>
          <p className="mt-3 text-muted">
            {loan
              ? `${loan.book.title} has no outstanding fine.`
              : "We couldn't find that loan."}
          </p>
          <Link to="/loans" className={`${BACK_LINK} mt-6`}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to my loans
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <Link to="/loans" className={BACK_LINK}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back to my loans
        </Link>

        <header className="mx-auto mt-2 max-w-xl animate-rise text-center">
          <p className="text-eyebrow text-orange">Library account</p>
          <h1 className="mt-3 text-4xl xl:text-5xl">Pay your fine</h1>
          <p className="mt-3 text-muted">
            Settle your outstanding library fine to keep borrowing books
            without interruption.
          </p>
        </header>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.1fr)]">
          <LibraryCardPanel amount={amount} />

          <section className="rounded-[var(--radius-lg)] border border-border bg-surface/60 p-6 shadow-card sm:p-7">
            {paid ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <CheckCircle2
                  size={56}
                  aria-hidden="true"
                  className="text-success"
                />
                <h2 className="mt-4 text-3xl">Payment received</h2>
                <p className="mt-2 max-w-sm text-muted">
                  Your R{amount.toFixed(2)} fine for {loan.book.title} has been
                  paid. Thank you!
                </p>
                <Link
                  to="/loans"
                  className="mt-6 rounded-[var(--radius-md)] bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep"
                >
                  Back to my loans
                </Link>
              </div>
            ) : (
              <>
                <p className="text-eyebrow text-orange">Payment details</p>
                <h2 className="mt-1 text-3xl">Complete your payment</h2>

                {/* Fine summary */}
                <div className="mt-6 rounded-[var(--radius-md)] bg-sky/30 p-5">
                  <div className="flex items-start justify-between border-b border-sky pb-4">
                    <div>
                      <p className="text-sm text-muted">Outstanding fine</p>
                      <p className="mt-1 font-heading text-4xl text-teal">
                        R{amount.toFixed(2)}
                      </p>
                    </div>
                    <IconChip
                      icon={BookOpen}
                      tone="sky"
                      className="size-12 rounded-full"
                    />
                  </div>
                  <dl className="mt-4 grid grid-cols-[7rem_minmax(0,1fr)] gap-y-2.5 text-sm sm:grid-cols-[10rem_minmax(0,1fr)]">
                    <dt className="text-muted">Reason</dt>
                    <dd className="text-teal">Overdue book</dd>
                    <dt className="text-muted">Book</dt>
                    <dd className="text-teal">{loan.book.title}</dd>
                    <dt className="text-muted">Due date</dt>
                    <dd className="text-teal">{formatDate(loan.dueDate)}</dd>
                  </dl>
                </div>

                <div className="mt-6">
                  <CardPaymentForm amount={amount} onPaid={() => setPaid(true)} />
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </UserLayout>
  );
}

export default PayFine;
