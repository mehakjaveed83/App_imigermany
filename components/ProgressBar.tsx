type ProgressBarProps = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">Progress</span>
        <span className="text-muted">{percent}% complete</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-line" aria-hidden="true">
        <div
          className="h-full rounded-full bg-forest transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
