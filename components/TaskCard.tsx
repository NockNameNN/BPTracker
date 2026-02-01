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

interface TaskCardBaseProps {
  task: Task;
  bp: number;
  onRemove: () => void;
}

function RemoveButton({ onRemove }: { onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      title="Убрать из избранного"
      className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-700 hover:text-red-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

export function TaskCardRepeatable({
  task,
  bp,
  count,
  onCountChange,
  onRemove,
}: TaskCardBaseProps & {
  count: number;
  onCountChange: (id: number, value: number) => void;
}) {
  const cappedCount = task.maxRepeatCount != null ? Math.min(count, task.maxRepeatCount) : count;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    const raw = v === "" ? 0 : parseInt(v, 10);
    const cap =
      task.maxRepeatCount != null
        ? Math.min(Math.max(0, raw), task.maxRepeatCount)
        : Math.max(0, raw);
    onCountChange(task.id, cap);
  };

  return (
    <li className="flex flex-col gap-2 rounded-lg bg-slate-800/80 px-4 py-3 transition sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
      <span className="min-w-0 flex-1 break-words text-slate-200 sm:min-w-[8rem]">{task.name}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-2 sm:shrink-0">
        {task.category === "Фракционные" && (
          <span className="rounded bg-violet-600/30 px-1.5 py-0.5 text-xs text-violet-300">
            Фракционные
          </span>
        )}
        {task.extraCondition && <ExtraConditionTag text={task.extraCondition} />}
        <label className="flex items-center gap-1.5 text-sm text-slate-400">
          раз:
          <input
            type="number"
            min={0}
            max={task.maxRepeatCount ?? undefined}
            value={cappedCount || ""}
            onChange={handleInputChange}
            className="w-14 rounded border border-slate-600 bg-slate-700 px-2 py-1 text-center text-slate-200 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
        </label>
        <span className="font-mono font-medium text-amber-400">{cappedCount * bp} BP</span>
        <RemoveButton onRemove={onRemove} />
      </div>
    </li>
  );
}

export function TaskCardDefault({
  task,
  bp,
  done,
  onToggleCompleted,
  onRemove,
}: TaskCardBaseProps & {
  done: boolean;
  onToggleCompleted: () => void;
}) {
  return (
    <li
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
          onChange={onToggleCompleted}
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
              DIFFICULTY_STYLES[task.difficulty] ?? "bg-slate-600 text-slate-300"
            }`}
          >
            {task.difficulty}
          </span>
        )}
        {task.extraCondition && <ExtraConditionTag text={task.extraCondition} />}
        <span className="font-mono font-medium text-amber-400">{bp} BP</span>
        <RemoveButton onRemove={onRemove} />
      </div>
    </li>
  );
}
