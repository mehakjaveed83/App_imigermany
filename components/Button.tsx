import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-forest focus:ring-offset-2";
  const variantClasses =
    variant === "primary"
      ? "bg-forest text-white hover:bg-[#195c4b]"
      : "border border-line bg-white text-ink hover:bg-[#fbfaf7]";
  const classes = `${baseClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <Link className={classes} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
