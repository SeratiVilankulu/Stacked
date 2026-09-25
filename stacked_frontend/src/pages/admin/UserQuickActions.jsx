import { ChevronRight, ShieldCheck, UserPlus, Users } from "lucide-react";

const QUICK_ACTIONS = [
  { icon: UserPlus, label: "Add New User" },
  { icon: Users, label: "View All Users" },
  { icon: ShieldCheck, label: "Manage User Roles" },
];

function UserQuickActions() {
  return (
    <aside className="rounded-[var(--radius-lg)] border border-sky bg-surface/60 p-5 shadow-card">
      <h3 className="text-xl">Quick Actions</h3>
      <ul className="mt-4 space-y-3">
        {QUICK_ACTIONS.map(({ icon: Icon, label }) => (
          <li key={label}>
            <button
              type="button"
              className="flex w-full cursor-pointer items-center gap-4 rounded-[var(--radius-md)] bg-sky/40 px-4 py-3 text-left text-sm font-medium text-teal transition-colors duration-200 hover:bg-sky"
            >
              <Icon size={22} />
              <span className="flex-1">{label}</span>
              <ChevronRight size={18} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default UserQuickActions;
