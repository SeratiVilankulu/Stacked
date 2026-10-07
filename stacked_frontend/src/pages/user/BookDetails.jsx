import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserLayout from "../../components/UserLayout.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import BookCover from "../../components/book/BookCover.jsx";
import BookSummary from "../../components/book/BookSummary.jsx";
import BookInfoCard from "../../components/book/BookInfoCard.jsx";
import SimilarBooks from "../../components/book/SimilarBooks.jsx";
import { SAMPLE_BOOKS } from "../admin/bookData.js";

const SIMILAR_LIMIT = 4;

function BackLink() {
  return (
    <Link
      to="/books"
      className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:underline"
    >
      <ArrowLeft size={18} aria-hidden="true" />
      Back to Browse Books
    </Link>
  );
}

function BookDetails() {
  const { title } = useParams();
  const book = SAMPLE_BOOKS.find((b) => b.title === title);

  // Opening a similar book should start at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [title]);

  if (!book) {
    return (
      <UserLayout>
        <div className="px-5 py-16 text-center sm:px-8 lg:px-10">
          <h1 className="text-3xl">Book not found</h1>
          <p className="mt-3 text-muted">
            We couldn't find a book with Title {title}.
          </p>
          <div className="mt-6">
            <BackLink />
          </div>
        </div>
      </UserLayout>
    );
  }

  const similarBooks = SAMPLE_BOOKS.filter(
    (b) => b.genre === book.genre && b.title !== book.title,
  ).slice(0, SIMILAR_LIMIT);

  return (
    <UserLayout>
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <BackLink />

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0 space-y-10">
            <div className="grid gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
              <BookCover book={book} />
              <BookSummary book={book} />
            </div>

            <SimilarBooks books={similarBooks} />
          </div>

          <div className="space-y-6">
            <BookInfoCard book={book} />
            <QuoteCard
              quote="A reader lives a thousand lives before he dies."
              from="George R.R. Martin"
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default BookDetails;
