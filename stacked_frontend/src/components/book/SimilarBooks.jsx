import { Link } from "react-router-dom";

function SimilarBooks({ books }) {
  if (books.length === 0) return null;

  return (
    <section className="border-t border-border pt-8">
      <h2 className="text-2xl">Similar Books</h2>
      <ul className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {books.map((b) => (
          <li key={b.title}>
            <Link to={`/books/${b.title}`} className="group block">
              <img
                src={b.coverImage}
                alt=""
                loading="lazy"
                className="aspect-2/3 w-full rounded-sm object-cover shadow-card transition-transform duration-200 group-hover:-translate-y-1"
              />
              <p className="mt-3 line-clamp-1 text-sm font-medium text-teal group-hover:underline">
                {b.title}
              </p>
              <p className="text-xs text-muted">{b.author}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SimilarBooks;
