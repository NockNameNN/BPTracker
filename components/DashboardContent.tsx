"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { getTasksByIds, DIFFICULTY_OPTIONS, matchesCategory, matchesExtraCondition, matchesDifficulty, sortTasks, type SortBy } from "@/lib/tasks";
import { ExtraConditionTag } from "./ExtraConditionTag";
import { ResetTimer } from "./ResetTimer";

export function DashboardContent() {
  const {
    favoriteIds,
    completedIds,
    completedCounts,
    isVip,
    toggleCompleted,
    setCompletedCount,
    setIsVip,
    resetDay,
  } = useTracker();
  const [categoryFaction, setCategoryFaction] = useState(false);
  const [categoryNonFaction, setCategoryNonFaction] = useState(false);
  const [extraWith, setExtraWith] = useState(false);
  const [extraWithout, setExtraWithout] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const favorites = getTasksByIds(favoriteIds);
  const filteredFavorites = favorites.filter(
    (t) =>
      matchesCategory(t, categoryFaction, categoryNonFaction) &&
      matchesExtraCondition(t, extraWith, extraWithout) &&
      matchesDifficulty(t, difficultyFilter)
  );
  const sortedFavorites = useMemo(
    () => sortTasks(filteredFavorites, sortBy),
    [filteredFavorites, sortBy]
  );
  const totalBp = favorites.reduce((sum, t) => {
    const bp = isVip ? t.bpWithVip : t.bpWithoutVip;
    if (t.repeatable) {
      return sum + ((completedCounts[t.id] ?? 0) * bp);
    }
    return sum + (completedIds.includes(t.id) ? bp : 0);
  }, 0);
  const maxBp = favorites.reduce((sum, t) => {
    const bp = isVip ? t.bpWithVip : t.bpWithoutVip;
    if (t.repeatable) {
      return sum + ((completedCounts[t.id] ?? 0) * bp);
    }
    return sum + bp;
  }, 0);
  const completedCount = favorites.filter((t) =>
    t.repeatable ? (completedCounts[t.id] ?? 0) > 0 : completedIds.includes(t.id)
  ).length;
  const filteredCompletedCount = filteredFavorites.filter((t) =>
    t.repeatable ? (completedCounts[t.id] ?? 0) > 0 : completedIds.includes(t.id)
  ).length;

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

      <div className="rounded-xl bg-slate-800/80 p-6 shadow-lg">
        <div className="mb-4 text-center">
          <span className="text-5xl font-bold tabular-nums text-amber-400">
            {totalBp}
          </span>
          {maxBp > 0 && (
            <span className="ml-2 text-xl text-slate-400">
              / {maxBp} BP сегодня
            </span>
          )}
          {maxBp === 0 && (
            <span className="ml-2 text-xl text-slate-400">BP</span>
          )}
        </div>
        {maxBp > 0 && (
            <div className="mb-4 h-3 overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-300 ease-out"
                style={{
                  width: `${maxBp > 0 ? Math.min(100, (totalBp / maxBp) * 100) : 0}%`,
                }}
              />
            </div>
        )}
        <label className="flex cursor-pointer items-center justify-center gap-2">
          <input
            type="checkbox"
            checked={isVip}
            onChange={(e) => setIsVip(e.target.checked)}
            className="h-5 w-5 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
          />
          <span className="text-slate-200">У меня VIP статус</span>
        </label>
      </div>

      <ResetTimer />

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
          <div className="mb-3">
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
                const rawCount = completedCounts[task.id] ?? 0;
                const count = task.maxRepeatCount != null ? Math.min(rawCount, task.maxRepeatCount) : rawCount;
                return (
                  <li
                    key={task.id}
                    className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-800/80 px-4 py-3 transition"
                  >
                    <span className="min-w-0 flex-1 text-slate-200">{task.name}</span>
                    <div className="flex shrink-0 items-center gap-2">
                      {task.category === "Фракционные" && (
                        <span className="rounded bg-violet-600/30 px-1.5 py-0.5 text-xs text-violet-300">
                          Фракционные
                        </span>
                      )}
                      {task.extraCondition && (
                        <ExtraConditionTag text={task.extraCondition} />
                      )}
                      <label className="flex items-center gap-1.5 text-sm text-slate-400">
                        раз:
                        <input
                          type="number"
                          min={0}
                          max={task.maxRepeatCount ?? undefined}
                          value={count || ""}
                          onChange={(e) => {
                            const v = e.target.value;
                            const raw = v === "" ? 0 : parseInt(v, 10);
                            const cap = task.maxRepeatCount != null ? Math.min(Math.max(0, raw), task.maxRepeatCount) : Math.max(0, raw);
                            setCompletedCount(task.id, cap);
                          }}
                          className="w-14 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-center text-slate-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        {task.maxRepeatCount != null && (
                          <span className="text-slate-500">макс. {task.maxRepeatCount}</span>
                        )}
                      </label>
                      <span className="font-mono font-medium text-amber-400">
                        {count * bp} BP
                      </span>
                    </div>
                  </li>
                );
              }
              const done = completedIds.includes(task.id);
              return (
                <li
                  key={task.id}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                    done
                      ? "bg-slate-700/60 text-slate-500 line-through"
                      : "bg-slate-800/80 text-slate-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={done}
                    onChange={() => toggleCompleted(task.id)}
                    className="h-5 w-5 shrink-0 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="min-w-0 flex-1">{task.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
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
                    <span className="font-mono font-medium text-amber-400">
                      {bp} BP
                    </span>
                  </div>
                </li>
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
          Сбросить день
        </button>
      )}
    </div>
  );
}
