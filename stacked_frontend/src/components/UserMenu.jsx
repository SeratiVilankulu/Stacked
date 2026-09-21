import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "../context/auth-context.js";

function UserMenu() {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef(null);

	// Close on an outside click or Escape, the way a menu is expected to behave.
	useEffect(() => {
		if (!isOpen) return;

		const onPointerDown = (event) => {
			if (!containerRef.current?.contains(event.target)) setIsOpen(false);
		};
		const onKeyDown = (event) => {
			if (event.key === "Escape") setIsOpen(false);
		};

		document.addEventListener("mousedown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("mousedown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpen]);

	if (!user) return null;

	const fullName = [user.name, user.surname].filter(Boolean).join(" ");
	// Initials stand in for a profile photo. Fall back to the username, then
	// the email, so this never renders an empty circle.
	const initials =
		[user.name, user.surname]
			.filter(Boolean)
			.map((part) => part[0])
			.join("")
			.toUpperCase() ||
		(user.username || user.email || "?").slice(0, 2).toUpperCase();

	const handleLogout = async () => {
		setIsOpen(false);
		await logout();
		navigate("/");
	};

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen((open) => !open)}
				aria-expanded={isOpen}
				aria-haspopup="menu"
				className="flex cursor-pointer items-center gap-2 rounded-pill py-1 pr-1 pl-2.5 transition-colors duration-200 hover:bg-sand/40"
			>
				<span className="text-sm font-semibold text-teal">{fullName}</span>
				<ChevronDown
					aria-hidden="true"
					className={`size-4 text-teal transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
				<span
					aria-hidden="true"
					className="grid size-9 shrink-0 place-items-center rounded-full bg-sky text-sm font-semibold text-teal"
				>
					{initials}
				</span>
			</button>

			{isOpen && (
				<div
					role="menu"
					className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface shadow-lift"
				>
					<div className="border-b border-border px-4 py-3">
						<p className="truncate text-sm font-semibold text-ink">
							{fullName}
						</p>
						<p className="truncate text-xs text-muted">{user.email}</p>
					</div>
					<button
						type="button"
						role="menuitem"
						onClick={handleLogout}
						className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm text-ink transition-colors duration-200 hover:bg-sand"
					>
						<LogOut className="size-4" aria-hidden="true" />
						Log out
					</button>
				</div>
			)}
		</div>
	);
}

export default UserMenu;
