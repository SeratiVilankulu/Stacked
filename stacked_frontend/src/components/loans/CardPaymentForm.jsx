import { useState } from "react";
import { ArrowRight, CreditCard, Info, Lock } from "lucide-react";

const EMPTY = { name: "", number: "", expiry: "", cvv: "" };

// Card number formatting
const formatNumber = (value) =>
  value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

// Expiry date formatting
const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits;
};

function validate({ name, number, expiry, cvv }) {
  const errors = {};
  const digits = number.replace(/\D/g, "");
  const [month, year] = expiry.split(" / ").map(Number);

  if (!name.trim()) errors.name = "Enter the name on the card.";

  if (digits.length < 13)
    errors.number = "Enter a valid card number.";

  const now = new Date();
  const expiresAt = new Date(2000 + year, month); // First day after expiry month
  if (!month || month > 12 || !year || expiresAt <= now)
    errors.expiry = "Enter a valid expiry date.";

  if (!/^\d{3,4}$/.test(cvv)) errors.cvv = "Enter the 3 or 4 digit code.";

  return errors;
}

function Field({ label, error, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium text-teal">{label}</span>
      <span
        className={`mt-1.5 flex items-center gap-2 rounded-md border bg-surface px-3.5 py-2.5 transition-colors duration-200 focus-within:border-teal ${
          error ? "border-alert" : "border-border"
        }`}
      >
        {children}
      </span>
      {error && <span className="mt-1 block text-xs text-alert">{error}</span>}
    </label>
  );
}

const INPUT_CLASSES =
  "w-full min-w-0 bg-transparent text-sm text-teal placeholder:text-muted/70 focus:outline-none!";

function CardPaymentForm({ amount, onPaid }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, format = (v) => v) => (e) => {
    setValues((prev) => ({ ...prev, [field]: format(e.target.value) }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // TODO: Send to the payments endpoint once it exists.
    setSubmitting(true);
    setTimeout(() => {
      setValues(EMPTY);
      setSubmitting(false);
      onPaid();
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <h3 className="font-body text-lg font-semibold">Card details</h3>

      <Field label="Cardholder name" error={errors.name}>
        <input
          type="text"
          autoComplete="cc-name"
          placeholder="Enter cardholder name"
          value={values.name}
          onChange={update("name")}
          className={INPUT_CLASSES}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Card number" error={errors.number} className="col-span-2">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={values.number}
            onChange={update("number", formatNumber)}
            className={INPUT_CLASSES}
          />
          <CreditCard size={18} aria-hidden="true" className="shrink-0 text-muted" />
        </Field>

        <Field label="Expiry date" error={errors.expiry}>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            value={values.expiry}
            onChange={update("expiry", formatExpiry)}
            className={INPUT_CLASSES}
          />
        </Field>

        <Field label="CVV" error={errors.cvv}>
          <input
            type="password"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={values.cvv}
            onChange={update("cvv", (v) => v.replace(/\D/g, "").slice(0, 4))}
            className={INPUT_CLASSES}
          />
          <Info
            size={16}
            aria-label="The 3 digits on the back of your card"
            className="shrink-0 text-muted"
          />
        </Field>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-orange px-6 py-3.5 font-semibold text-white shadow-card transition-colors duration-200 hover:bg-orange-ink disabled:cursor-wait disabled:opacity-70"
      >
        <CreditCard size={20} aria-hidden="true" />
        {submitting ? "Processing…" : `Pay R${amount.toFixed(2)}`}
        {!submitting && <ArrowRight size={18} aria-hidden="true" />}
      </button>

      <p className="flex items-center justify-center gap-2 text-sm text-teal">
        <Lock size={15} aria-hidden="true" />
        Secure payment
      </p>
    </form>
  );
}

export default CardPaymentForm;
