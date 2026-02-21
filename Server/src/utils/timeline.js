const MS_PER_DAY = 24 * 60 * 60 * 1000;

export const toDate = (value, fallback = null) => {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date;
};

export const startOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const endOfDay = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

export const startOfWeek = (date, weekStartsOn = 1) => {
  const safeDate = startOfDay(date);
  const day = safeDate.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  safeDate.setDate(safeDate.getDate() - diff);
  return safeDate;
};

export const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const addWeeks = (date, weeks) => addDays(date, weeks * 7);

export const addMonths = (date, months) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + months);
  return next;
};

export const getOverlapMs = (startA, endA, startB, endB) => {
  const start = Math.max(startA.getTime(), startB.getTime());
  const end = Math.min(endA.getTime(), endB.getTime());
  if (end < start) return 0;
  return end - start + 1;
};

const formatDateLabel = (date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const buildPeriods = ({from, to, granularity = "week"}) => {
  const periods = [];
  if (!from || !to) return periods;
  let cursor = new Date(from);
  if (granularity === "week") {
    cursor = startOfWeek(from);
  } else if (granularity === "month") {
    cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  } else {
    cursor = startOfDay(from);
  }

  while (cursor <= to) {
    let periodStart = cursor;
    let periodEnd;
    if (granularity === "day") {
      periodEnd = endOfDay(cursor);
      cursor = addDays(cursor, 1);
    } else if (granularity === "month") {
      const next = addMonths(cursor, 1);
      periodEnd = new Date(next.getFullYear(), next.getMonth(), 0, 23, 59, 59, 999);
      cursor = next;
    } else {
      const next = addWeeks(cursor, 1);
      periodEnd = addDays(next, -1);
      periodEnd = endOfDay(periodEnd);
      cursor = next;
    }

    const start = periodStart < from ? from : periodStart;
    const end = periodEnd > to ? to : periodEnd;
    if (end >= start) {
      periods.push({
        start,
        end,
        label: formatDateLabel(start),
      });
    }
  }

  return periods;
};

export const getPeriodDays = (period) =>
  Math.max(1, Math.round((period.end - period.start + 1) / MS_PER_DAY));
