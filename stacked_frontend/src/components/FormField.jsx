function FormField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-teal">{label}</span>
      {children}
    </label>
  );
}

export default FormField;
