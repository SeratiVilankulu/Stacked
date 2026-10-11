import {
  Book,
  BookOpen,
  Brain,
  Fingerprint,
  Ghost,
  Heart,
  Library,
  Rocket,
  Sparkles,
  UserRound,
} from "lucide-react";
import Checkbox from "../Checkbox.jsx";
import { genreNames } from "../../lib/books.js";

const GENRE_ICONS = {
  fiction: BookOpen,
  "non-fiction": Book,
  "sci-fi": Rocket,
  fantasy: Sparkles,
  romance: Heart,
  mystery: Fingerprint,
  thriller: Fingerprint,
  horror: Ghost,
  philosophy: Brain,
  psychology: Brain,
  biography: UserRound,
  memoir: UserRound,
};

// Side panel with genre categories and availability checkboxes. Counts come from the /books/stats endpoint.
function CategoryPanel({
  stats,
  genre,
  onGenreChange,
  statuses,
  statusOptions,
  onToggleStatus,
}) {
  const statusCount = (s) =>
    (s === "Available" ? stats?.available : stats?.unavailable) ?? 0;

  const categories = [
    ["ALL", "All Genres", Library, stats?.total ?? 0],
    ...genreNames(stats).map((name) => [
      name,
      name,
      GENRE_ICONS[name.toLowerCase()] ?? BookOpen,
      stats.byGenre[name],
    ]),
  ];

  return (
    <aside className="rounded-md border border-border bg-surface/60 p-5 shadow-card">
      <h3 className="text-xl">Categories</h3>
      <ul className="mt-3 space-y-1">
        {categories.map(([key, label, Icon, count]) => {
          const active = key === genre;
          return (
            <li key={key}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onGenreChange(key)}
                className={`flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-left text-sm transition-colors duration-200 ${
                  active
                    ? "bg-sky/60 font-semibold text-teal"
                    : "text-teal hover:bg-sky/30"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="flex-1">{label}</span>
                <span className="text-xs text-muted">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="my-5 border-t border-border" />

      <h3 className="text-xl">Availability</h3>
      <ul className="mt-3 space-y-1">
        {statusOptions.map((s) => (
          <li key={s}>
            <label className="flex cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-teal hover:bg-sky/30">
              <Checkbox
                checked={statuses.includes(s)}
                onChange={() => onToggleStatus(s)}
                label={s}
              />
              <span className="flex-1">{s}</span>
              <span className="text-xs text-muted">{statusCount(s)}</span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default CategoryPanel;
