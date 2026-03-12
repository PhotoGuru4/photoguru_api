import { TIME } from '../constants/time.constants';

export function getStartOfDay(date: Date | string): Date {
  const d = new Date(date);
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
  );
}

export function getEndOfDay(date: Date | string): Date {
  const d = new Date(date);
  return new Date(
    Date.UTC(
      d.getUTCFullYear(),
      d.getUTCMonth(),
      d.getUTCDate(),
      TIME.END_OF_DAY.HOURS,
      TIME.END_OF_DAY.MINUTES,
      TIME.END_OF_DAY.SECONDS,
      TIME.END_OF_DAY.MILLISECONDS,
    ),
  );
}

export function getStartOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));
}

export function getEndOfMonth(year: number, month: number): Date {
  return new Date(
    Date.UTC(
      year,
      month + 1,
      0,
      TIME.END_OF_DAY.HOURS,
      TIME.END_OF_DAY.MINUTES,
      TIME.END_OF_DAY.SECONDS,
      TIME.END_OF_DAY.MILLISECONDS,
    ),
  );
}

export const getDateRange = (date: string | Date) => {
  return {
    startOfDay: getStartOfDay(date),
    endOfDay: getEndOfDay(date),
  };
};

export const formatTimeToHHmm = (date: Date): string => {
  return (
    date.getUTCHours().toString().padStart(2, '0') +
    ':' +
    date.getUTCMinutes().toString().padStart(2, '0')
  );
};
