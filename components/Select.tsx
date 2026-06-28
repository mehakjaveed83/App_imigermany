import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  name: string;
  options: SelectOption[];
};

export function Select({
  label,
  name,
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink">{label}</span>
      <select
        className={`w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink shadow-sm outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/20 ${className}`}
        name={name}
        {...props}
      >
        <option value="">Choose one</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
