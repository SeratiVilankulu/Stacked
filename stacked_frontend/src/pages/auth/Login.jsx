// src/pages/public/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLogo from "../../components/AuthLogo";
import stackedBooks from "@/assets/stackedBooks.jpg";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire this up to your auth endpoint, e.g.
    // fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
    console.log("sign in with", formData);
  };

  return (
    <main className="grid grid-cols-2 min-h-screen">
      {/* Left panel */}
      <div
        style={{ backgroundImage: `url(${stackedBooks})` }}
        className="relative bg-cover bg-center"
      >
        <div class="absolute inset-0 bg-teal/85 flex flex-col gap-35 text-cream md:px-20 md:py-12">
          <AuthLogo />
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl/12! text-cream md:text-3xl">
              Good to see you again!
            </h1>
            <p className="text-md leading-6 text-cream/70">
              Log in to continue your reading journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col justify-center items-center gap-6 bg-surface px-8 py-10 md:px-10 md:py-12">
        <h1 className="text-4xl">Sign In</h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 max-w-125 w-full"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email Address
            </label>
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong px-3 py-2.5 transition-colors duration-200 focus-within:border-teal">
              <Mail className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-ink"
              >
                Password
              </label>
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border-strong px-3 py-2.5 transition-colors duration-200 focus-within:border-teal">
              <Lock className="size-4 shrink-0 text-muted" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                autoComplete="on"
                placeholder="Enter your password"
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <button
            type="submit"
            className="cursor-pointer rounded-pill bg-teal py-3 text-sm font-semibold text-cream shadow-card transition-colors duration-200 hover:bg-teal-deep active:translate-y-px"
          >
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <a
            onClick={() => navigate("/register")}
            className="font-semibold text-orange hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </main>
  );
}

export default Login;
