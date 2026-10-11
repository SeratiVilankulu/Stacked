import { useState } from "react";
import UserLayout from "../../components/UserLayout.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import BrowseToolbar from "../../components/browse/BrowseToolbar.jsx";
import BrowseBookCard from "../../components/browse/BrowseBookCard.jsx";
import CategoryPanel from "../../components/browse/CategoryPanel.jsx";
import {
	PAGE_SIZE,
	STATUS_OPTIONS,
	fetchBooks,
	fetchBookStats,
	genreNames,
} from "../../lib/books.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";

// Sorting happens on the server; these keys are what it understands.
const SORT_OPTIONS = [
	["title-asc", "Title (A – Z)"],
	["title-desc", "Title (Z – A)"],
];

const AVAILABILITY_OPTIONS = [
	["ALL", "All Books"],
	...STATUS_OPTIONS.map((s) => [s, s]),
];

function BrowseBooks() {
	const [sort, setSort] = useState("title-asc");
	const [genre, setGenre] = useState("ALL");
	const [statuses, setStatuses] = useState([]); // Empty means every status
	const [page, setPage] = useState(1);

	const { data: stats } = useRequest(fetchBookStats, "stats");

	// Ticking both statuses is the same as ticking neither.
	const params = {
		genre: genre === "ALL" ? "" : genre,
		status: statuses.length === 1 ? statuses[0].toLowerCase() : "",
		sort,
		page,
		limit: PAGE_SIZE,
	};
	const request = useRequest(() => fetchBooks(params), JSON.stringify(params));
	const books = request.data?.books ?? [];
	const total = request.data?.pagination.total ?? 0;
	const { isLoading } = request;
	const error = request.error && apiErrorMessage(request.error);

	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
	const genreOptions = [
		["ALL", "All Genres"],
		...genreNames(stats).map((g) => [g, g]),
	];

	// Any filter change starts back on page 1.
	const filterReset = (setter) => (value) => {
		setter(value);
		setPage(1);
	};

	const setAvailability = filterReset((value) =>
		setStatuses(value === "ALL" ? [] : [value]),
	);

	const toggleStatus = filterReset((s) =>
		setStatuses((prev) =>
			prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
		),
	);

	const clearFilters = () => {
		setGenre("ALL");
		setStatuses([]);
		setPage(1);
	};

	let content;
	if (error) {
		content = <EmptyState>{error}</EmptyState>;
	} else if (isLoading && books.length === 0) {
		content = <EmptyState>Loading books...</EmptyState>;
	} else if (books.length === 0) {
		content = <EmptyState>No books match your filters.</EmptyState>;
	} else {
		content = (
			<div
				aria-busy={isLoading}
				className={`grid gap-5 transition-opacity md:grid-cols-2 2xl:grid-cols-3 ${isLoading ? "opacity-60" : ""}`}
			>
				{books.map((book) => (
					<BrowseBookCard key={book.id} book={book} />
				))}
			</div>
		);
	}

	return (
		<UserLayout>
			<div className="grid gap-8 px-5 py-8 sm:px-8 lg:px-10 xl:grid-cols-[minmax(0,1fr)_18rem]">
				<div className="min-w-0 space-y-6">
					<PageHeading
						eyebrow="Explore our collection"
						title="Browse All Books"
						description="Discover new authors, explore different genres and find your next great read."
					/>

					<BrowseToolbar
						sort={sort}
						sortOptions={SORT_OPTIONS}
						onSortChange={filterReset(setSort)}
						genre={genre}
						genreOptions={genreOptions}
						onGenreChange={filterReset(setGenre)}
						availability={statuses.length === 1 ? statuses[0] : "ALL"}
						availabilityOptions={AVAILABILITY_OPTIONS}
						onAvailabilityChange={setAvailability}
						onClear={clearFilters}
						canClear={genre !== "ALL" || statuses.length > 0}
					/>

					<Pagination
						currentPage={page}
						pageCount={pageCount}
						pageSize={PAGE_SIZE}
						total={total}
						noun="books"
						onPageChange={setPage}
						className=""
					/>

					{content}
				</div>

				{/* Right column: the toolbar covers these filters */}
				<div className="hidden space-y-6 xl:block">
					<CategoryPanel
						stats={stats}
						genre={genre}
						onGenreChange={filterReset(setGenre)}
						statuses={statuses}
						statusOptions={STATUS_OPTIONS}
						onToggleStatus={toggleStatus}
					/>
					<QuoteCard quote="Great books are always in season." />
				</div>
			</div>
		</UserLayout>
	);
}

function EmptyState({ children }) {
	return (
		<p className="rounded-lg border border-dashed border-border-strong py-16 text-center text-muted">
			{children}
		</p>
	);
}

export default BrowseBooks;
