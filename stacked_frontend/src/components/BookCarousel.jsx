import React, { useRef } from "react";
import BookCard from "./BookCard";
import { useAuth } from "../context/auth-context.js";
import { ChevronLeft, ChevronRight, ArrowRight, BookOpen } from "lucide-react";

const books = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fiction",
    cover: "/images/books/midnight-library.jpg",
  },
  {
    title: "Daisy Jones & The Six",
    author: "Taylor Jenkins Reid",
    genre: "Fiction",
    cover: "/images/books/daisy-jones.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help",
    cover: "/images/books/atomic-habits.jpg",
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "Sci-Fi",
    cover: "/images/books/project-hail-mary.jpg",
  },
  {
    title: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: "Romance",
    cover: "/images/books/evelyn-hugo.jpg",
  },
  {
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: "Fiction",
    cover: "/images/books/crawdads-sing.jpg",
  },
];

function BookCarousel() {
  const { isAuthenticated } = useAuth();

  const scrollerRef = useRef(null);

  const scrollByCard = (direction) => {
    const node = scrollerRef.current;
    if (!node) return;
    const card = node.querySelector("[data-card]");
    const amount = card ? card.offsetWidth + 16 : 200;
    node.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange">
            Explore
          </p>

          <h2 className="font-display text-3xl text-teal">
            Browse by category
          </h2>
        </div>
        <a
          href="/books"
          className="hidden items-center gap-1.5 text-sm
        font-semibold text-orange-ink hover:underline sm:flex"
        >
          View All Books
          <ArrowRight className="size-4" aria-hidden="true" />
        </a>
      </div>

      <div className="relative mt-6">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByCard(-1)}
          className="absolute left-0 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-surface shadow-card transition-colors duration-200 hover:bg-sand md:flex"
        >
          <ChevronLeft className="size-4 text-teal" aria-hidden="true" />
        </button>

        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
        >
          {books.map((book) => (
            <div
              key={book.title}
              data-card
              className="w-44 shrink-0 snap-start sm:w-48"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByCard(1)}
          className="absolute right-0 top-1/2 z-10 hidden size-9 -translate-y-1/2 translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-surface shadow-card transition-colors duration-200 hover:bg-sand md:flex"
        >
          <ChevronRight className="size-4 text-teal" aria-hidden="true" />
        </button>
      </div>

      {!isAuthenticated && (
        <div className="mt-10 flex flex-col items-center justify-between gap-6 rounded-[var(--radius-lg)] bg-sand px-8 py-6 sm:flex-row">
          <div className="flex items-center gap-4">
            <BookOpen
              className="size-10 shrink-0 text-teal/40"
              aria-hidden="true"
            />
            <div>
              <p className="font-semibold text-teal">
                Ready to start your reading journey?
              </p>
              <p className="text-sm text-muted">
                Sign in or create an account to borrow books, manage your loans
                and more.
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <a
              href="/login"
              className="cursor-pointer rounded-pill bg-teal px-6
            py-2.5 text-sm font-semibold text-cream transition-colors
            duration-200 hover:bg-teal-deep active:translate-y-px"
            >
              Sign In
            </a>

            <a
              href="/register"
              className="cursor-pointer rounded-pill border
            border-border-strong px-6 py-2.5 text-sm font-semibold text-teal
            transition-colors duration-200 hover:bg-surface
            active:translate-y-px"
            >
              Create Account
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

export default BookCarousel;
