const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function toDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function dateFromToday(days: number, now = new Date()): string {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  date.setDate(date.getDate() + days);
  return toDateOnly(date);
}

export function parseDateOnly(value: string): Date | null {
  if (!DATE_ONLY.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function isWithinNextDays(
  value: string | null,
  days: number,
  now = new Date(),
): boolean {
  if (!value) return false;
  const date = parseDateOnly(value);
  if (!date) return false;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const finalDay = new Date(today);
  finalDay.setDate(finalDay.getDate() + days);
  return date >= today && date <= finalDay;
}

export function formatDate(value: string | null): string {
  if (!value) return "No due date";
  const isoDate = value.slice(0, 10);
  const date = parseDateOnly(isoDate);
  if (!date) return "Invalid date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
