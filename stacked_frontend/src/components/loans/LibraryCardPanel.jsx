import { BookOpen } from "lucide-react";
import LeafBlue from "@/assets/leaf_image2.png";

// Decorative teal panel showing the member's library card and the fine owed.
function LibraryCardPanel({ amount }) {
  return (
    <div className="relative hidden min-h-144 overflow-hidden rounded-lg bg-teal lg:block">
      {/* Background shapes */}
      <div className="absolute -top-24 -right-20 size-80 rounded-full bg-sky/15" />
      <div className="absolute -bottom-28 -left-16 h-72 w-[130%] rounded-[50%] bg-sky/10" />

      <img
        src={LeafBlue}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-6 right-6 w-28 opacity-40 brightness-200"
      />
      <img
        src={LeafBlue}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 -left-6 w-24 -rotate-12 opacity-30 brightness-200"
      />
      <img
        src={LeafBlue}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute right-4 bottom-8 w-20 rotate-12 opacity-30 brightness-200"
      />

      {/* Library card */}
      <div className="absolute top-24 right-8 left-10 rounded-lg border border-cream/15 bg-mocha p-6 text-cream shadow-lift">
        <div className="flex items-start justify-between border-b border-cream/15 pb-4">
          <p className="font-heading text-xl leading-tight">
            STACKED
            <br />
            Library Card
          </p>
          <BookOpen size={36} aria-hidden="true" className="text-orange" />
        </div>
        <p className="mt-4 text-eyebrow text-cream/80">Outstanding fine</p>
        <p className="mt-1 font-heading text-4xl">R{amount.toFixed(2)}</p>
        <div className="mt-4 flex justify-between border-t border-cream/15 pt-4 text-xs tracking-[0.12em] uppercase">
          <span>Member</span>
          <span>Stacked</span>
        </div>
      </div>

      {/* Book stack */}
      <svg
        viewBox="0 0 240 150"
        aria-hidden="true"
        className="absolute bottom-10 left-10 w-56"
      >
        {[
          { y: 100, x: 10, cover: "#5e8ea3" },
          { y: 62, x: 22, cover: "#7fa9bb" },
          { y: 24, x: 4, cover: "#c1dbe8" },
        ].map(({ y, x, cover }) => (
          <g key={y}>
            <rect x={x} y={y} width="200" height="36" rx="6" fill={cover} />
            <rect
              x={x + 150}
              y={y + 6}
              width="54"
              height="24"
              rx="3"
              fill="#fdf0dc"
            />
            <line
              x1={x + 24}
              x2={x + 24}
              y1={y + 4}
              y2={y + 32}
              stroke="#003844"
              strokeOpacity="0.25"
              strokeWidth="2"
            />
          </g>
        ))}
        <rect x="22" y="94" width="200" height="4" fill="#f18805" />
      </svg>
    </div>
  );
}

export default LibraryCardPanel;
