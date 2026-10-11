import { Library, BookCheck, Ban } from "lucide-react";

function BookActivity({ stats }) {
	const activity = [
		{ icon: Library, value: stats?.total ?? "–", label: "Total books" },
		{
			icon: BookCheck,
			value: stats?.available ?? "–",
			label: "Available books",
		},
		{
			icon: Ban,
			value: stats?.unavailable ?? "–",
			label: "Unavailable books",
			accent: true,
		},
	];

	return (
		<aside className="rounded-lg border border-sky bg-surface/60 p-5 shadow-card">
			<div className="flex items-center">
				<h3 className="text-xl">Book Activity</h3>
			</div>
			<div className="mt-4 flex flex-col gap-3">
				{activity.map(({ icon: Icon, value, label, accent }) => (
					<div key={label} className="rounded-md bg-sky/40 p-4">
						<div className="flex items-end gap-2">
							<Icon
								size={26}
								className={accent ? "text-orange" : "text-teal"}
							/>
							<span className="font-heading text-3xl leading-none text-teal">
								{value}
							</span>
						</div>
						<p className="mt-3 text-xs text-muted">{label}</p>
					</div>
				))}
			</div>
		</aside>
	);
}

export default BookActivity;
