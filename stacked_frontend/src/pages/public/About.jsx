// src/pages/public/About.jsx
import React from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { Users, BookOpen, Sparkles, MapPin, Phone, Mail } from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Community First",
    description:
      "Stacked exists because a neighbourhood library is a shared space — for study groups, story time, and quiet afternoons alike.",
  },
  {
    icon: BookOpen,
    title: "Access For All",
    description:
      "Membership is free, our catalogue keeps growing, and we work hard to make sure cost is never a barrier to reading.",
  },
  {
    icon: Sparkles,
    title: "Lifelong Learning",
    description:
      "From toddler story hours to adult book clubs, we build programs for every stage of a reader's journey.",
  },
];

function About() {
  return (
    <>
      <NavBar />
      <main className="overflow-hidden">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-12 md:px-10 lg:pt-14">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
            <p className="text-eyebrow text-orange-ink">Our Story</p>
            <h1 className="text-4xl md:text-5xl">More Than Just a Library</h1>
            <p className="text-base leading-7 text-muted">
              Stacked is community library, a place to borrow books, discover
              new authors, and connect with fellow readers. We believe every
              neighbourhood deserves a home for stories.
            </p>
          </div>
        </section>

        {/* History */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="overflow-hidden rounded-[var(--radius-lg)] shadow-card">
              <img
                src="/images/library.jpg"
                alt="Reading corner inside Stacked library"
                className="h-80 w-full object-cover md:h-96"
              />
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-eyebrow text-orange-ink">Our History</p>
              <h2 className="text-3xl">Built By Readers, For Readers</h2>
              <p className="leading-7 text-muted">
                Stacked opened its doors in 2011 as a small volunteer-run
                reading room above a Midrand community hall. A handful of
                donated shelves and a shared love of books grew, year by year,
                into the library you see today.
              </p>
              <p className="leading-7 text-muted">
                We're proud to be entirely community-supported, funded by local
                partners, staffed by people who live here, and shaped by the
                readers who walk through our doors every day.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-orange-ink">What We Stand For</p>
            <h2 className="mt-1 text-3xl">Our Values</h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-card"
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-orange-soft">
                  <value.icon
                    className="size-5 text-orange-ink"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="text-xl">{value.title}</h3>
                <p className="text-sm leading-6 text-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Hours & location */}
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-10">
          <div className="grid gap-10 rounded-[var(--radius-lg)] bg-sand px-8 py-10 md:grid-cols-2 md:px-12">
            <div className="flex flex-col gap-4">
              <p className="text-eyebrow text-orange-ink">Visit Us</p>
              <h2 className="text-3xl">Opening Hours</h2>
              <ul className="flex flex-col gap-2 text-sm text-ink">
                <li className="flex items-center justify-between border-b border-border-strong/60 pb-2">
                  <span>Monday - Friday</span>
                  <span className="font-medium">08:00 - 18:00</span>
                </li>
                <li className="flex items-center justify-between border-b border-border-strong/60 pb-2">
                  <span>Saturday</span>
                  <span className="font-medium">09:00 - 14:00</span>
                </li>
                <li className="flex items-center justify-between pb-2">
                  <span>Sunday & Public Holidays</span>
                  <span className="font-medium">Closed</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-eyebrow text-orange-ink">Get In Touch</p>
              <h2 className="text-3xl">Find Us</h2>
              <ul className="flex flex-col gap-3 text-sm text-ink">
                <li className="flex items-center gap-3">
                  <MapPin
                    className="size-4 shrink-0 text-orange-ink"
                    aria-hidden="true"
                  />
                  16 Bridge Road, Waterkloof, Pretoria
                </li>
                <li className="flex items-center gap-3">
                  <Phone
                    className="size-4 shrink-0 text-orange-ink"
                    aria-hidden="true"
                  />
                  +27 11 000 0000
                </li>
                <li className="flex items-center gap-3">
                  <Mail
                    className="size-4 shrink-0 text-orange-ink"
                    aria-hidden="true"
                  />
                  hello@stackedlibrary.co.za
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default About;
