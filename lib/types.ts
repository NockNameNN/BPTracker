export interface Task {
  id: number;
  name: string;
  bpWithoutVip: number;
  bpWithVip: number;
  category?: string;
}

export interface TrackerState {
  favoriteIds: number[];
  completedIds: number[];
  isVip: boolean;
  lastResetDate: string;
}
