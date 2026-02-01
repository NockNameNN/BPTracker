"use client";

import { DIFFICULTY_OPTIONS } from "@/lib/tasks";
import type { SortBy } from "@/lib/tasks";

export interface FiltersState {
  categoryFaction: boolean;
  categoryNonFaction: boolean;
  extraWith: boolean;
  extraWithout: boolean;
  difficultyFilter: string;
  sortBy: SortBy;
}

interface FiltersPanelProps {
  open: boolean;
  onToggleOpen: () => void;
  filters: FiltersState;
  onFiltersChange: (updates: Partial<FiltersState>) => void;
}

const SORT_LABELS: Record<SortBy, string> = {
  default: "По умолчанию",
  bp: "По BP",
  difficulty: "По времени",
};

export function FiltersPanel({
  open,
  onToggleOpen,
  filters,
  onFiltersChange,
}: FiltersPanelProps) {
  return (
    <div className="mb-3">
      <button
        type="button"
        onClick={onToggleOpen}
        className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700"
      >
        <span>Фильтры</span>
        <span className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="mt-2 space-y-4 rounded-lg border border-slate-600 bg-slate-800/60 p-4">
          <div>
            <p className="mb-2 text-sm font-medium text-slate-400">Категория</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.categoryFaction}
                  onChange={(e) => onFiltersChange({ categoryFaction: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-300">Фракционные</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.categoryNonFaction}
                  onChange={(e) => onFiltersChange({ categoryNonFaction: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-300">Не фракционные</span>
              </label>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-400">Доп. условия</p>
            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.extraWith}
                  onChange={(e) => onFiltersChange({ extraWith: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-300">С доп. условием</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.extraWithout}
                  onChange={(e) => onFiltersChange({ extraWithout: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-slate-300">Без доп. условия</span>
              </label>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-400">Время</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onFiltersChange({ difficultyFilter: "" })}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  !filters.difficultyFilter ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Все
              </button>
              {DIFFICULTY_OPTIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onFiltersChange({ difficultyFilter: d })}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    filters.difficultyFilter === d ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-slate-400">Сортировка</p>
            <div className="flex flex-wrap gap-2">
              {(["default", "bp", "difficulty"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onFiltersChange({ sortBy: key })}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    filters.sortBy === key ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {SORT_LABELS[key]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
