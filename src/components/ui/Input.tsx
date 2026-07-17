"use client";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-[var(--ink)]"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-[var(--surface)] px-4 py-2.5 text-[var(--ink)] placeholder:text-[var(--faint)] outline-none transition-colors duration-200 focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)] ${
          error ? "border-[var(--clay)]" : "border-[var(--border-strong)]"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[var(--clay)]">{error}</p>}
    </div>
  );
}
