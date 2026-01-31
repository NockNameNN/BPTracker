"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { TASKS, getCategories } from "@/lib/tasks";

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
    toggleFavorite,
    setFavoriteIds,
  } = useTracker();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const categories = useMemo(() => getCategories(), []);

  const filteredTasks = useMemo(() => {
    let list = TASKS;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((t) => t.name.toLowerCase().includes(q));
    }
    if (categoryFilter) {
      list = list.filter((t) => t.category === categoryFilter);
    }
    return list;
  }, [search, categoryFilter]);

  const grouped = useMemo(() => {
    const byCategory: Record<string, typeof TASKS> = { daily: [] };
    for (const task of filteredTasks) {
      const key = task.category ?? "daily";
      if (!byCategory[key]) byCategory[key] = [];
      byCategory[key].push(task);
    }
    const order = ["daily", ...categories];
    return order.filter((c) => byCategory[c]?.length).map((c) => ({ category: c === "daily" ? "Ежедневные" : c, tasks: byCategory[c] }));
  }, [filteredTasks, categories]);

  const addAllToFavorites = () => {
    const ids = new Set(favoriteIds);
    filteredTasks.forEach((t) => ids.add(t.id));
    setFavoriteIds(Array.from(ids));
  };

  const clearAllFavorites = () => setFavoriteIds([]);

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-600"
        >
          ← На главную
        </Link>
        <h1 className="text-xl font-bold text-white">Все задания</h1>
        <div className="w-24" />
      </div>

      <input
        type="search"
        placeholder="Поиск по названию..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
      />

      {categories.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setCategoryFilter("")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              !categoryFilter
                ? "bg-amber-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            Все
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                categoryFilter === cat
                  ? "bg-amber-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

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

      <div className="space-y-6">
        {grouped.map(({ category, tasks }) => (
          <section key={category}>
            <h2 className="mb-2 text-lg font-semibold text-slate-300">{category}</h2>
            <ul className="space-y-2">
              {tasks.map((task) => {
                const isFavorite = favoriteIds.includes(task.id);
                const isCompleted = completedIds.includes(task.id);
                return (
                  <li
                    key={task.id}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                      isCompleted
                        ? "bg-slate-700/60 text-slate-500"
                        : "bg-slate-800/80 text-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFavorite(task.id)}
                      className="shrink-0 p-1 transition hover:opacity-80"
                      aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
                    >
                      <StarIcon filled={isFavorite} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <span className={isCompleted ? "line-through" : ""}>{task.name}</span>
                      <div className="mt-0.5 font-mono text-sm text-amber-400/90">
                        {task.bpWithoutVip} / {task.bpWithVip} BP
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="shrink-0 rounded bg-emerald-600/80 px-2 py-0.5 text-xs text-white">
                        Выполнено
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
