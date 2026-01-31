import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { addDays, differenceInMilliseconds } from "date-fns";

const MSK = "Europe/Moscow";
const RESET_HOUR_MSK = 7;

export function getNowInMsk(): Date {
  return toZonedTime(new Date(), MSK);
}

export function getMskDateString(date: Date): string {
  const zoned = toZonedTime(date, MSK);
  return zoned.toISOString().slice(0, 10);
}

export function getTodayMskKey(): string {
  const mskNow = getNowInMsk();
  const y = mskNow.getFullYear();
  const m = mskNow.getMonth();
  const d = mskNow.getDate();
  const h = mskNow.getHours();
  if (h < RESET_HOUR_MSK) {
    const prev = new Date(y, m, d - 1);
    return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}`;
  }
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function getNextResetMsk(): Date {
  const mskNow = getNowInMsk();
  const y = mskNow.getFullYear();
  const m = mskNow.getMonth();
  const d = mskNow.getDate();
  const resetToday = new Date(y, m, d, RESET_HOUR_MSK, 0, 0, 0);
  const resetTomorrow = addDays(resetToday, 1);
  const resetTodayUtc = fromZonedTime(resetToday, MSK);
  const resetTomorrowUtc = fromZonedTime(resetTomorrow, MSK);
  if (mskNow.getHours() < RESET_HOUR_MSK) {
    return resetTodayUtc;
  }
  return resetTomorrowUtc;
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
