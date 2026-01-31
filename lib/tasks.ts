import type { Difficulty } from "./types";
import { Task } from "./types";

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

export const TASKS: Task[] = [
  { id: 1, name: "3 часа онлайн (многократно)", bpWithoutVip: 2, bpWithVip: 4, repeatable: true, maxRepeatCount: 8 },
  { id: 2, name: "Нули в казино", bpWithoutVip: 2, bpWithVip: 4, extraCondition: "Нужен 3 уровень" },
  { id: 3, name: "25 действий на стройке", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Средне" },
  { id: 4, name: "25 действий в порту", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Средне" },
  { id: 5, name: "25 действий в шахте", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Средне" },
  { id: 6, name: "3 победы в Дэнс Баттлах", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Быстро", extraCondition: "Нужен напарник" },
  { id: 7, name: "Заказ материалов для бизнеса вручную (просто прожать вкл/выкл)", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Очень быстро", extraCondition: "Нужен бизнес" },
  { id: 8, name: "20 подходов в тренажерном зале", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне" },
  { id: 9, name: "Успешная тренировка в тире", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 10, name: "10 посылок на почте", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне" },
  { id: 11, name: "Арендовать киностудию", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Быстро", extraCondition: "Нужно 10К" },
  { id: 12, name: "Купить лотерейный билет", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Очень быстро" },
  { id: 13, name: "Выиграть гонку в картинге", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне" },
  { id: 14, name: "10 действий на ферме (10 коров, 10 пшеницы и т.д. - один любой способ в день)", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне", extraCondition: "Один любой способ в день" },
  { id: 15, name: "Потушить 25 пожаров", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Долго", extraCondition: "Нужен 10 уровень и военный билет" },
  { id: 16, name: "Выкопать 1 сокровище (не мусор)", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне", extraCondition: "Нужен металлоискатель" },
  { id: 17, name: "Проехать 1 уличную гонку (через регистрацию в телефоне, ставка минимум 1000$)", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 18, name: "Выполнить 3 заказа дальнобойщиком", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Долго", extraCondition: "Нужен 7 уровень" },
  { id: 19, name: "Два раза оплатить смену внешности у хирурга в EMS", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Быстро", extraCondition: "Нужны бабки" },
  { id: 20, name: "Добавить 5 видео в кинотеатре", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 21, name: "Выиграть 5 игр в тренировочном комплексе со ставкой (от 100$)", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне"},
  { id: 22, name: "Выиграть 3 любых игры на арене со ставкой (от 100$)", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Средне"},
  { id: 23, name: "2 круга на любом маршруте автобусника", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Долго" },
  { id: 24, name: "5 раз снять 100% шкуру с животных", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Долго", extraCondition: "Нужны ружьё, патроны и нож" },
  { id: 25, name: "Посетить любой сайт в браузере", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Очень быстро" },
  { id: 26, name: "Зайти в любой канал в Brawl", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Очень быстро" },
  { id: 27, name: "Поставить лайк любой анкете в Match", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Очень быстро" },
  { id: 28, name: "Прокрутить за DP серебрянный, золотой или driver кейс", bpWithoutVip: 10, bpWithVip: 20, difficulty: "Очень быстро", extraCondition: "Нужна валюта для покупки" },
  { id: 29, name: "Кинуть мяч питомцу 15 раз", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Очень быстро", extraCondition: "Нужен питомец" },
  { id: 30, name: "15 выполненных питомцем команд", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Долго", extraCondition: "Нужен питомец" },
  { id: 31, name: "Ставка в колесе удачи в казино (межсерверное колесо)", bpWithoutVip: 3, bpWithVip: 6, difficulty: "Быстро", extraCondition: "Нужно 10К" },
  { id: 32, name: "Проехать 1 станцию на метро", bpWithoutVip: 2, bpWithVip: 4, difficulty: "Средне" },
  { id: 33, name: "Поймать 20 рыб", bpWithoutVip: 4, bpWithVip: 8, difficulty: "Средне" },
  { id: 34, name: "Выполнить 2 квеста любых клубов", bpWithoutVip: 4, bpWithVip: 8, difficulty: "Очень долго", extraCondition: "Нужен 10 уровень для вступления в клуб" },
  { id: 35, name: "Починить деталь в автосервисе", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 36, name: "Забросить 2 мяча в баскетболе", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 37, name: "Забить 2 гола в футболе", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 38, name: "Победить в армрестлинге", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро", extraCondition: "Нужен напарник" },
  { id: 39, name: "Победить в дартс", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 40, name: "Поиграть 1 минуту в волейбол", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 41, name: "Поиграть 1 минуту в настольный теннис", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 42, name: "Поиграть 1 минуту в большой теннис", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Быстро" },
  { id: 43, name: "Сыграть в мафию в казино", bpWithoutVip: 3, bpWithVip: 6, difficulty: "Быстро", extraCondition: "Нужен напарник" },
  { id: 44, name: "Сделать платеж по лизингу", bpWithoutVip: 1, bpWithVip: 2, difficulty: "Очень долго", extraCondition: "Нужен лизинг и бабки" },
  { id: 45, name: "Посадить траву в теплице", bpWithoutVip: 4, bpWithVip: 8, category: "Фракционные", difficulty: "Быстро" },
  { id: 46, name: "Запустить переработку обезболивающих в лаборатории", bpWithoutVip: 4, bpWithVip: 8, category: "Фракционные", difficulty: "Быстро" },
  { id: 47, name: "Принять участие в двух аирдропах", bpWithoutVip: 4, bpWithVip: 8, category: "Фракционные", difficulty: "Очень долго" },
  { id: 48, name: "Починить чужой автомобиль в автосервисе с прочностью детали ниже 90%", bpWithoutVip: 4, bpWithVip: 8 },
  { id: 49, name: "7 закрашенных граффити", bpWithoutVip: 1, bpWithVip: 2, category: "Фракционные", difficulty: "Средне" },
  { id: 50, name: "Сдать 5 контрабанды", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные", difficulty: "Долго" },
  { id: 51, name: "Участие в каптах/бизварах", bpWithoutVip: 1, bpWithVip: 2, category: "Фракционные" },
  { id: 52, name: "Сдать Хаммер с ВЗХ", bpWithoutVip: 3, bpWithVip: 6, category: "Фракционные" },
  { id: 53, name: "5 выданных медкарт в EMS", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные" },
  { id: 54, name: "Закрыть 15 вызовов в EMS", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные" },
  { id: 55, name: "Отредактировать 40 объявлений в WN", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные" },
  { id: 56, name: "Взломать 15 замков на ограблениях домов или автоугонах", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные" },
  { id: 57, name: "Закрыть 5 кодов в силовых структурах", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные" },
  { id: 58, name: "Поставить на учет 2 автомобиля (для LSPD)", bpWithoutVip: 1, bpWithVip: 2, category: "Фракционные" },
  { id: 59, name: "Произвести 1 арест в КПЗ", bpWithoutVip: 1, bpWithVip: 2, category: "Фракционные" },
  { id: 60, name: "Выкупить двух человек из КПЗ", bpWithoutVip: 2, bpWithVip: 4, category: "Фракционные" },
];

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
