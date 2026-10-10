const monthFmt = new Intl.DateTimeFormat("es-UY", { month: "long", year: "numeric" });
const dateFmt = new Intl.DateTimeFormat("es-UY", { day: "2-digit", month: "long", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("es-UY", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatMonth(value: string | Date): string {
  const label = monthFmt.format(toDate(value));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDate(value: string | Date): string {
  return dateFmt.format(toDate(value));
}

export function formatDateTime(value: string | Date): string {
  return dateTimeFmt.format(toDate(value));
}

export function formatNumber(value: number): string {
  return value.toLocaleString("es-UY");
}