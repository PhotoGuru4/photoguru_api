import { TIME } from '../constants/time.constants';

export function getStartOfDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function getEndOfDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      TIME.END_OF_DAY.HOURS,
      TIME.END_OF_DAY.MINUTES,
      TIME.END_OF_DAY.SECONDS,
      TIME.END_OF_DAY.MILLISECONDS,
    ),
  );
}

export function getStartOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1));
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
