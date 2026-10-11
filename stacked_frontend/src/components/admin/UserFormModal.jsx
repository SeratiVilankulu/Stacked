import { useState } from "react";
import Modal from "../Modal.jsx";
import FormField from "../FormField.jsx";
import {
  ROLE_LABELS,
  STATUS_LABELS,
  createUser,
  updateUser,
} from "../../lib/users.js";
import { INPUT_CLASSES } from "../../lib/forms.js";
import { apiErrorMessage } from "../../lib/api.js";

const MIN_PASSWORD_LENGTH = 8; // Matches the register page

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

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async () => {
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
    <Modal
      title={isEdit ? "Edit User" : "Add User"}
      onClose={onClose}
      onSubmit={submit}
      busy={isSaving}
      error={error}
      submitLabel={isEdit ? "Save Changes" : "Add User"}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name">
          <input value={form.name} onChange={update("name")} className={INPUT_CLASSES} required />
        </FormField>
        <FormField label="Surname">
          <input value={form.surname} onChange={update("surname")} className={INPUT_CLASSES} required />
        </FormField>
        <FormField label="Email" className="sm:col-span-2">
          <input type="email" value={form.email} onChange={update("email")} className={INPUT_CLASSES} required />
        </FormField>
        <FormField label="Username">
          <input value={form.username} onChange={update("username")} className={INPUT_CLASSES} required />
        </FormField>
        {isEdit ? (
          <FormField label="Status">
            <select value={form.status} onChange={update("status")} className={INPUT_CLASSES}>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>
        ) : (
          <FormField label="Password">
            <input
              type="password"
              value={form.password}
              onChange={update("password")}
              minLength={MIN_PASSWORD_LENGTH}
              autoComplete="new-password"
              className={INPUT_CLASSES}
              required
            />
          </FormField>
        )}
        <FormField label="Role">
          <select value={form.role} onChange={update("role")} className={INPUT_CLASSES}>
            {Object.entries(ROLE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </FormField>
      </div>
    </Modal>
  );
}

export default UserFormModal;
