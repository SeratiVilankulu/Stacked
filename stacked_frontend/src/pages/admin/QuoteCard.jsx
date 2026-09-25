import React from "react";
import LeafBlue from "@/assets/leaf_image2.png";

function QuoteCard() {
  return (
    <aside className="relative overflow-hidden rounded-[var(--radius-lg)] bg-sky/60 p-6 pt-25">
      <img
        src={LeafBlue}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-2 right-28 w-24 opacity-60"
      />
      <p className="font-quote text-xl leading-snug italic text-teal">
        &ldquo;A library card is a passport to new worlds.&rdquo;
      </p>
    </aside>
  );
}

export default QuoteCard;
