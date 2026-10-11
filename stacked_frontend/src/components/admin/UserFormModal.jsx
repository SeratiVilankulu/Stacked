import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  createUser,
  updateUser,
} from "../../lib/users.js";
import { apiErrorMessage } from "../../lib/api.js";

const MIN_PASSWORD_LENGTH = 8; // Matches the register page

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

// Add a new user, or edit user when doing it from Admin portal
function UserFormModal({ user, onClose, onSaved }) {
  const isEdit = Boolean(user);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    surname: user?.surname ?? "",
    email: user?.email ?? "",
    username: user?.username ?? "",
    password: "",
    role: user?.role ?? "USER",
    status: user?.status ?? "ACTIVE",
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Close the modal
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && !isSaving && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isSaving, onClose]);

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmed = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, v.trim()]),
    );
    if (!trimmed.name || !trimmed.surname || !trimmed.email || !trimmed.username) {
      setError("Name, surname, email and username are required");
      return;
    }
    if (!isEdit && trimmed.password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    // A password is only set when adding a user and the account status starts as active
    const { password, status, ...details } = trimmed;
    const data = isEdit ? { ...details, status } : { ...details, password };

    setIsSaving(true);
    try {
      const saved = isEdit
        ? await updateUser(user.id, data)
        : await createUser(data);
      onSaved(saved);
    } catch (err) {
      setError(apiErrorMessage(err, "Could not save the user"));
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-teal/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !isSaving && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-form-title"
        onSubmit={submit}
        className="w-full max-w-xl rounded-[var(--radius-lg)] bg-cream p-6 shadow-lift"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="user-form-title" className="text-3xl">
            {isEdit ? "Edit User" : "Add User"}
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Name">
            <input value={form.name} onChange={update("name")} className={INPUT_CLASSES} required />
          </Field>
          <Field label="Surname">
            <input value={form.surname} onChange={update("surname")} className={INPUT_CLASSES} required />
          </Field>
          <Field label="Email" className="sm:col-span-2">
            <input type="email" value={form.email} onChange={update("email")} className={INPUT_CLASSES} required />
          </Field>
          <Field label="Username">
            <input value={form.username} onChange={update("username")} className={INPUT_CLASSES} required />
          </Field>
          {isEdit ? (
            <Field label="Status">
              <select value={form.status} onChange={update("status")} className={INPUT_CLASSES}>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
          ) : (
            <Field label="Password">
              <input
                type="password"
                value={form.password}
                onChange={update("password")}
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                className={INPUT_CLASSES}
                required
              />
            </Field>
          )}
          <Field label="Role">
            <select value={form.role} onChange={update("role")} className={INPUT_CLASSES}>
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </Field>
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
            className="cursor-pointer rounded-md border border-border-strong px-6 py-3 text-sm font-semibold text-teal transition-colors hover:bg-sky/30"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="cursor-pointer rounded-md bg-teal px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-teal-deep disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Add User"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserFormModal;
