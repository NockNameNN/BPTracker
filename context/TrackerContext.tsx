"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadState, saveState, defaultState } from "@/lib/storage";
import { getTodayMskKey } from "@/lib/time";
import { TrackerState } from "@/lib/types";

interface TrackerContextValue extends TrackerState {
  setFavoriteIds: (ids: number[]) => void;
  toggleFavorite: (id: number) => void;
  setCompletedIds: (ids: number[]) => void;
  toggleCompleted: (id: number) => void;
  setCompletedCount: (id: number, count: number) => void;
  setIsVip: (v: boolean) => void;
  resetDay: () => void;
}

const TrackerContext = createContext<TrackerContextValue | null>(null);

export function TrackerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TrackerState>(defaultState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    const today = getTodayMskKey();
    if (!loaded.lastResetDate) {
      setState({ ...loaded, lastResetDate: today });
    } else {
      setState(loaded);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveState(state);
  }, [state, mounted]);

  const todayKey = getTodayMskKey();

  useEffect(() => {
    if (!mounted || !state.lastResetDate) return;
    if (state.lastResetDate !== todayKey) {
      setState((prev) => ({
        ...prev,
        completedIds: [],
        completedCounts: {},
        lastResetDate: todayKey,
      }));
    }
  }, [todayKey, state.lastResetDate, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      const today = getTodayMskKey();
      setState((prev) => {
        if (prev.lastResetDate && prev.lastResetDate !== today) {
          return { ...prev, completedIds: [], completedCounts: {}, lastResetDate: today };
        }
        return prev;
      });
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [mounted]);

  const setFavoriteIds = useCallback((ids: number[]) => {
    setState((prev) => ({ ...prev, favoriteIds: ids }));
  }, []);

  const toggleFavorite = useCallback((id: number) => {
    setState((prev) => {
      const has = prev.favoriteIds.includes(id);
      const favoriteIds = has
        ? prev.favoriteIds.filter((x) => x !== id)
        : [...prev.favoriteIds, id];
      return { ...prev, favoriteIds };
    });
  }, []);

  const setCompletedIds = useCallback((ids: number[]) => {
    setState((prev) => ({ ...prev, completedIds: ids }));
  }, []);

  const toggleCompleted = useCallback((id: number) => {
    setState((prev) => {
      const has = prev.completedIds.includes(id);
      const completedIds = has
        ? prev.completedIds.filter((x) => x !== id)
        : [...prev.completedIds, id];
      return { ...prev, completedIds };
    });
  }, []);

  const setCompletedCount = useCallback((id: number, count: number) => {
    setState((prev) => {
      const n = Math.max(0, Math.floor(count));
      if (n === 0) {
        const { [id]: _, ...rest } = prev.completedCounts;
        return { ...prev, completedCounts: rest };
      }
      return { ...prev, completedCounts: { ...prev.completedCounts, [id]: n } };
    });
  }, []);

  const setIsVip = useCallback((v: boolean) => {
    setState((prev) => ({ ...prev, isVip: v }));
  }, []);

  const resetDay = useCallback(() => {
    setState((prev) => ({
      ...prev,
      completedIds: [],
      completedCounts: {},
      lastResetDate: todayKey,
    }));
  }, [todayKey]);

  const value = useMemo<TrackerContextValue>(
    () => ({
      ...state,
      setFavoriteIds,
      toggleFavorite,
      setCompletedIds,
      toggleCompleted,
      setCompletedCount,
      setIsVip,
      resetDay,
    }),
    [
      state,
      setFavoriteIds,
      toggleFavorite,
      setCompletedIds,
      toggleCompleted,
      setCompletedCount,
      setIsVip,
      resetDay,
    ]
  );

  return <TrackerContext.Provider value={value}>{children}</TrackerContext.Provider>;
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error("useTracker must be used within TrackerProvider");
  return ctx;
}
