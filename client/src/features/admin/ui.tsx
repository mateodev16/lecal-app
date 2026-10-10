import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-green-950">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-soft">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-white p-5 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function FormField({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="field" data-invalid={error ? "true" : "false"}>
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint ? <p className="form-note">{hint}</p> : null}
      <p className="field-error">{error}</p>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  nuevo: "bg-amber/15 text-amber border-amber/40",
  en_seguimiento: "bg-blue-50 text-blue-700 border-blue-200",
  respondido: "bg-leaf/15 text-green-800 border-leaf/40",
  cerrado: "bg-surface-2 text-ink-mute border-line-strong",
};

const STATUS_LABELS: Record<string, string> = {
  nuevo: "Nuevo",
  en_seguimiento: "En seguimiento",
  respondido: "Respondido",
  cerrado: "Cerrado",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? "border-line bg-surface-2 text-ink-mute"
      }`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong bg-surface-2/60 px-4 py-10 text-center text-sm text-ink-mute">
      {children}
    </div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="mb-4 rounded-lg border border-[#e6b3aa] bg-[#fbeae7] px-3 py-2 text-sm text-[#8e2a1e]">
      {children}
    </p>
  );
}