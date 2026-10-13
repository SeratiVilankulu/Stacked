import { useEffect, useId } from "react";
import { X } from "lucide-react";

const WIDTHS = {
  md: "max-w-md",
  lg: "max-w-xl",
  xl: "max-w-2xl",
};

/* Dialog shell shared by every modal */
function Modal({
  title,
  onClose,
  onSubmit,
  busy = false,
  error = "",
  submitLabel = "Save",
  busyLabel = "Saving...",
  cancelLabel = "Cancel",
  size = "lg",
  children,
}) {
  const titleId = useId();

  // Close on Escape, like any dialog
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !busy && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onClose]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-teal/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={submit}
        className={`w-full ${WIDTHS[size]} rounded-lg bg-cream p-6 shadow-lift`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-3xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="grid size-8 cursor-pointer place-items-center rounded-full text-teal transition-colors hover:bg-sky/40"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6">{children}</div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-alert">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="cursor-pointer rounded-md border border-border-strong px-6 py-3 text-sm font-semibold text-teal transition-colors hover:bg-sky/30"
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            disabled={busy}
            className="cursor-pointer rounded-md bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-teal-deep disabled:cursor-wait disabled:opacity-60"
          >
            {busy ? busyLabel : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
