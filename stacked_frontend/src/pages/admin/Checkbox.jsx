import React from "react";

function Checkbox({ checked, onChange, label }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-label={label}
      className="size-4 cursor-pointer accent-teal"
    />
  );
}

export default Checkbox;
