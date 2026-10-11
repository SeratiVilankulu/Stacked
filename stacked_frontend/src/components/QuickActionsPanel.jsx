import { Link } from "react-router-dom";
import { ChevronRight, Zap } from "lucide-react";

const ACTION_CLASSES =
  "flex w-full cursor-pointer items-center gap-4 rounded-md bg-sky/40 px-4 py-3 text-left text-sm text-teal transition-colors duration-200 hover:bg-sky";

function QuickActionsPanel({ actions }) {
  return (
    <aside className="rounded-lg border border-sky bg-surface/60 p-5 shadow-card">
      <h3 className="flex items-center gap-2 text-xl">
        <Zap size={20} aria-hidden="true" />
        Quick Actions
      </h3>
      <ul className="mt-4 space-y-3">
        {actions.map(({ to, onClick, icon: Icon, label }) => {
          const content = (
            <>
              <Icon size={22} aria-hidden="true" />
              <span className="flex-1">{label}</span>
              <ChevronRight size={18} aria-hidden="true" />
            </>
          );
          return (
            <li key={label}>
              {to ? (
                <Link to={to} className={ACTION_CLASSES}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={onClick} className={ACTION_CLASSES}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default QuickActionsPanel;
