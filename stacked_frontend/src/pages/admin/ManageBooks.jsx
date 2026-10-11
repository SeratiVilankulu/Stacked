import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import FilterSelect from "../../components/FilterSelect.jsx";
import Checkbox from "../../components/Checkbox.jsx";
import Pill from "../../components/Pill.jsx";
import IconButton from "../../components/IconButton.jsx";
import PageHeading from "../../components/admin/PageHeading.jsx";
import FilterBar from "../../components/admin/FilterBar.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import BookFormModal from "../../components/admin/BookFormModal.jsx";
import CoverImage from "../../components/book/CoverImage.jsx";
import BookActivity from "./BookActivity.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import {
	PAGE_SIZE,
	STATUS_STYLES,
	bookStatus,
	deleteBook,
	fetchBooks,
	fetchBookStats,
	genreNames,
	genreStyle,
} from "../../lib/books.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";
import { Pencil, Trash2 } from "lucide-react";

const SEARCH_DELAY_MS = 300;

function ManageBooks() {
	const [query, setQuery] = useState("");
	const [search, setSearch] = useState(""); // `query` once typing pauses
	const [genre, setGenre] = useState("ALL");
	const [status, setStatus] = useState("ALL");
	const [page, setPage] = useState(1);
	const [selected, setSelected] = useState(() => new Set());
	const [editing, setEditing] = useState(null); // null, "new" or the book being edited
	const [reloadKey, setReloadKey] = useState(0); // Bumped to refetch after a change

	// Wait for typing to pause so every keystroke isn't a request
	useEffect(() => {
		const timer = setTimeout(() => setSearch(query.trim()), SEARCH_DELAY_MS);
		return () => clearTimeout(timer);
	}, [query]);

	const { data: stats } = useRequest(fetchBookStats, `stats-${reloadKey}`);

	const params = {
		search,
		genre: genre === "ALL" ? "" : genre,
		status: status === "ALL" ? "" : status.toLowerCase(),
		page,
		limit: PAGE_SIZE,
	};
	const request = useRequest(
		() => fetchBooks(params),
		`${JSON.stringify(params)}-${reloadKey}`,
	);
	const books = request.data?.books ?? [];
	const total = request.data?.pagination.total ?? 0;
	const { isLoading } = request;
	const error = request.error && apiErrorMessage(request.error);

	const reload = () => setReloadKey((k) => k + 1);
	const closeForm = useCallback(() => setEditing(null), []);

	const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

	const allOnPageSelected =
		books.length > 0 && books.every((b) => selected.has(b.id));

	// Any filter change starts back on page 1.
	const filterReset = (setter) => (value) => {
		setter(value);
		setPage(1);
	};

	const toggleOne = (id) =>
		setSelected((prev) => {
			const next = new Set(prev);
			next.has(id) ? next.delete(id) : next.add(id);
			return next;
		});

	const toggleAllOnPage = () =>
		setSelected((prev) => {
			const next = new Set(prev);
			books.forEach((b) =>
				allOnPageSelected ? next.delete(b.id) : next.add(b.id),
			);
			return next;
		});

	const handleSaved = (saved) => {
		toast.success(
			editing === "new"
				? `"${saved.title}" was added`
				: `"${saved.title}" was updated`,
		);
		setEditing(null);
		reload();
	};

	const handleDelete = async (book) => {
		if (!window.confirm(`Delete "${book.title}"? This cannot be undone.`))
			return;

		try {
			await deleteBook(book.id);
			toast.success(`"${book.title}" was deleted`);
			// Removing the only book on a page steps back to the previous one
			if (books.length === 1 && page > 1) setPage(page - 1);
			setSelected((prev) => {
				const next = new Set(prev);
				next.delete(book.id);
				return next;
			});
			reload();
		} catch (err) {
			toast.error(apiErrorMessage(err, "Could not delete the book"));
		}
	};

	return (
		<AdminLayout>
			<div className="grid gap-8 px-6 py-8 sm:px-4 lg:px-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
				<div className="min-w-0 space-y-6">
					<PageHeading
						title="Manage Books"
						description="View, add, edit and manage library books."
					/>

					<FilterBar
						searchLabel="Search Books"
						query={query}
						onQueryChange={filterReset(setQuery)}
						placeholder="Search by title, author or isbn..."
						actionLabel="Add Book"
						onAction={() => setEditing("new")}
					>
						<FilterSelect
							label="Genre"
							value={genre}
							onChange={filterReset(setGenre)}
							options={[
								["ALL", "All Genres"],
								...genreNames(stats).map((g) => [g, g]),
							]}
						/>
						<FilterSelect
							label="Status"
							value={status}
							onChange={filterReset(setStatus)}
							options={[
								["ALL", "All Statuses"],
								["Available", "Available"],
								["Unavailable", "Unavailable"],
							]}
						/>
					</FilterBar>

					{/* Books table */}
					<section className="overflow-hidden rounded-lg border border-sky bg-surface shadow-card">
						<div className="overflow-x-auto">
							<table className="w-full min-w-[48rem] text-left text-[13px]">
								<thead className="bg-sky/40 text-teal">
									<tr>
										<th className="w-12 py-4 pl-5">
											<Checkbox
												checked={allOnPageSelected}
												onChange={toggleAllOnPage}
												label="Select all books on this page"
											/>
										</th>
										<th className="px-2.5 py-4 font-semibold">Cover</th>
										<th className="px-2.5 py-4 font-semibold">Title</th>
										<th className="px-2.5 py-4 font-semibold">Author</th>
										<th className="px-2.5 py-4 font-semibold">Genre</th>
										<th className="px-2.5 py-4 font-semibold">Status</th>
										<th className="px-2.5 py-4 font-semibold">Total</th>
										<th className="px-2.5 py-4 pr-5 font-semibold">Actions</th>
									</tr>
								</thead>
								<tbody
									aria-busy={isLoading}
									className={`divide-y divide-border transition-opacity ${isLoading ? "opacity-60" : ""}`}
								>
									{!error &&
										books.map((b) => (
											<tr
												key={b.id}
												className="transition-colors hover:bg-sky/10"
											>
												<td className="py-3 pl-5">
													<Checkbox
														checked={selected.has(b.id)}
														onChange={() => toggleOne(b.id)}
														label={`Select ${b.title}`}
													/>
												</td>
												<td className="px-2.5 py-3">
													<CoverImage
														book={b}
														className="w-10 sm:w-12 lg:w-14"
													/>
												</td>
												<td className="px-2.5 py-3">
													<span className="font-medium whitespace-nowrap text-teal">
														{b.title}
													</span>
												</td>
												<td className="px-2.5 py-3 text-teal">{b.author}</td>
												<td className="px-2.5 py-3">
													<Pill className={genreStyle(b.genre)}>{b.genre}</Pill>
												</td>
												<td className="px-2.5 py-3">
													<Pill className={STATUS_STYLES[bookStatus(b)]}>
														{bookStatus(b)}
													</Pill>
												</td>
												<td className="px-2.5 py-3 whitespace-nowrap text-muted">
													{b.copiesAvailable}
												</td>
												<td className="px-2.5 py-3 pr-5">
													<div className="flex gap-2">
														<IconButton
															label={`Edit ${b.title}`}
															onClick={() => setEditing(b)}
														>
															<Pencil size={16} />
														</IconButton>
														<IconButton
															label={`Delete ${b.title}`}
															onClick={() => handleDelete(b)}
															danger
														>
															<Trash2 size={16} />
														</IconButton>
													</div>
												</td>
											</tr>
										))}

									{(error || books.length === 0) && (
										<tr>
											<td colSpan={8} className="py-12 text-center text-muted">
												{error ||
													(isLoading
														? "Loading books..."
														: "No books match your filters.")}
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>

						<Pagination
							currentPage={page}
							pageCount={pageCount}
							pageSize={PAGE_SIZE}
							total={total}
							noun="books"
							onPageChange={setPage}
						/>
					</section>
				</div>

				{/* Right column */}
				<div className="space-y-6">
					<BookActivity stats={stats} />
					<QuoteCard
						quote={"A book is a dream you hold in your hands."}
						from={"Neil Gaiman"}
					/>
				</div>
			</div>

			{editing && (
				<BookFormModal
					book={editing === "new" ? null : editing}
					genres={genreNames(stats)}
					onClose={closeForm}
					onSaved={handleSaved}
				/>
			)}
		</AdminLayout>
	);
}

export default ManageBooks;
