import { BarChart3, BookOpen, Clock3, History } from "lucide-react";

// Small stat tiles for the loans sidebar.
function LoanStats({ current, dueSoon, overdue, returned }) {
  const STATS = [
    { icon: BookOpen, value: current, label: "On Loan" },
    { icon: Clock3, value: dueSoon, label: "Due Soon" },
    { icon: Clock3, value: overdue, label: "Overdue", alert: overdue > 0 },
    { icon: History, value: returned, label: "Returned" },
  ];

  return (
    <aside className="rounded-[var(--radius-lg)] border border-sky bg-surface/60 p-5 shadow-card">
      <h3 className="flex items-center gap-2 text-xl">
        <BarChart3 size={20} aria-hidden="true" />
        Loan Stats
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {STATS.map(({ icon: Icon, value, label, alert }) => (
          <div
            key={label}
            className="rounded-[var(--radius-md)] bg-sky/40 p-4 text-center"
          >
            <Icon
              size={22}
              aria-hidden="true"
              className={`mx-auto ${alert ? "text-orange" : "text-teal"}`}
            />
            <p
              className={`mt-2 font-heading text-2xl ${alert ? "text-orange-ink" : "text-teal"}`}
            >
              {value}
            </p>
            <p className="text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default LoanStats;
