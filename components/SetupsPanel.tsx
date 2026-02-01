"use client";

import { useState } from "react";
import { computeSetupMaxBp } from "@/hooks/useFilteredFavorites";
import type { Setup } from "@/lib/types";

interface SetupsPanelProps {
  setups: Setup[];
  favoriteIds: number[];
  isVip: boolean;
  onAddSetup: (name: string, ids: number[]) => void;
  onRemoveSetup: (id: string) => void;
  onApplySetup: (ids: number[]) => void;
}

export function SetupsPanel({
  setups,
  favoriteIds,
  isVip,
  onAddSetup,
  onRemoveSetup,
  onApplySetup,
}: SetupsPanelProps) {
  const [open, setOpen] = useState(false);
  const [setupName, setSetupName] = useState("");

  const handleSave = () => {
    onAddSetup(setupName, favoriteIds);
    setSetupName("");
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700"
      >
        <span>Сетапы</span>
        <span className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="space-y-4 rounded-lg border border-slate-600 bg-slate-800/60 p-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-0 flex-1">
              <label htmlFor="setup-name" className="mb-1 block text-sm font-medium text-slate-400">
                Название сетапа
              </label>
              <input
                id="setup-name"
                type="text"
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                placeholder="Например: Фракция, Оффлайн-день"
                className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={!setupName.trim() || favoriteIds.length === 0}
              className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Сохранить набор
            </button>
          </div>
          {setups.length === 0 ? (
            <p className="text-sm text-slate-400">Нет сохранённых сетапов. Сохраните текущий набор заданий.</p>
          ) : (
            <ul className="space-y-2">
              {setups.map((setup) => {
                const setupMaxBp = computeSetupMaxBp(setup.favoriteIds, isVip);
                return (
                  <li
                    key={setup.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2"
                  >
                    <span className="min-w-0 flex-1 truncate text-slate-200">{setup.name}</span>
                    <span className="text-xs text-slate-500">
                      {setup.favoriteIds.length} заданий · <span className="font-mono text-amber-400">{setupMaxBp} BP</span>
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onApplySetup(setup.favoriteIds)}
                        className="cursor-pointer rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                      >
                        Применить
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveSetup(setup.id)}
                        title="Удалить сетап"
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded text-slate-400 transition hover:bg-slate-600 hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
