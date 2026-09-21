import React, { useState } from "react";
import BookCard from "../../components/BookCard.jsx";
import SideBar from "../../components/SideBar.jsx";
import AuthLogo from "../../components/AuthLogo.jsx";
import UserMenu from "../../components/UserMenu.jsx";
import { useAuth } from "../../context/auth-context.js";
import { Search, Bell, Menu, X } from "lucide-react";
import NavBar from "../../components/NavBar.jsx";

function Dashboard() {
	const { isAuthenticated, isLoading } = useAuth();
	const displayDay = new Date();

	const [searchTerm, setSearchTerm] = useState("");
	const [activeCategory, setActiveCategory] = useState("All");
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// const filteredBooks = books.filter((book) => {
	// 	const matchesSearch =
	// 		book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 		book.author.toLowerCase().includes(searchTerm.toLowerCase());

	// 	const matchesCategory =
	// 		activeCategory === "All" || book.genre === activeCategory;

	// 	return matchesSearch && matchesCategory;
	// });

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
						<section></section>

						{/* Categories */}
						<section className="mt-10">
							<div className="mb-5 flex items-center justify-between">
								<div>
									<p className="text-xs font-semibold uppercase tracking-widest text-orange">
										Explore
									</p>

									<h2 className="font-display text-3xl text-teal">
										Browse by category
									</h2>
								</div>
							</div>
						</section>
					</div>
				</main>
			</div>
		</>
	);
}

/* Statistics */

function StatCard({ icon, value, label }) {
	return (
		<div className="rounded-2xl bg-white p-5">
			<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-teal">
				{icon}
			</div>

			<p className="font-display text-3xl text-teal">{value}</p>

			<p className="mt-1 text-xs text-mocha/60">{label}</p>
		</div>
	);
}

export default Dashboard;
