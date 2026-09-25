import React from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import ActionCard from "./ActionCard.jsx";
import IconChip from "./IconChip";
import { useAuth } from "../../context/auth-context.js";
import HeroBooks from "@/assets/stackedBooks.jpg";
import Leaf from "@/assets/leaf_image.png";
import LeafBlue from "@/assets/leaf_image2.png";
import { ArrowRight, BookOpen, Clock, Database, User } from "lucide-react";

const QUICK_ACTIONS = [
  {
    to: "/admin/books",
    icon: BookOpen,
    tone: "sky",
    title: "Manage Books",
    text: "Add, edit or remove books.",
    leaf: LeafBlue,
  },
  {
    to: "/admin/users",
    icon: User,
    tone: "mocha",
    title: "Manage Users",
    text: "View and manage member accounts.",
    leaf: Leaf,
  },
  {
    to: "/admin/loans",
    icon: Clock,
    tone: "orange",
    title: "Manage Loans",
    text: "Track current loans and returns.",
    leaf: LeafBlue,
  },
  {
    to: "/admin/fines",
    icon: Database,
    tone: "sky",
    title: "Manage Fines",
    text: "View and manage outstanding fines.",
    leaf: Leaf,
  },
];

// Placeholder feed until activity is recorded on the backend.
const ACTIVITY = [
  {
    icon: BookOpen,
    title: "New book added",
    detail: "Atomic Habits by James Clear",
    time: "2 hours ago",
  },
  {
    icon: User,
    title: "New user registered",
    detail: "Thabo Mkhize",
    time: "4 hours ago",
  },
  {
    icon: Clock,
    title: "Book returned",
    detail: "The Midnight Library",
    time: "5 hours ago",
  },
  {
    icon: Database,
    title: "Fine paid",
    detail: "R 45.00 - Deep Work",
    time: "1 day ago",
  },
];

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-10">
          {/* Welcome */}
          <section className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="animate-rise">
              <p className="text-eyebrow text-orange">Admin Dashboard</p>
              <h1 className="mt-3 text-4xl xl:text-5xl">
                Welcome back, {user?.name}.
              </h1>
              <p className="mt-3 text-muted">
                Here&rsquo;s what&rsquo;s happening with the library today.
              </p>
            </div>

            <div className="relative hidden h-44 w-72 shrink-0 md:block 2xl:w-96">
              <div className="absolute inset-y-0 left-0 w-3/4 rounded-[50%] bg-sky/70" />
              <img
                src={HeroBooks}
                alt="A stack of books in a library"
                className="absolute top-0 right-0 h-full w-4/5 rounded-tl-[6rem] rounded-br-[var(--radius-lg)] rounded object-cover shadow-card"
              />
            </div>
          </section>

          {/* Quick actions */}
          <section>
            <p className="text-eyebrow text-orange">Quick Actions</p>
            <h2 className="mt-2">Manage Your Library</h2>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
              {QUICK_ACTIONS.map((action) => (
                <ActionCard key={action.title} {...action} />
              ))}
            </div>
          </section>

          {/* Overview banner */}
          <section className="relative flex items-center gap-5 overflow-hidden rounded-[var(--radius-lg)] bg-sky/60 p-6">
            <IconChip
              icon={BookOpen}
              tone="sky"
              className="size-14 rounded-full"
            />
            <div className="relative z-10">
              <h3 className="text-2xl">Library Overview</h3>
              <p className="mt-1 text-sm text-muted">
                More readers. More knowledge. A stronger community.
              </p>
            </div>
            <img
              src={LeafBlue}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-6 right-8 hidden w-28 opacity-50 sm:block"
            />
          </section>
        </div>

        {/* Recent activity */}
        <aside className="h-fit rounded-[var(--radius-lg)] bg-sky/40 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl">Recent Activity</h3>
            <Link
              to="/admin/reports"
              className="flex items-center gap-1 text-sm font-medium text-orange hover:underline"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          <ul className="mt-4 divide-y divide-teal/10">
            {ACTIVITY.map(({ icon: Icon, title, detail, time }) => (
              <li key={title} className="flex gap-4 py-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-surface text-teal shadow-card">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-teal">{title}</p>
                  <p className="truncate text-sm text-muted">{detail}</p>
                  <p className="mt-1 text-xs text-muted">{time}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
