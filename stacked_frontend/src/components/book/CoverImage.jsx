import { BookOpen } from "lucide-react";

function CoverImage({ book, className = "", alt = `Cover of ${book.title}` }) {
	const base = `aspect-2/3 shrink-0 rounded-sm shadow-card ${className}`;

	if (book.coverImageUrl) {
		return (
			<img
				src={book.coverImageUrl}
				alt={alt}
				loading="lazy"
				className={`${base} object-cover`}
			/>
		);
	}

	return (
		<div
			role="img"
			aria-label={alt}
			className={`${base} flex flex-col items-center justify-center gap-2 overflow-hidden bg-surface/70 border border-dashed border-border-strong p-2 text-center text-teal @container`}
		>
			<BookOpen className="size-1/4 max-h-8 opacity-60" aria-hidden="true" />
			<span className="line-clamp-3 font-body text-[clamp(0.7rem,12cqw,1rem)] leading-tight">
				{book.title}
			</span>
		</div>
	);
}

export default CoverImage;
