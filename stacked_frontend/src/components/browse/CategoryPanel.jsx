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
import { GENRE_LABELS } from "../../pages/admin/bookData.js";

const GENRE_ICONS = {
  FICTION: BookOpen,
  NONFICTION: Book,
  SCIENCEFICTION: Rocket,
  FANTASY: Sparkles,
  ROMANCE: Heart,
  MYSTERY: Fingerprint,
  HORROR: Ghost,
  PHILOSOPHY: Brain,
  BIOGRAPHY: UserRound,
};

// Side panel with genre categories and availability checkboxes, each with
// a count of matching books.
function CategoryPanel({
  books,
  genre,
  onGenreChange,
  statuses,
  statusOptions,
  onToggleStatus,
}) {
  const genreCount = (key) => books.filter((b) => b.genre === key).length;
  const statusCount = (s) => books.filter((b) => b.status === s).length;

  const categories = [
    ["ALL", "All Genres", Library, books.length],
    ...Object.entries(GENRE_LABELS).map(([key, label]) => [
      key,
      label,
      GENRE_ICONS[key] ?? BookOpen,
      genreCount(key),
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
