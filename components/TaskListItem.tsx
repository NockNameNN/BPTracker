"use client";

import { ExtraConditionTag } from "./ExtraConditionTag";
import type { Task } from "@/lib/types";

const DIFFICULTY_STYLES: Record<string, string> = {
  "Очень быстро": "bg-emerald-500/25 text-emerald-200",
  "Быстро": "bg-emerald-600/30 text-emerald-300",
  "Средне": "bg-amber-600/30 text-amber-300",
  "Долго": "bg-rose-600/30 text-rose-300",
  "Очень долго": "bg-rose-700/40 text-rose-200",
};

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

interface TaskListItemProps {
  task: Task;
  isFavorite: boolean;
  isCompleted: boolean;
  repeatCount: number;
  onToggleFavorite: () => void;
}

export function TaskListItem({
  task,
  isFavorite,
  isCompleted,
  repeatCount,
  onToggleFavorite,
}: TaskListItemProps) {
  return (
    <li
      className={`flex flex-col gap-2 rounded-lg px-4 py-3 transition sm:flex-row sm:items-center sm:gap-3 ${
        isCompleted
          ? "bg-slate-700/60 text-slate-500"
          : "bg-slate-800/80 text-slate-200"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:min-w-[8rem]">
        <button
          type="button"
          onClick={onToggleFavorite}
          className="cursor-pointer shrink-0 p-1 transition hover:opacity-80"
          aria-label={isFavorite ? "Убрать из избранного" : "В избранное"}
        >
          <StarIcon filled={isFavorite} />
        </button>
        <span className={`min-w-0 flex-1 break-words ${isCompleted ? "line-through" : ""}`}>
          {task.name}
        </span>
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
              DIFFICULTY_STYLES[task.difficulty] ?? "bg-slate-600 text-slate-300"
            }`}
          >
            {task.difficulty}
          </span>
        )}
        {task.extraCondition && <ExtraConditionTag text={task.extraCondition} />}
        {isCompleted && (
          <span className="shrink-0 rounded bg-emerald-600/80 px-2 py-0.5 text-xs text-white">
            {task.repeatable && repeatCount > 0 ? `Выполнено ${repeatCount} раз` : "Выполнено"}
          </span>
        )}
      </div>
    </li>
  );
}
