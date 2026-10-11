import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import UserLayout from "../../components/UserLayout.jsx";
import QuoteCard from "../../components/QuoteCard.jsx";
import BookCover from "../../components/book/BookCover.jsx";
import BookSummary from "../../components/book/BookSummary.jsx";
import BookInfoCard from "../../components/book/BookInfoCard.jsx";
import { fetchBook } from "../../lib/books.js";
import { apiErrorMessage } from "../../lib/api.js";
import useRequest from "../../hooks/useRequest.js";

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

// Message used while loading and when the book can't be shown.
function Message({ title, children }) {
  return (
    <UserLayout>
      <div className="px-5 py-16 text-center sm:px-8 lg:px-10">
        <h1 className="text-3xl">{title}</h1>
        {children && <p className="mt-3 text-muted">{children}</p>}
        <div className="mt-6">
          <BackLink />
        </div>
      </div>
    </UserLayout>
  );
}

function BookDetails() {
  const { id } = useParams();

  const {
    data: book,
    isLoading,
    error,
  } = useRequest(() => fetchBook(id), id);

  // Opening a book should start at the top of the page.
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (isLoading) return <Message title="Loading book..." />;

  if (error?.response?.status === 404) {
    return (
      <Message title="Book not found">
        We couldn't find this book. It may have been removed from the catalogue.
      </Message>
    );
  }

  if (error) {
    return (
      <Message title="Something went wrong">{apiErrorMessage(error)}</Message>
    );
  }

  return (
    <UserLayout>
      <div className="px-5 py-8 sm:px-8 lg:px-10">
        <BackLink />

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="grid min-w-0 gap-8 md:grid-cols-[18rem_minmax(0,1fr)]">
            <BookCover book={book} />
            <BookSummary book={book} />
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
