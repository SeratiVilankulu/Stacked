import React from "react";
import AuthLogo from "../../components/AuthLogo.jsx";
import UserMenu from "../../components/UserMenu.jsx";
import { useAuth } from "../../context/auth-context.js";
import { BookOpen, Users, ReceiptText } from "lucide-react";

function AdminDashboard() {
	const { user } = useAuth();

	return (
		<div className="flex min-h-screen">
			<aside className="hidden w-64 flex-col bg-[#43302E] px-5 py-7 text-white lg:flex">
				<AuthLogo />

				<p className="mt-10 px-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/40">
					Admin
				</p>
			</aside>

			<main className="min-w-0 flex-1">
				<header className="flex items-center justify-between p-2 border-b border-border bg-cream">
					<span className="px-3 font-display text-lg text-teal">
						Stacked Admin
					</span>
					<UserMenu />
				</header>

				<div className="px-5 py-10 sm:px-8 lg:px-10">
					<h1 className="font-display text-3xl text-teal">
						Welcome back, {user?.name}
					</h1>
					<p className="mt-1 text-sm text-mocha/60">
						Manage the catalog, loans, and fines from here.
					</p>

					<section className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
						<StatCard icon={<BookOpen size={20} />} label="Books managed" />
						<StatCard icon={<Users size={20} />} label="Active loans" />
						<StatCard icon={<ReceiptText size={20} />} label="Outstanding fines" />
					</section>
				</div>
			</main>
		</div>
	);
}

function StatCard({ icon, label }) {
	return (
		<div className="rounded-2xl bg-white p-5">
			<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky text-teal">
				{icon}
			</div>
			<p className="font-display text-3xl text-teal">-</p>
			<p className="mt-1 text-xs text-mocha/60">{label}</p>
		</div>
	);
}

export default AdminDashboard;
