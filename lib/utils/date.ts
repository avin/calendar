export function isSameDate(date1: Date, date2: Date) {
  const d1 = new Date(date1).setHours(0, 0, 0, 0);
  const d2 = new Date(date2).setHours(0, 0, 0, 0);
  return d1 === d2;
}
