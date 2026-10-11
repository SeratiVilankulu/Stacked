import CoverImage from "./CoverImage.jsx";

function BookCover({ book }) {
  return (
    <div className="grid place-items-center rounded-md p-6 sm:p-2">
      <CoverImage book={book} className="w-full max-w-64" />
    </div>
  );
}

export default BookCover;
