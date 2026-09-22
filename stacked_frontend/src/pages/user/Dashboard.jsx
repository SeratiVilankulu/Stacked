import React, { useState } from "react";
import SideBar from "../../components/SideBar.jsx";
import AuthLogo from "../../components/AuthLogo.jsx";
import BookCarousel from "../../components/BookCarousel.jsx";
import { Menu, X } from "lucide-react";
import NavBar from "../../components/NavBar.jsx";

function Dashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu display */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-teal/40 lg:hidden">
          <div className="absolute left-0 top-0 h-full w-72 bg-cream p-6 shadow-xl">
            <div className="mb-10 flex items-center justify-between">
              <AuthLogo />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-full p-2 hover:text-sky"
              >
                <X size={20} />
              </button>
            </div>

            <SideBar />
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 flex-col border-r border-mocha/10 bg-cream lg:flex">
          <SideBar />
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {/* Top navigation */}
          <header>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl p-2 hover:bg-sky lg:hidden"
            >
              <Menu size={22} />
            </button>

            <NavBar />
          </header>

          {/* Dashboard content */}
          <div className="px-5 pb-12 sm:px-8 lg:px-10">
            <section>
              <BookCarousel />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
