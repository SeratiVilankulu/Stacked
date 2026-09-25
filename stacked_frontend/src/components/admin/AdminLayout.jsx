import React from "react";
import { useState } from "react";
import AdminSideBar from "./AdminSideBar.jsx";
import UserMenu from "../UserMenu.jsx";
import { Bell, Menu, X } from "lucide-react";

// Shared frame for every admin page: sidebar (drawer on mobile) and top bar.
function AdminLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-teal/40 lg:hidden">
          <div className="absolute top-0 left-0 flex h-full w-72 flex-col overflow-y-auto bg-mocha p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 cursor-pointer rounded-full p-2 text-cream hover:bg-cream/10"
            >
              <X size={20} />
            </button>
            <AdminSideBar />
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 flex h-screen w-68 shrink-0 flex-col bg-mocha px-4 py-7">
          <AdminSideBar />
        </aside>

        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <header className="flex items-center gap-4 border-b border-border px-5 py-4 sm:px-8 lg:px-10">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="cursor-pointer rounded-xl p-2 text-teal hover:bg-sky lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div className="ml-auto flex items-center gap-4">
              <button
                type="button"
                aria-label="Notifications"
                className="relative cursor-pointer rounded-full p-2 text-teal hover:bg-sky/60"
              >
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 size-2.5 rounded-full bg-orange ring-2 ring-cream" />
              </button>
              <div className="h-8 w-px bg-border" />
              <UserMenu />
            </div>
          </header>

          {children}
        </main>
      </div>
    </>
  );
}

export default AdminLayout;
