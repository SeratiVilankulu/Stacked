import { useState } from "react";
import SideBar from "./SideBar.jsx";
import NavBar from "./NavBar.jsx";
import { Menu, X } from "lucide-react";

// Shared layout for every member page: sidebar and top bar.
function UserLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-teal/40 lg:hidden">
          <div className="absolute top-0 left-0 h-full w-72 overflow-y-auto shadow-xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 text-cream hover:bg-cream/10"
            >
              <X size={20} />
            </button>
            <SideBar />
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto lg:block">
          <SideBar />
        </aside>

        <main className="min-w-0 flex-1">
          {/* Top navigation */}
          <header className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
              className="ml-2 cursor-pointer rounded-xl p-2 text-teal hover:bg-sky lg:hidden"
            >
              <Menu size={22} />
            </button>
            <div className="min-w-0 flex-1">
              <NavBar />
            </div>
          </header>

          {children}
        </main>
      </div>
    </>
  );
}

export default UserLayout;
