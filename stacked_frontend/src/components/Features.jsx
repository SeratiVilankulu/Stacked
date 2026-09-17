import React from "react";
import { BookOpen, User, ShieldCheck, Clock3 } from "lucide-react";

function Features() {
  return (
    <div>
      <div className="mx-auto mt-10 grid max-w-6xl mb-10 grid-cols-1 divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0">
        {/* Feature 1 */}
        <div className="flex items-center gap-4 px-5 py-5 md:py-2">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-teal"
          >
            <BookOpen className="size-7 text-white" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal font-body">
              Wide Selection
            </h3>

            <p className="mt-1 text-xs leading-5 text-teal">
              Fiction, non-fiction, academic and more.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-center gap-4 px-5 py-5 md:py-2">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-mocha">
            <User className="size-7 text-white" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal font-body">
              Easy Borrowing
            </h3>

            <p className="mt-1 text-xs leading-5 text-teal">
              Manage your loans online.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-center gap-4 px-5 py-5 md:py-2">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-sky/30">
            <ShieldCheck className="size-7 text-teal" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal font-body">
              Secure & Reliable
            </h3>

            <p className="mt-1 text-xs leading-5 text-teal">
              Your data is safe with us.
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-center gap-4 px-5 py-5 md:py-2">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-orange">
            <Clock3 className="size-7 text-white" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-teal font-body">
              Always Accessible
            </h3>

            <p className="mt-1 text-xs leading-5 text-teal">
              Find your next favourite book, anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
