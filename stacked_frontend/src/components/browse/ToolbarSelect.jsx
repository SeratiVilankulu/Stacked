import {
  ChevronDown,
} from "lucide-react";

// Styled dropdown: icon, small label and the selected option's text, with a
function ToolbarSelect({ icon: Icon, label, value, onChange, options }) {
  const selectedText = options.find(([v]) => v === value)?.[1];

  return (
    <label className="relative flex min-w-0 items-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 transition-colors duration-200 hover:border-border-strong">
      <Icon size={20} aria-hidden="true" className="shrink-0 text-teal" />
      <span className="flex min-w-0 flex-col">
        <span className="text-xs text-muted">{label}</span>
        <span className="truncate text-sm font-medium text-teal">
          {selectedText}
        </span>
      </span>
      <ChevronDown
        size={16}
        aria-hidden="true"
        className="ml-auto shrink-0 text-teal"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {options.map(([v, text]) => (
          <option key={v} value={v}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
}

export default ToolbarSelect;
