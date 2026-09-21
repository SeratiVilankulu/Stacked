// components/Footer.jsx
import React from "react";
import { CiFacebook } from "react-icons/ci";
import { FiInstagram } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import { BookOpen, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  return (
    <footer className="relative overflow-hidden bg-teal-deep text-white">
      {/* Decorative leaf accent, echoes the hero */}
      <div className="pointer-events-none absolute -right-10 -top-10 hidden text-white/10 lg:block">
        <svg
          width="180"
          height="220"
          viewBox="0 0 180 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M180 60C135 100 110 155 75 220"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M162 78C160 120 135 157 75 220"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M145 95C110 100 75 115 35 150"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M165 55C125 60 95 75 55 100"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            d="M175 35C145 40 125 35 95 25"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
                <BookOpen className="size-5 text-orange" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-lg font-semibold tracking-wide">STACKED</p>
                <p className="text-xs text-white/60">Community Library</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-6 text-white/70">
              Your local library, made simple. Discover thousands of books, all
              in one place.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-9 items-center
              justify-center rounded-full bg-white/10 transition-colors
              duration-200 hover:bg-orange"
              >
                <CiFacebook className="size-4" aria-hidden="true" />
              </a>

              <a
                href="#"
                aria-label="Instagram"
                className="flex size-9
              items-center justify-center rounded-full bg-white/10
              transition-colors duration-200 hover:bg-orange"
              >
                <FiInstagram className="size-4" aria-hidden="true" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex size-9 items-center
              justify-center rounded-full bg-white/10 transition-colors
              duration-200 hover:bg-orange"
              >
                <BsTwitterX className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
              <li>
                <a
                  href="/"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/books"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  Books
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Library */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Library
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
              <li>
                <a
                  href="/loans"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  My Loans
                </a>
              </li>
              <li>
                <a
                  href="/reservations"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  Reservations
                </a>
              </li>
              <li>
                <a
                  href="/help"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  Help Centre
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="transition-colors duration-200 hover:text-orange"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-white/50">
              Get in touch
            </p>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <MapPin
                  className="size-4 shrink-0 text-orange"
                  aria-hidden="true"
                />
                WaterKloof, Pretoria
              </li>
              <li className="flex items-center gap-2">
                <Phone
                  className="size-4 shrink-0 text-orange"
                  aria-hidden="true"
                />
                +27 11 000 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail
                  className="size-4 shrink-0 text-orange"
                  aria-hidden="true"
                />
                hello@stackedlibrary.co.za
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 flex flex-col gap-4 rounded-[28px] bg-white/5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-semibold">Never miss a good read</p>
            <p className="text-sm text-white/60">
              Sign up for new arrivals, events and reading picks.
            </p>
          </div>
          <form className="flex w-full max-w-sm items-center gap-2 rounded-pill border border-white/20 bg-white/10 p-1">
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-white outline-none! text-left! placeholder:text-white/50"
            />
            <button
              type="submit"
              className="shrink-0 cursor-pointer rounded-pill bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange/90 active:translate-y-px"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} Stacked | Community Library. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="transition-colors duration-200 hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="transition-colors duration-200 hover:text-white"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
