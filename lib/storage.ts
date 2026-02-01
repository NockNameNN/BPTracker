import { TrackerState } from "./types";

const KEY = "bp-tracker-state";

export const defaultState: TrackerState = {
  favoriteIds: [],
  completedIds: [],
  completedCounts: {},
  isVip: false,
  lastResetDate: "",
};

export function loadState(): TrackerState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<TrackerState>;
    const completedCounts = parsed.completedCounts && typeof parsed.completedCounts === "object" && !Array.isArray(parsed.completedCounts)
      ? parsed.completedCounts as Record<number, number>
      : defaultState.completedCounts;
    return {
      favoriteIds: Array.isArray(parsed.favoriteIds) ? parsed.favoriteIds : defaultState.favoriteIds,
      completedIds: Array.isArray(parsed.completedIds) ? parsed.completedIds : defaultState.completedIds,
      completedCounts,
      isVip: typeof parsed.isVip === "boolean" ? parsed.isVip : defaultState.isVip,
      lastResetDate: typeof parsed.lastResetDate === "string" ? parsed.lastResetDate : defaultState.lastResetDate,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: TrackerState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
