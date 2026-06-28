import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

export function Input({ label, name, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <input
        className={`w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted focus:border-forest focus:ring-2 focus:ring-forest/20 ${className}`}
        name={name}
        {...props}
      />
    </label>
  );
}
