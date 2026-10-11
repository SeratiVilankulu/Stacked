import { BarChart3 } from "lucide-react";

function StatsPanel({ title, stats }) {
  return (
    <aside className="rounded-lg border border-sky bg-surface/60 p-5 shadow-card">
      <h3 className="flex items-center gap-2 text-xl">
        <BarChart3 size={20} aria-hidden="true" />
        {title}
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, value, label, alert }) => (
          <div key={label} className="rounded-md bg-sky/40 p-4 text-center">
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

export default StatsPanel;
