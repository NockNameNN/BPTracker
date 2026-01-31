import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { startOfDay, addDays, differenceInMilliseconds } from "date-fns";

const MSK = "Europe/Moscow";

export function getNowInMsk(): Date {
  return toZonedTime(new Date(), MSK);
}

export function getMskDateString(date: Date): string {
  const zoned = toZonedTime(date, MSK);
  return zoned.toISOString().slice(0, 10);
}

export function getTodayMskKey(): string {
  return getMskDateString(new Date());
}

export function getNextResetMsk(): Date {
  const now = new Date();
  const mskNow = toZonedTime(now, MSK);
  const startToday = startOfDay(mskNow);
  const startTodayUtc = fromZonedTime(startToday, MSK);
  const startTomorrowUtc = addDays(startTodayUtc, 1);
  return startTomorrowUtc;
}

export function getMsUntilNextReset(): number {
  const next = getNextResetMsk();
  return Math.max(0, differenceInMilliseconds(next, new Date()));
}

export function formatTimeUntilReset(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map((n) => String(n).padStart(2, "0")).join(":");
}
