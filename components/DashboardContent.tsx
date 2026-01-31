"use client";

import Link from "next/link";
import { useTracker } from "@/context/TrackerContext";
import { getTasksByIds } from "@/lib/tasks";
import { ResetTimer } from "./ResetTimer";

export function DashboardContent() {
  const {
    favoriteIds,
    completedIds,
    isVip,
    toggleCompleted,
    setIsVip,
    resetDay,
  } = useTracker();

  const favorites = getTasksByIds(favoriteIds);
  const totalBp = favorites
    .filter((t) => completedIds.includes(t.id))
    .reduce((sum, t) => sum + (isVip ? t.bpWithVip : t.bpWithoutVip), 0);

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Bonus Points</h1>
        <Link
          href="/all-tasks"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500"
        >
          Все задания
        </Link>
      </div>

      <div className="rounded-xl bg-slate-800/80 p-6 shadow-lg">
        <div className="mb-4 text-center">
          <span className="text-5xl font-bold tabular-nums text-amber-400">
            {totalBp}
          </span>
          <span className="ml-2 text-xl text-slate-400">BP сегодня</span>
        </div>
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
          <h2 className="text-lg font-semibold text-slate-200">Ежедневные задания</h2>
          <ul className="space-y-2">
            {favorites.map((task) => {
              const done = completedIds.includes(task.id);
              const bp = isVip ? task.bpWithVip : task.bpWithoutVip;
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
                  <span className="shrink-0 font-mono font-medium text-amber-400">
                    {bp} BP
                  </span>
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
