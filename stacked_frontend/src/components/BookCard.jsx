import react from "react";

function BookCard({ book }) {
	return (
		<article className="group">
			<div className="relative overflow-hidden rounded-2xl bg-[#C1DBE8]">
				<img
					src={book.cover}
					alt={book.title}
					className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
				/>

				<button className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFDF4]/90 text-[#003844] shadow-sm backdrop-blur transition hover:bg-[#F18805] hover:text-white">
					<Bookmark size={17} />
				</button>
			</div>

			<div className="mt-3">
				<p className="text-[11px] font-semibold uppercase tracking-wide text-[#F18805]">
					{book.genre}
				</p>

				<h3 className="mt-1 line-clamp-1 font-semibold text-[#003844]">
					{book.title}
				</h3>

				<p className="mt-1 text-xs text-[#43302E]/60">{book.author}</p>

				<div className="mt-2 flex items-center gap-1 text-xs">
					<Star size={13} fill="currentColor" className="text-[#F18805]" />

					<span className="font-medium">{book.rating}</span>
				</div>
			</div>
		</article>
	);
}

export default BookCard;
