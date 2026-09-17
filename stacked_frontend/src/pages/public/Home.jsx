import React from "react";
import { Search } from "lucide-react";
import NavBar from "../../components/NavBar";
import Features from "../../components/Features";
import Leaf from "@/assets/leaf_image.png";
import Leaf_2 from "@/assets/leaf_image2.png";
import SkyBlob from "@/assets/sky_blob.svg";
import TealBlob from "@/assets/teal_blob.svg";
import Footer from "../../components/Footer";

function Home() {
  return (
    <>
      <NavBar />
      <main className="overflow-hidden">
				{/* Left decorative leaves */}
          <div className="pointer-events-none absolute top-10 hidden text-sky/50 lg:block">
            {/* Blue leaf in top-left corner */}
            <img
              src={Leaf_2}
              alt=""
              aria-hidden="true"
              className="pointer-events-none relative top-2 -left-6 z-20 w-10 md:w-40 rotate-45"
            />
          </div>
        <section className="relative mx-auto max-w-7xl px-6 pt-12 md:px-10 lg:pt-14">
          <div className="flex flex-col gap-2 items-center text-center max-w-4xl mx-auto">
            <div className="flex items-center gap-4 text-sky">
              <span className="h-px w-12 bg-sky" />
              <span className="text-md font-medium capitalize md:uppercase">
                Welcome to Stacked
              </span>
              <span className="h-px w-12 bg-sky" />
            </div>
            <h1 className="text-3xl font-semibold capitalize leading-[1.05] md:text-4xl lg:text-5xl">
              Your next great read <br />
              <span className="text-orange capitalize italic">awaits</span>
            </h1>
            <span className="capitalize text-teal text-[18px] font-semibold">
              borrow. read. grow
            </span>
            <p className="w-140 max-w-2xl text-sm leading-6 text-teal md:text-base">
              Stacked is you local library, made simple. Discover thousands of
              books, borrow your loaned books, aand keep track of your reading
              library.
            </p>
            {/* Search bar */}
            <div className=" w-full max-w-2xl border border-border rounded-pill p-1 mt-4 flex items-center gap-2">
              <Search
                className="ml-4 size-5 shrink-0 text-teal"
                aria-hidden="true"
              />
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent outline-none! px-4 py-2.5 text-teal rounded-pill placeholder:text-muted-foreground w-100 text-left!"
                placeholder="Search for books, authors, or genres"
              />
              <button
                type="button"
                className="cursor-pointer inline-flex items-center gap-2 rounded-pill bg-teal px-10 py-3 text-sm font-semibold text-white outline-none shadow-card transition-colors duration-200 hover:bg-teal-deep active:translate-y-px placeholder:text-muted-foreground"
              >
                Search
              </button>
            </div>
          </div>
          {/* Decorative images */}
          <div className="relative mx-auto mt-10 max-w-5xl">
            {/* Light blue blob peeking out lower-left */}
            <img
              src={SkyBlob}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -left-10 bottom-6 -z-10 w-36 md:-left-16 md:bottom-8 md:w-52"
            />

            {/* Teal blob peeking out top-right and bottom-right */}
            <img
              src={TealBlob}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-10 -z-10 h-[calc(100%+5rem)] md:-right-12 md:-top-14"
            />

            {/* Library photo */}
            <div className="relative z-10 overflow-hidden rounded-tl-[240px] rounded-bl-[70px] rounded-r-[70px] shadow-card">
              <img
                src="/images/library.jpg"
                alt="Books and coffee in a library"
                className="h-75 w-full object-cover md:h-90"
              />
            </div>

            {/* Orange leaf overlapping the top-right corner */}
            <img
              src={Leaf}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute top-6 -right-6 z-20 w-12 md:-top-8 md:-right-6 md:w-16"
            />
          </div>
          <Features />
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Home;
