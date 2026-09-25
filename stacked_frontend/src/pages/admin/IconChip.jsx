import React from "react";

function IconChip({ icon: Icon, tone, className = "size-14 rounded-2xl" }) {
  // Icon chip colours, reused by the stat cards, quick actions and activity feed.
  const TONES = {
    sky: "bg-sky text-teal",
    mocha: "bg-mocha text-cream",
    orange: "bg-orange text-white",
  };

  return (
    <span
      className={`grid shrink-0 place-items-center ${TONES[tone]} ${className}`}
    >
      <Icon size={26} />
    </span>
  );
}

export default IconChip;
