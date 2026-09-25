import React from "react";

function IconButton({ label, onClick, danger, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid size-8 cursor-pointer place-items-center rounded-full bg-sand/70 text-teal transition-colors duration-200 ${
        danger ? "hover:bg-alert/10 hover:text-alert" : "hover:bg-sky"
      }`}
    >
      {children}
    </button>
  );
}

export default IconButton;
