export type Difficulty = "Очень быстро" | "Быстро" | "Средне" | "Долго" | "Очень долго";

export interface Task {
  id: number;
  name: string;
  bpWithoutVip: number;
  bpWithVip: number;
  category?: string;
  difficulty?: Difficulty;
  repeatable?: boolean;
  maxRepeatCount?: number;
  extraCondition?: string;
}

export interface TrackerState {
  favoriteIds: number[];
  completedIds: number[];
  completedCounts: Record<number, number>;
  isVip: boolean;
  isX2Server: boolean;
  lastResetDate: string;
}

export interface Setup {
  id: string;
  name: string;
  favoriteIds: number[];
}
