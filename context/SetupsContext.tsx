"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadSetups, saveSetups } from "@/lib/setups";
import type { Setup } from "@/lib/types";

interface SetupsContextValue {
  setups: Setup[];
  addSetup: (name: string, favoriteIds: number[]) => void;
  removeSetup: (id: string) => void;
}

const SetupsContext = createContext<SetupsContextValue | null>(null);

export function SetupsProvider({ children }: { children: React.ReactNode }) {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSetups(loadSetups());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    saveSetups(setups);
  }, [setups, mounted]);

  const addSetup = useCallback((name: string, favoriteIds: number[]) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSetups((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: trimmed,
        favoriteIds: [...favoriteIds],
      },
    ]);
  }, []);

  const removeSetup = useCallback((id: string) => {
    setSetups((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const value = useMemo(
    () => ({ setups, addSetup, removeSetup }),
    [setups, addSetup, removeSetup]
  );

  return <SetupsContext.Provider value={value}>{children}</SetupsContext.Provider>;
}

export function useSetups() {
  const ctx = useContext(SetupsContext);
  if (!ctx) throw new Error("useSetups must be used within SetupsProvider");
  return ctx;
}
