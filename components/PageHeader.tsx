import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-coral">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-ink md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
