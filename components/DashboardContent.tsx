"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { useSetups } from "@/context/SetupsContext";
import { getTasksByIds, DIFFICULTY_OPTIONS, matchesCategory, matchesExtraCondition, matchesDifficulty, sortTasks, type SortBy } from "@/lib/tasks";
import { ExtraConditionTag } from "./ExtraConditionTag";
import { ResetTimer } from "./ResetTimer";

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
  const [categoryFaction, setCategoryFaction] = useState(false);
  const [categoryNonFaction, setCategoryNonFaction] = useState(false);
  const [extraWith, setExtraWith] = useState(false);
  const [extraWithout, setExtraWithout] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [setupsOpen, setSetupsOpen] = useState(false);
  const [setupName, setSetupName] = useState("");

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

      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setSetupsOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-200 transition hover:bg-slate-700"
        >
          <span>Сетапы</span>
          <span className={`shrink-0 transition-transform ${setupsOpen ? "rotate-180" : ""}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
        {setupsOpen && (
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
                  className="w-full rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-slate-200 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  addSetup(setupName, favoriteIds);
                  setSetupName("");
                }}
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
                  const setupTasks = getTasksByIds(setup.favoriteIds);
                  const setupMaxBp = setupTasks.reduce((sum, t) => {
                    const bp = isVip ? t.bpWithVip : t.bpWithoutVip;
                    if (t.repeatable && t.maxRepeatCount != null) {
                      return sum + t.maxRepeatCount * bp;
                    }
                    return sum + bp;
                  }, 0);
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
                        onClick={() => setFavoriteIds(setup.favoriteIds)}
                        className="cursor-pointer rounded bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-500"
                      >
                        Применить
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSetup(setup.id)}
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
                    className="flex flex-col gap-2 rounded-lg bg-slate-800/80 px-4 py-3 transition sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
                  >
                    <span className="min-w-0 flex-1 break-words text-slate-200 sm:min-w-[8rem]">{task.name}</span>
                    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0">
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
                      </label>
                      <span className="font-mono font-medium text-amber-400">
                        {count * bp} BP
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(task.id)}
                        title="Убрать из избранного"
                        className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                          <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                );
              }
              const done = completedIds.includes(task.id);
              return (
                <li
                  key={task.id}
                  className={`flex flex-col gap-2 rounded-lg px-4 py-3 transition sm:flex-row sm:items-center sm:gap-3 ${
                    done
                      ? "bg-slate-700/60 text-slate-500 line-through"
                      : "bg-slate-800/80 text-slate-200"
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:min-w-[8rem]">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggleCompleted(task.id)}
                      className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="min-w-0 flex-1 break-words">{task.name}</span>
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0">
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
                    <button
                      type="button"
                      onClick={() => toggleFavorite(task.id)}
                      title="Убрать из избранного"
                      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
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
          Сбросить
        </button>
      )}
    </div>
  );
}
