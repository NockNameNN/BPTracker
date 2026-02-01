import type { Difficulty } from "./types";
import type { Task } from "./types";
import { TASKS } from "./tasks.data";

export { TASKS } from "./tasks.data";

export type SortBy = "default" | "bp" | "difficulty";

const DIFFICULTY_ORDER: Record<Difficulty, number> = {
  "Очень быстро": 0,
  Быстро: 1,
  Средне: 2,
  Долго: 3,
  "Очень долго": 4,
};

export function getDifficultySortOrder(task: Task): number {
  return task.difficulty != null ? DIFFICULTY_ORDER[task.difficulty] : 5;
}

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  if (sortBy === "default") return [...tasks];
  if (sortBy === "bp") {
    return [...tasks].sort((a, b) => b.bpWithoutVip - a.bpWithoutVip);
  }
  return [...tasks].sort(
    (a, b) => getDifficultySortOrder(a) - getDifficultySortOrder(b)
  );
}

export const DIFFICULTY_OPTIONS = ["Очень быстро", "Быстро", "Средне", "Долго", "Очень долго"] as const;

export const getTaskById = (id: number): Task | undefined =>
  TASKS.find((t) => t.id === id);

export const getTasksByIds = (ids: number[]): Task[] =>
  ids.map((id) => getTaskById(id)).filter((t): t is Task => t !== undefined);

export const getCategories = (): string[] => {
  const cats = new Set(TASKS.map((t) => t.category).filter(Boolean));
  return Array.from(cats) as string[];
};

export function matchesCategory(
  task: Task,
  factionChecked: boolean,
  nonFactionChecked: boolean
): boolean {
  if (!factionChecked && !nonFactionChecked) return true;
  return (
    (factionChecked && task.category === "Фракционные") ||
    (nonFactionChecked && task.category !== "Фракционные")
  );
}

export function matchesExtraCondition(
  task: Task,
  withExtraChecked: boolean,
  withoutExtraChecked: boolean
): boolean {
  if (!withExtraChecked && !withoutExtraChecked) return true;
  return (
    (withExtraChecked && Boolean(task.extraCondition)) ||
    (withoutExtraChecked && !task.extraCondition)
  );
}

export function matchesDifficulty(task: Task, difficultyFilter: string): boolean {
  if (!difficultyFilter) return true;
  return task.difficulty === difficultyFilter;
}
