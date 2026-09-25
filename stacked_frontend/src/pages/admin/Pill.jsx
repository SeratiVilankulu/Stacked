import React from "react";

function Pill({ className, children }) {
  return (
    <span
      className={`inline-block rounded-pill px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}

export default Pill;
