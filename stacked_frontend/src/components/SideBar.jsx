import React from "react";
import SidebarLink from "./SideBarLink.jsx";
import Leaf from "@/assets/leaf_image.png";
import {
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Clock3,
  House,
  Bell,
  LogOut,
  LayoutDashboard,
  BookOpen,
  Bookmark,
  Clock3,
  House,
  Bell,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 flex-col bg-[#43302E] px-5 py-7 text-white lg:flex">
      {/* Navigation */}
      <nav className="flex-1">
        <div className="space-y-1.5">
          <SidebarLink to="/" icon={<House size={19} />} label="Home" />

          <SidebarLink
            to="/dashboard"
            icon={<LayoutDashboard size={19} />}
            label="Dashboard"
          />

          <SidebarLink
            to="/books"
            icon={<BookOpen size={19} />}
            label="Browse Books"
          />

          <SidebarLink
            to="/my-library"
            icon={<Bookmark size={19} />}
            label="My Library"
          />

          <SidebarLink
            to="/loans"
            icon={<Clock3 size={19} />}
            label="My Loans"
          />
        </div>

        <div className="my-7 border-t border-cream/15" />

        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/40">
          Notify
        </p>

        <div className="space-y-1.5">
          <SidebarLink
            to="/notifications"
            icon={<Bell size={19} />}
            label="Notifications"
          />
        </div>
      </nav>

      {/* Bottom section */}
      <div className="mt-auto">
        {/* Quote */}
        <div className="mx-4 rounded-2xl pt-10">
          <img
            src={Leaf}
            alt=""
            aria-hidden="true"
            className="pointer-events-none ml-12 mb-8 md:w-20"
          />

          <p className="font-quote italic text-2xl leading-tight text-cream">
            Books build <br />
            better futures.
          </p>

          <div className="mt-4 h-0.5 w-8 bg-orange" />
        </div>

        {/* Logout */}
        <div className="my-7 border-t border-cream/15" />

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-cream/70 transition hover:bg-cream/10 hover:text-white"
        >
          <LogOut size={19} />

          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
