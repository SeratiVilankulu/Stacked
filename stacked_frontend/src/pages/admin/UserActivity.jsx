import { ArrowRight, BadgeCheck, Ban, UserPlus, Users } from "lucide-react";

function UserActivity({ users }) {
  const thisMonth = new Date().toISOString().slice(0, 7);
  const activity = [
    { icon: Users, value: users.length, label: "Total Users" },
    {
      icon: UserPlus,
      value: users.filter((u) => u.createdAt.startsWith(thisMonth)).length,
      label: "New This Month",
    },
    {
      icon: BadgeCheck,
      value: users.filter((u) => u.status === "Active").length,
      label: "Active Users",
    },
    {
      icon: Ban,
      value: users.filter((u) => u.status === "Suspended").length,
      label: "Suspended",
      accent: true,
    },
  ];

  return (
    <aside className="rounded-[var(--radius-lg)] border border-sky bg-surface/60 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl">User Activity</h3>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-1 text-sm font-medium text-orange-ink hover:underline"
        >
          View all <ArrowRight size={14} />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {activity.map(({ icon: Icon, value, label, accent }) => (
          <div key={label} className="rounded-[var(--radius-md)] bg-sky/40 p-4">
            <div className="flex items-end gap-2">
              <Icon size={26} className={accent ? "text-orange" : "text-teal"} />
              <span className="font-heading text-3xl leading-none text-teal">
                {value}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted">{label}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default UserActivity;
