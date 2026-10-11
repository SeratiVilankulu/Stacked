function TabBar({ tabs, active, onChange }) {
  return (
    <div role="tablist" className="flex flex-wrap gap-3">
      {tabs.map(({ key, label, icon: Icon, count }) => {
        const selected = active === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(key)}
            className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-5 py-3 text-sm font-medium transition-colors duration-200 ${
              selected
                ? "border-teal bg-teal text-cream"
                : "border-border bg-surface text-teal hover:bg-sky/30"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
            {count !== undefined && ` (${count})`}
          </button>
        );
      })}
    </div>
  );
}

export default TabBar;
