import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import Navigations from "./Navigations";
import UserMenu from "./UserMenu";
import { User } from "lucide-react";
import { useAuth } from "../context/auth-context.js";

function NavBar() {
	const navigate = useNavigate();
	const { isAuthenticated, isLoading } = useAuth();

	return (
		<nav className="grid grid-cols-3 items-center p-2 bg-cream border-b border-border">
			<Logo />
			<Navigations />

			<div className="flex justify-center">
				{isLoading ? (
					<div className="h-11" aria-hidden="true" />
				) : isAuthenticated ? (
					<UserMenu />
				) : (
					<button
						type="button"
						className="cursor-pointer inline-flex items-center gap-2 rounded-pill bg-teal px-6 py-2 text-sm font-semibold text-white shadow-card transition-colors duration-200 hover:bg-teal-deep active:translate-y-px"
						onClick={() => navigate("/login")}
					>
						<User className="size-4" aria-hidden="true" />
						Sign In
					</button>
				)}
			</div>
		</nav>
	);
}

export default NavBar;
