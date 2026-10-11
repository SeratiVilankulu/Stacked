import { useEffect, useState } from "react";
import { X } from "lucide-react";
import CoverImage from "../book/CoverImage.jsx";
import { createBook, updateBook } from "../../lib/books.js";
import { apiErrorMessage } from "../../lib/api.js";

const MAX_COPIES = 10; // Matches the backend limit
const MAX_COVER_SIZE = 5 * 1024 * 1024; // 5 MB, also checked by the backend
const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

const INPUT_CLASSES =
  "mt-2 w-full rounded-[var(--radius-md)] border border-sky bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-teal focus:outline-none";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-teal">{label}</span>
      {children}
    </label>
  );
}

// Add a new book, or edit `book` when one is given. Calls onSaved(book) after a successful save.
function BookFormModal({ book, genres, onClose, onSaved }) {
  const isEdit = Boolean(book);
  const [form, setForm] = useState({
    title: book?.title ?? "",
    author: book?.author ?? "",
    isbn: book?.isbn ?? "",
    genre: book?.genre ?? "",
    description: book?.description ?? "",
    copiesAvailable: 1,
  });
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Close on Escape, like any dialog
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !isSaving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSaving, onClose]);

  // Free the preview's object URL when it changes or the modal closes
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const pickCover = (e) => {
    const file = e.target.files?.[0];
    setError("");
    if (!file) return;

    if (!COVER_TYPES.includes(file.type)) {
      setError("Cover image must be a JPG, PNG or WEBP file");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_COVER_SIZE) {
      setError("Cover image must be 5 MB or smaller");
      e.target.value = "";
      return;
    }

    setCover(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, String(v).trim()]),
    );
    if (!trimmed.title || !trimmed.author || !trimmed.isbn || !trimmed.genre) {
      setError("Title, author, ISBN and genre are required");
      return;
    }

    // Multipart, so the cover file travels with the other fields
    const data = new FormData();
    ["title", "author", "isbn", "genre", "description"].forEach((key) =>
      data.append(key, trimmed[key]),
    );
    // Copies are only set when adding; after that they are managed per copy
    if (!isEdit) data.append("copiesAvailable", trimmed.copiesAvailable);
    if (cover) data.append("coverImage", cover);

    setIsSaving(true);
    try {
      const saved = isEdit
        ? await updateBook(book.id, data)
        : await createBook(data);
      onSaved(saved);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save the book"));
      setIsSaving(false);
    }
  };

  const coverBook = {
    title: form.title || "New book",
    coverImageUrl: preview ?? book?.coverImageUrl,
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-teal/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !isSaving && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-form-title"
        onSubmit={submit}
        className="w-full max-w-2xl rounded-[var(--radius-lg)] bg-cream p-6 shadow-lift"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="book-form-title" className="text-3xl">
            {isEdit ? "Edit Book" : "Add Book"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
            className="grid size-8 cursor-pointer place-items-center rounded-full text-teal transition-colors hover:bg-sky/40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[9rem_minmax(0,1fr)]">
          <div className="space-y-3">
            <CoverImage book={coverBook} className="w-full" />
            <label className="block cursor-pointer rounded-[var(--radius-md)] border border-border-strong px-3 py-2 text-center text-sm font-semibold text-teal transition-colors hover:bg-sky/30">
              {cover || book?.coverImageUrl ? "Change cover" : "Upload cover"}
              <input
                type="file"
                accept={COVER_TYPES.join(",")}
                onChange={pickCover}
                className="sr-only"
              />
            </label>
            <p className="text-center text-xs text-muted">JPG, PNG or WEBP, up to 5 MB</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title" className="sm:col-span-2">
              <input value={form.title} onChange={update("title")} className={INPUT_CLASSES} required />
            </Field>
            <Field label="Author">
              <input value={form.author} onChange={update("author")} className={INPUT_CLASSES} required />
            </Field>
            <Field label="ISBN">
              <input value={form.isbn} onChange={update("isbn")} className={INPUT_CLASSES} required />
            </Field>
            <Field label="Genre">
              <input
                value={form.genre}
                onChange={update("genre")}
                list="book-genres"
                placeholder="e.g. Fantasy"
                className={INPUT_CLASSES}
                required
              />
              <datalist id="book-genres">
                {genres.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </Field>
            {isEdit ? (
              <Field label="Copies available">
                <p className="mt-2 py-2.5 text-sm text-muted">
                  {book.copiesAvailable} (managed per copy)
                </p>
              </Field>
            ) : (
              <Field label="Copies">
                <input
                  type="number"
                  min={0}
                  max={MAX_COPIES}
                  value={form.copiesAvailable}
                  onChange={update("copiesAvailable")}
                  className={INPUT_CLASSES}
                />
              </Field>
            )}
            <Field label="Description" className="sm:col-span-2">
              <textarea
                rows={4}
                value={form.description}
                onChange={update("description")}
                className={`${INPUT_CLASSES} resize-y`}
              />
            </Field>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-[var(--radius-md)] border border-border-strong px-6 py-3 text-sm font-semibold text-teal transition-colors hover:bg-sky/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-[var(--radius-md)] bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-teal-deep disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Add Book"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default BookFormModal;
