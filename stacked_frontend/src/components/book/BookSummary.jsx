import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CalendarClock,
  ListPlus,
  Tag,
} from "lucide-react";
import Pill from "../Pill.jsx";
import { toast } from "sonner";
import { bookStatus, genreStyle } from "../../lib/books.js";
import { saveBook } from "../../lib/library.js";
import { apiErrorMessage } from "../../lib/api.js";
import ReserveModal from "../reservations/ReserveModal.jsx";
import { formatDate } from "../../pages/user/loanData.js";

const STATUS_COLOURS = {
  Available: "text-success",
  Unavailable: "text-orange-ink",
};

function BookSummary({ book }) {
  const status = bookStatus(book);
  const available = status === "Available";
  const navigate = useNavigate();
  const [reserving, setReserving] = useState(false);
  const closeReserve = useCallback(() => setReserving(false), []);

  const handleReserved = (reservation) => {
    setReserving(false);
    toast.success(
      `${book.title} reserved from ${formatDate(reservation.startDate)}`,
      {
        action: {
          label: "View",
          onClick: () => navigate("/loans?tab=reservations"),
        },
      },
    );
  };

  const save = async () => {
    try {
      await saveBook(book.id);
      toast.success(`${book.title} saved to your library`);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Could not save this book."));
    }
  };


  const facts = [
    book.pages && [BookOpen, "Pages", book.pages],
    book.published && [Calendar, "Published", book.published],
    [Tag, "Genre", book.genre],
  ].filter(Boolean);

  return (
    <div className="min-w-0">
      <Pill className={genreStyle(book.genre)}>{book.genre}</Pill>

      <h1 className="mt-4 text-4xl xl:text-5xl">{book.title}</h1>
      <p className="mt-2 font-heading text-xl text-teal">{book.author}</p>

      <p
        className={`mt-5 flex items-center gap-2 text-sm font-medium ${
          STATUS_COLOURS[status]
        }`}
      >
        <BookOpen size={18} aria-hidden="true" />
        {status}
      </p>

      {book.description && (
        <p className="mt-5 max-w-prose leading-relaxed text-ink">
          {book.description}
        </p>
      )}

      <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
        {facts.map(([Icon, label, value]) => (
          <div key={label} className="flex items-start gap-3">
            <Icon size={18} className="mt-0.5 text-teal" aria-hidden="true" />
            <div>
              <dt className="text-sm text-muted">{label}</dt>
              <dd className="text-sm font-medium text-teal">{value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={!available}
          className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <BookOpen size={18} aria-hidden="true" />
          {available ? "Borrow Book" : "Currently Unavailable"}
          {available && <ArrowRight size={18} aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => setReserving(true)}
          className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border-strong px-6 py-3 text-sm font-semibold text-teal transition-colors duration-200 hover:bg-sky/30"
        >
          <CalendarClock size={18} aria-hidden="true" />
          Reserve for Later
        </button>
        <button
          type="button"
          onClick={save}
          className="flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-border-strong px-6 py-3 text-sm font-semibold text-teal transition-colors duration-200 hover:bg-sky/30"
        >
          <ListPlus size={18} aria-hidden="true" />
          Save for Later
        </button>
      </div>

      {reserving && (
        <ReserveModal
          book={book}
          onClose={closeReserve}
          onReserved={handleReserved}
        />
      )}
    </div>
  );
}

export default BookSummary;
