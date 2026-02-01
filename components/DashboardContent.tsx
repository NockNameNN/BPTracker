"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { useSetups } from "@/context/SetupsContext";
import { useFilteredFavorites } from "@/hooks/useFilteredFavorites";
import type { FiltersState } from "./FiltersPanel";
import { BPSummary } from "./BPSummary";
import { FiltersPanel } from "./FiltersPanel";
import { SetupsPanel } from "./SetupsPanel";
import { ResetTimer } from "./ResetTimer";
import { TaskCardRepeatable, TaskCardDefault } from "./TaskCard";

const defaultFilters: FiltersState = {
  categoryFaction: false,
  categoryNonFaction: false,
  extraWith: false,
  extraWithout: false,
  difficultyFilter: "",
  sortBy: "default",
};

export function DashboardContent() {
  const {
    favoriteIds,
    completedIds,
    completedCounts,
    isVip,
    toggleFavorite,
    toggleCompleted,
    setFavoriteIds,
    setCompletedCount,
    setIsVip,
    resetDay,
  } = useTracker();
  const { setups, addSetup, removeSetup } = useSetups();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateFilters = useCallback((updates: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const {
    favorites,
    sortedFavorites,
    totalBp,
    maxBp,
    filteredCompletedCount,
    filteredFavorites,
  } = useFilteredFavorites(
    favoriteIds,
    filters,
    filters.sortBy,
    isVip,
    completedIds,
    completedCounts
  );

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Bonus Points</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/feedback"
            className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            Обратная связь
          </Link>
          <Link
            href="/all-tasks"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
          >
            Все задания
          </Link>
        </div>
      </div>

      <BPSummary
        totalBp={totalBp}
        maxBp={maxBp}
        isVip={isVip}
        onVipChange={setIsVip}
      />

      <ResetTimer />

      <SetupsPanel
        setups={setups}
        favoriteIds={favoriteIds}
        isVip={isVip}
        onAddSetup={addSetup}
        onRemoveSetup={removeSetup}
        onApplySetup={setFavoriteIds}
      />

      {favorites.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-600 bg-slate-800/40 p-8 text-center text-slate-400">
          <p className="mb-4">Добавьте задания со страницы всех заданий, чтобы отслеживать прогресс.</p>
          <Link
            href="/all-tasks"
            className="inline-block rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition hover:bg-amber-500"
          >
            Выбрать задания
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <FiltersPanel
            open={filtersOpen}
            onToggleOpen={() => setFiltersOpen((v) => !v)}
            filters={filters}
            onFiltersChange={updateFilters}
          />
          <h2 className="flex items-center justify-between gap-2 text-lg font-semibold text-slate-200">
            <span>Ежедневные задания</span>
            <span className="shrink-0 font-mono text-base font-medium text-amber-400">
              {filteredCompletedCount} / {filteredFavorites.length}
            </span>
          </h2>
          <ul className="space-y-2">
            {sortedFavorites.map((task) => {
              const bp = isVip ? task.bpWithVip : task.bpWithoutVip;
              if (task.repeatable) {
                const count = completedCounts[task.id] ?? 0;
                return (
                  <TaskCardRepeatable
                    key={task.id}
                    task={task}
                    bp={bp}
                    count={task.maxRepeatCount != null ? Math.min(count, task.maxRepeatCount) : count}
                    onCountChange={setCompletedCount}
                    onRemove={() => toggleFavorite(task.id)}
                  />
                );
              }
              return (
                <TaskCardDefault
                  key={task.id}
                  task={task}
                  bp={bp}
                  done={completedIds.includes(task.id)}
                  onToggleCompleted={() => toggleCompleted(task.id)}
                  onRemove={() => toggleFavorite(task.id)}
                />
              );
            })}
          </ul>
        </div>
      )}

      {favorites.length > 0 && (
        <button
          onClick={resetDay}
          className="rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          Сбросить
        </button>
      )}
    </div>
  );
}
