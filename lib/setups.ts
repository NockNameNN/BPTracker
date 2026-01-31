import type { Setup } from "./types";

const KEY = "bp-tracker-setups";

export function loadSetups(): Setup[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x: unknown): x is Setup =>
        typeof x === "object" &&
        x !== null &&
        typeof (x as Setup).id === "string" &&
        typeof (x as Setup).name === "string" &&
        Array.isArray((x as Setup).favoriteIds)
    );
  } catch {
    return [];
  }
}

export function saveSetups(setups: Setup[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(setups));
  } catch {}
}
