import React from "react";
import { NavLink } from "react-router-dom";

function AdminSidebarLinks({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-sky text-teal shadow-sm"
            : "text-cream/75 hover:bg-cream/10 hover:text-cream"
        }`
      }
    >
      {icon}

      <span>{label}</span>
    </NavLink>
  );
}

export default AdminSidebarLinks;
