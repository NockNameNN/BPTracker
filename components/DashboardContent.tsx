"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { useSetups } from "@/context/SetupsContext";
import { useFilteredFavorites } from "@/hooks/useFilteredFavorites";
import { useTelegramWebApp } from "@/hooks/useTelegramWebApp";
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

  const { isMiniApp } = useTelegramWebApp();
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

  const tasksToShow = useMemo(() => {
    const isCompleted = (task: (typeof sortedFavorites)[0]) =>
      task.repeatable
        ? (completedCounts[task.id] ?? 0) > 0
        : completedIds.includes(task.id);
    const incomplete = sortedFavorites.filter((t) => !isCompleted(t));
    const completed = sortedFavorites.filter(isCompleted);
    return [...incomplete, ...completed];
  }, [sortedFavorites, completedIds, completedCounts]);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Bonus Points</h1>
          <p className="sr-only">Трекер бп для GTA 5 RP. Бонус поинты и ежедневные задания. Бп гта 5 рп.</p>
        </div>
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
            {tasksToShow.map((task) => {
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

      <div className="flex justify-center border-t border-slate-700/50 pt-4">
        {!isMiniApp ? (
          <a
            href="https://t.me/bptrackergtabot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-sky-400"
            title="Открыть бота в Telegram"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
            <span>Бот в Telegram</span>
          </a>
        ) : (
          <a
            href={process.env.NEXT_PUBLIC_BASE_URL || "https://www.bp-tracker.ru"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-400"
            title="Открыть в браузере"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span>Открыть в браузере</span>
          </a>
        )}
      </div>
    </div>
  );
}
