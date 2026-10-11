import { Link } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";
import Pill from "../Pill.jsx";
import CoverImage from "../book/CoverImage.jsx";
import { formatDate } from "../../pages/user/loanData.js";

function ReadingHistoryList({ loans }) {
  return (
    <ul className="divide-y divide-sky">
      {loans.map(({ id, book, returnedOn }) => (
        <li key={id}>
          <Link
            to={book.id ? `/books/${book.id}` : "/books"}
            className="group flex items-center gap-4 py-3"
          >
            <CoverImage book={book} alt="" className="w-12" />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-sm font-semibold text-teal group-hover:underline">
                {book.title}
              </p>
              <p className="text-xs text-muted">{book.author}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Pill className="inline-flex items-center gap-1 bg-success/10 text-success">
                  <CheckCircle2 size={12} aria-hidden="true" />
                  Completed
                </Pill>
                <span className="text-xs text-muted">
                  Returned {formatDate(returnedOn)}
                </span>
              </div>
            </div>
            <ChevronRight
              size={18}
              aria-hidden="true"
              className="shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default ReadingHistoryList;
