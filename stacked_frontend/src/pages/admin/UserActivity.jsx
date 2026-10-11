import { BadgeCheck, Ban, UserPlus, Users } from "lucide-react";

function UserActivity({ stats }) {
  const activity = [
    { icon: Users, value: stats?.total, label: "Total Users" },
    { icon: UserPlus, value: stats?.newThisMonth, label: "New This Month" },
    { icon: BadgeCheck, value: stats?.active, label: "Active Users" },
    { icon: Ban, value: stats?.suspended, label: "Suspended", accent: true },
  ];

  return (
    <aside className="rounded-lg border border-sky bg-surface/60 p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-xl">User Activity</h3>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {activity.map(({ icon: Icon, value, label, accent }) => (
          <div key={label} className="rounded-md bg-sky/40 p-4">
            <div className="flex items-end gap-2">
              <Icond
                size={26}
                className={accent ? "text-orange" : "text-teal"}
              />
              <span className="font-heading text-3xl leading-none text-teal">
                {value ?? "–"}
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
