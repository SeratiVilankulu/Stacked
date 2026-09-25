import React from "react";
import { Link } from "react-router-dom";
import IconChip from "./IconChip";

import { ArrowRight } from "lucide-react";

function ActionCard({ to, icon, tone, title, text, leaf }) {
  return (
    <Link
      to={to}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-sky bg-surface px-4 py-6 shadow-card transition-shadow duration-200 hover:shadow-lift"
    >
      <IconChip icon={icon} tone={tone} className="size-16 rounded-full" />
      <h3 className="mt-5 text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
      <span className="mt-6 grid h-8 w-12 place-items-center rounded-pill bg-teal text-cream transition-colors duration-200 group-hover:bg-teal-deep">
        <ArrowRight size={16} />
      </span>
      <img
        src={leaf}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-2 -bottom-2 w-16 opacity-50"
      />
    </Link>
  );
}
export default ActionCard;
