"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { TASKS, DIFFICULTY_OPTIONS, matchesCategory, matchesExtraCondition, matchesDifficulty, sortTasks, type SortBy } from "@/lib/tasks";
import { ExtraConditionTag } from "./ExtraConditionTag";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      className="h-6 w-6 text-amber-400"
    >
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

export function AllTasksContent() {
  const {
    favoriteIds,
    completedIds,
    completedCounts,
    toggleFavorite,
    setFavoriteIds,
  } = useTracker();
  const [search, setSearch] = useState("");
  const [categoryFaction, setCategoryFaction] = useState(false);
  const [categoryNonFaction, setCategoryNonFaction] = useState(false);
  const [extraWith, setExtraWith] = useState(false);
  const [extraWithout, setExtraWithout] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    let list = TASKS;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }
    list = list.filter(
      (t) =>
        matchesCategory(t, categoryFaction, categoryNonFaction) &&
        matchesExtraCondition(t, extraWith, extraWithout) &&
        matchesDifficulty(t, difficultyFilter)
    );
    return list;
  }, [search, categoryFaction, categoryNonFaction, extraWith, extraWithout, difficultyFilter]);

  const sortedTasks = useMemo(() => sortTasks(filteredTasks, sortBy), [filteredTasks, sortBy]);

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
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          <span>Фильтры</span>
          <span className={`shrink-0 transition-transform ${filtersOpen ? "rotate-180" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
        {filtersOpen && (
          <div className="mt-2 space-y-4 rounded-lg border border-slate-600 bg-slate-800/60 p-4">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-400">Категория</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryFaction}
                    onChange={(e) => setCategoryFaction(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-300">Фракционные</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryNonFaction}
                    onChange={(e) => setCategoryNonFaction(e.target.checked)}
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
                    checked={extraWith}
                    onChange={(e) => setExtraWith(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-sm text-slate-300">С доп. условием</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    checked={extraWithout}
                    onChange={(e) => setExtraWithout(e.target.checked)}
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
                  onClick={() => setDifficultyFilter("")}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    !difficultyFilter ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Все
                </button>
                {DIFFICULTY_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficultyFilter(d)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      difficultyFilter === d ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
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
                    onClick={() => setSortBy(key)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      sortBy === key ? "bg-amber-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {key === "default" ? "По умолчанию" : key === "bp" ? "По BP" : "По времени"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={addAllToFavorites}
          className="flex-1 rounded-lg bg-amber-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-amber-500"
        >
          Добавить все в избранное
        </button>
        <button
          onClick={clearAllFavorites}
          className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-700"
        >
          Очистить избранное
        </button>
      </div>

      <ul className="space-y-2">
        {sortedTasks.map((task) => {
          const isFavorite = favoriteIds.includes(task.id);
          const isCompleted = task.repeatable
            ? (completedCounts[task.id] ?? 0) > 0
            : completedIds.includes(task.id);
          const repeatCount = task.repeatable ? (completedCounts[task.id] ?? 0) : 0;
          return (
            <li
              key={task.id}
              className={`flex flex-col gap-2 rounded-lg px-4 py-3 transition sm:flex-row sm:items-center sm:gap-3 ${
                isCompleted
                  ? "bg-slate-700/60 text-slate-500"
                  : "bg-slate-800/80 text-slate-200"
              }`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:min-w-[8rem]">
                <button
                  type="button"
                  onClick={() => toggleFavorite(task.id)}
                  className="cursor-pointer shrink-0 p-1 transition hover:opacity-80"
                  aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
                >
                  <StarIcon filled={isFavorite} />
                </button>
                <span className={`min-w-0 flex-1 truncate ${isCompleted ? "line-through" : ""}`}>{task.name}</span>
              </div>
              <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0">
                <span className="font-mono text-sm text-amber-400/90">
                  {task.bpWithoutVip} / {task.bpWithVip} BP
                </span>
                {task.category === "Фракционные" && (
                  <span className="rounded bg-violet-600/30 px-1.5 py-0.5 text-xs text-violet-300">
                    Фракционные
                  </span>
                )}
                {task.difficulty && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-xs ${
                      task.difficulty === "Очень быстро"
                        ? "bg-emerald-500/25 text-emerald-200"
                        : task.difficulty === "Быстро"
                          ? "bg-emerald-600/30 text-emerald-300"
                          : task.difficulty === "Средне"
                            ? "bg-amber-600/30 text-amber-300"
                            : task.difficulty === "Долго"
                              ? "bg-rose-600/30 text-rose-300"
                              : "bg-rose-700/40 text-rose-200"
                    }`}
                  >
                    {task.difficulty}
                  </span>
                )}
                {task.extraCondition && (
                  <ExtraConditionTag text={task.extraCondition} />
                )}
                {isCompleted && (
                  <span className="shrink-0 rounded bg-emerald-600/80 px-2 py-0.5 text-xs text-white">
                    {task.repeatable && repeatCount > 0 ? `Выполнено ${repeatCount} раз` : "Выполнено"}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
