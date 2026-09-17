import React from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Navigations from "./Navigations";
import { User } from "lucide-react";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="grid grid-cols-3 items-center p-2 bg-cream border-b border-border">
      <Logo />
      <Navigations />

      <div className="flex justify-center">
        <button
          type="button"
          className="cursor-pointer inline-flex items-center gap-2 rounded-pill bg-teal px-6 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-200 hover:bg-teal-deep active:translate-y-px"
        >
          <User
            className="size-4"
            aria-hidden="true"
            onClick={() => navigate("/register")}
          />
          Sign In
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
