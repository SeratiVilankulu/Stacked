// src/pages/public/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import AuthLogo from "../../components/AuthLogo";
import { useAuth } from "../../context/auth-context.js";
import stackedBooks from "@/assets/stackedBooks.jpg";

function Login() {
	const navigate = useNavigate();
	const { refreshUser } = useAuth();
	const [formData, setFormData] = useState({ email: "", password: "" });

	const [errorMsg, setErrorMsg] = useState({});
	const [successMsg, setSuccessMsg] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (event) => {
		// Handles form submission and validate input
		event.preventDefault();
		setErrorMsg({});
		setSuccessMsg("");

		//Check if username is empty
		let inputError = {};
		if (!formData.email) {
			inputError.email = "Email can not be empty";
		}
		//Check if password is empty
		if (!formData.password) {
			inputError.password = "Password can not be empty";
		}

		// If there are any errors, set the error messages and prevent form submission
		if (Object.keys(inputError).length > 0) {
			setErrorMsg(inputError);
			return;
		}

		//Form is being submmited
		setIsSubmitting(true);

		try {
			await axios.post("http://localhost:5001/api/auth/login", formData, {
				withCredentials: true,
			});
			// Pull the signed-in user from /auth/user so the nav swaps to the account
			await refreshUser();
			setSuccessMsg("Login Successful!");
			setTimeout(() => navigate("/"), 1500); //redirect to home page once successful
		} catch (error) {
			let apiError;

			if (!error.response) {
				apiError = "Can't reach the server. Please try again later.";
			} else {
				const { status, data } = error.response;
				const detail =
					typeof data === "string" ? data : data?.message || data?.error;

				if (detail) {
					apiError = detail;
				} else if (status === 401) {
					apiError = "Incorrect email or password.";
				} else if (status >= 500) {
					apiError = "The server had a problem. Try again in a moment.";
				} else {
					apiError = "Login failed. Please try again.";
				}
			}

			setErrorMsg({ api: apiError });
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<main className="grid grid-cols-2 min-h-screen">
			{/* Left panel */}
			<div
				style={{ backgroundImage: `url(${stackedBooks})` }}
				className="relative bg-cover bg-center"
			>
				<div className="absolute inset-0 bg-teal/85 flex flex-col gap-35 text-cream md:px-20 md:py-12">
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
				<h1 className="text-4xl">Login</h1>

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
								value={formData.email}
								onChange={handleChange}
								disabled={isSubmitting}
								placeholder="you@example.com"
								className="w-full min-w-0 bg-transparent text-sm text-ink outline-none! text-left! placeholder:text-muted"
							/>
						</div>
						{errorMsg.email && (
							<p className="text-red-800 text-xs">{errorMsg.email}</p>
						)}
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
								value={formData.password}
								onChange={handleChange}
								disabled={isSubmitting}
								autoComplete="on"
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
						disabled={isSubmitting}
						className="cursor-pointer rounded-pill bg-teal py-3 text-sm font-semibold text-cream shadow-card transition-colors duration-200 hover:bg-teal-deep active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
					>
						{isSubmitting ? "Logging in…" : "Login"}
					</button>
					{errorMsg.api && (
						<p role="alert" className="mt-2 text-xs text-alert text-center">
							{errorMsg.api}
						</p>
					)}
					{successMsg && (
						<p role="status" className="mt-2 text-xs text-success text-center">
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
					Don&apos;t have an account?{" "}
					<a
						onClick={() => navigate("/register")}
						className="cursor-pointer font-semibold text-orange hover:underline"
					>
						Sign Up
					</a>
				</p>
			</div>
		</main>
	);
}

export default Login;
