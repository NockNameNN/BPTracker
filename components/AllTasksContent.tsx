"use client";

import { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { TASKS, matchesCategory, matchesExtraCondition, matchesDifficulty, sortTasks, type SortBy } from "@/lib/tasks";
import { FiltersPanel, type FiltersState } from "./FiltersPanel";
import { TaskListItem } from "./TaskListItem";

const defaultFilters: FiltersState = {
  categoryFaction: false,
  categoryNonFaction: false,
  extraWith: false,
  extraWithout: false,
  difficultyFilter: "",
  sortBy: "default",
};

export function AllTasksContent() {
  const {
    favoriteIds,
    completedIds,
    completedCounts,
    toggleFavorite,
    setFavoriteIds,
  } = useTracker();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const updateFilters = useCallback((updates: Partial<FiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  }, []);

  const filteredTasks = useMemo(() => {
    let list = TASKS;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }
    return list.filter(
      (t) =>
        matchesCategory(t, filters.categoryFaction, filters.categoryNonFaction) &&
        matchesExtraCondition(t, filters.extraWith, filters.extraWithout) &&
        matchesDifficulty(t, filters.difficultyFilter)
    );
  }, [search, filters]);

  const sortedTasks = useMemo(
    () => sortTasks(filteredTasks, filters.sortBy),
    [filteredTasks, filters.sortBy]
  );

  const addAllToFavorites = () => {
    const ids = new Set(favoriteIds);
    sortedTasks.forEach((t) => ids.add(t.id));
    setFavoriteIds(Array.from(ids));
  };

  const clearAllFavorites = () => setFavoriteIds([]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-amber-400"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        На главную
      </Link>
      <h1 className="mb-4 text-xl font-bold text-white">Все задания</h1>

      <input
        type="search"
        placeholder="Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />

      <div className="mb-4">
        <FiltersPanel
          open={filtersOpen}
          onToggleOpen={() => setFiltersOpen((v) => !v)}
          filters={filters}
          onFiltersChange={updateFilters}
        />
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={addAllToFavorites}
          className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
        >
          Добавить все в избранное
        </button>
        <button
          type="button"
          onClick={clearAllFavorites}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
        >
          Очистить избранное
        </button>
      </div>

      <ul className="space-y-2">
        {sortedTasks.map((task) => (
          <TaskListItem
            key={task.id}
            task={task}
            isFavorite={favoriteIds.includes(task.id)}
            isCompleted={
              task.repeatable
                ? (completedCounts[task.id] ?? 0) > 0
                : completedIds.includes(task.id)
            }
            repeatCount={task.repeatable ? (completedCounts[task.id] ?? 0) : 0}
            onToggleFavorite={() => toggleFavorite(task.id)}
          />
        ))}
      </ul>
    </div>
  );
}
