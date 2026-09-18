import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, User, Pencil } from "lucide-react";
import AuthLogo from "../../components/AuthLogo";
import stackedBooks from "@/assets/stackedBooks.jpg";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUserInput = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Form Validations
  const validateForm = async (e) => {
    e.preventDefault();
    const errorMsg = {};

    // Email validations
    function validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email.toLowerCase());
    }

    // Password validations
    function validatePassword(password) {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    }

    if (!userData.name.trim()) {
      errorMsg.name = "Please enter your name.";
    }

    if (!userData.surname.trim()) {
      errorMsg.surname = "Please enter your surname.";
    }

    if (!userData.username.trim()) {
      errorMsg.username = "Please enter your username.";
    } else if (userData.username.length < 3) {
      errorMsg.username = "Username must be at least 3 characters long.";
    }

    if (!userData.email.trim()) {
      errorMsg.email = "Please enter your email.";
    } else if (!validateEmail(userData.email)) {
      errorMsg.email = "Please enter a valid email address.";
    }

    if (!userData.password.trim()) {
      errorMsg.password = "Please enter your password.";
    } else if (userData.password.length < 8) {
      errorMsg.password = "Password must be at least 8 characters long.";
    } else if (!validatePassword(userData.password)) {
      errorMsg.password =
        "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.";
    }

    // If there are validation errors, show them and return
    if (Object.keys(errorMsg).length > 0) {
      setErrorMsg(errorMsg);
      return;
    }

    setIsSubmitting(true);

    // Submit user data to the backend
    try {
      await axios.post("http://localhost:5001/api/auth/register", userData);
      setSuccessMsg("Registration successful!");
      setErrorMsg({});
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      // Handle API error response
      const apiError =
        error.response?.data || "Registration failed. Please try again.";
      setErrorMsg({ api: apiError });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid grid-cols-2 min-h-screen ">
      {/* Left panel */}
      <div
        style={{ backgroundImage: `url(${stackedBooks})` }}
        className="relative bg-cover bg-no-repeat bg-center"
      >
        <div className="absolute inset-0 bg-teal/85 flex flex-col gap-35 text-cream md:px-20 md:py-12">
          <AuthLogo />
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl/12! text-cream md:text-3xl ">
              Welcome to Stacked <br />
              Community Library
            </h1>
            <p className="text-md leading-6 text-cream/70">
              Log in to continue your reading journey.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center gap-6 bg-surface px-8 py-10 md:px-10 md:py-12">
        <h1 className="text-4xl">Register</h1>

        <form
          onSubmit={validateForm}
          className="flex flex-col gap-5 max-w-125 w-full"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-medium text-teal">
                Name
              </label>
              <div className="flex items-center gap-2 rounded-(--radius-md) border border-border-strong px-3 py-2.5 transition-colors duration-200 focus:outline-none!">
                <Pencil
                  className="size-4 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <input
                  id="name"
                  name="name"
                  type="name"
                  value={userData.name}
                  onChange={handleUserInput}
                  disabled={isSubmitting}
                  placeholder="Jane"
                  className="w-full min-w-0 bg-transparent text-sm text-ink outline-none! text-left! placeholder:text-muted"
                />
              </div>
              {errorMsg.name && (
                <p className="text-red-800 text-xs">{errorMsg.name}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="surname"
                className="text-sm font-medium text-teal"
              >
                Surname
              </label>
              <div className="flex items-center gap-2 rounded-(--radius-md) border border-border-strong px-3 py-2.5 transition-colors duration-200 focus:outline-none!">
                <Pencil
                  className="size-4 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <input
                  id="surname"
                  name="surname"
                  type="surname"
                  value={userData.surname}
                  onChange={handleUserInput}
                  disabled={isSubmitting}
                  placeholder="Doe"
                  className="w-full min-w-0 bg-transparent text-sm text-ink outline-none! text-left! placeholder:text-muted"
                />
              </div>
              {errorMsg.surname && (
                <p className="text-red-800 text-xs">{errorMsg.surname}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-teal">
                Email Address
              </label>
              <div className="flex items-center gap-2 rounded-(--radius-md) border border-border-strong px-3 py-2.5 transition-colors duration-200 focus:outline-none">
                <Mail
                  className="size-4 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleUserInput}
                  disabled={isSubmitting}
                  placeholder="jane@example.com"
                  className="w-full min-w-0 bg-transparent text-sm text-ink outline-none! text-left! placeholder:text-muted"
                />
              </div>
              {errorMsg.email && (
                <p className="text-red-800 text-xs">{errorMsg.email}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username"
                className="text-sm font-medium text-teal"
              >
                Username
              </label>
              <div className="flex items-center gap-2 rounded-(--radius-md) border border-border-strong px-3 py-2.5 transition-colors duration-200 focus:outline-none!">
                <User
                  className="size-4 shrink-0 text-teal"
                  aria-hidden="true"
                />
                <input
                  id="username"
                  name="username"
                  type="username"
                  value={userData.username}
                  onChange={handleUserInput}
                  disabled={isSubmitting}
                  placeholder="user1234"
                  className="w-full min-w-0 bg-transparent text-sm text-ink outline-none! text-left! placeholder:text-muted"
                />
              </div>
              {errorMsg.username && (
                <p className="text-red-800 text-xs">{errorMsg.username}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-teal"
              >
                Password
              </label>
            </div>
            <div className="flex items-center gap-2 rounded-(--radius-md) border border-border-strong px-3 py-2.5 transition-colors duration-200 outline-none!">
              <Lock className="size-4 shrink-0 text-teal" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleUserInput}
                disabled={isSubmitting}
                placeholder="Enter your password"
                className="w-full min-w-0 bg-transparent text-sm text-ink outline-none! text-left! placeholder:text-muted"
              />
            </div>
            {errorMsg.password && (
              <p className="text-red-800 text-xs">{errorMsg.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="cursor-pointer rounded-pill bg-teal py-3 text-sm font-semibold text-cream shadow-card transition-colors duration-200 hover:bg-teal-deep active:translate-y-px"
          >
            Sign In
          </button>

          {errorMsg.api && (
            <p className="text-red-600 text-size-xs mt-2 text-center">
              {errorMsg.api}
            </p>
          )}
          {successMsg && (
            <p className="text-green-600 text-size-xs mt-2 text-center">
              {successMsg}
            </p>
          )}

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </form>

        <p className="text-center text-sm text-muted">
          Have an account already?{" "}
          <a
            className="cursor-pointer font-semibold text-orange hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </a>
        </p>
      </div>
    </main>
  );
}

export default Register;
