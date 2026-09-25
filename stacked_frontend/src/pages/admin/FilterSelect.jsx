import React from "react";
import { ChevronDown} from "lucide-react"

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-teal">{label}</span>
      <span className="relative mt-2 block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-[var(--radius-md)] border border-sky bg-cream py-2.5 pr-10 pl-4 text-sm text-teal focus:outline-none! lg:w-40"
        >
          {options.map(([v, text]) => (
            <option key={v} value={v}>
              {text}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-teal"
        />
      </span>
    </label>
  );
}

export default FilterSelect;
