import React from "react";

function PageButton({ label, active, disabled, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`grid size-8 cursor-pointer place-items-center rounded-[var(--radius-sm)] text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
        active ? "bg-teal text-cream" : "bg-sand/70 text-teal hover:bg-sky"
      }`}
    >
      {children}
    </button>
  );
}

export default PageButton;
