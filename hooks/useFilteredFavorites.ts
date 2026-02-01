import { useMemo } from "react";
import {
  getTasksByIds,
  matchesCategory,
  matchesExtraCondition,
  matchesDifficulty,
  sortTasks,
  type SortBy,
} from "@/lib/tasks";

export interface FavoriteFilters {
  categoryFaction: boolean;
  categoryNonFaction: boolean;
  extraWith: boolean;
  extraWithout: boolean;
  difficultyFilter: string;
}

export function useFilteredFavorites(
  favoriteIds: number[],
  filters: FavoriteFilters,
  sortBy: SortBy,
  isVip: boolean,
  completedIds: number[],
  completedCounts: Record<number, number>
) {
  const favorites = useMemo(
    () => getTasksByIds(favoriteIds),
    [favoriteIds]
  );

  const filteredFavorites = useMemo(
    () =>
      favorites.filter(
        (t) =>
          matchesCategory(t, filters.categoryFaction, filters.categoryNonFaction) &&
          matchesExtraCondition(t, filters.extraWith, filters.extraWithout) &&
          matchesDifficulty(t, filters.difficultyFilter)
      ),
    [favorites, filters]
  );

  const sortedFavorites = useMemo(
    () => sortTasks(filteredFavorites, sortBy),
    [filteredFavorites, sortBy]
  );

  const { totalBp, maxBp } = useMemo(() => {
    let total = 0;
    let max = 0;
    for (const t of favorites) {
      const bp = isVip ? t.bpWithVip : t.bpWithoutVip;
      if (t.repeatable) {
        const count = completedCounts[t.id] ?? 0;
        total += count * bp;
        max += count * bp;
      } else {
        if (completedIds.includes(t.id)) total += bp;
        max += bp;
      }
    }
    return { totalBp: total, maxBp: max };
  }, [favorites, isVip, completedIds, completedCounts]);

  const completedCount = useMemo(
    () =>
      favorites.filter((t) =>
        t.repeatable ? (completedCounts[t.id] ?? 0) > 0 : completedIds.includes(t.id)
      ).length,
    [favorites, completedIds, completedCounts]
  );

  const filteredCompletedCount = useMemo(
    () =>
      filteredFavorites.filter((t) =>
        t.repeatable ? (completedCounts[t.id] ?? 0) > 0 : completedIds.includes(t.id)
      ).length,
    [filteredFavorites, completedIds, completedCounts]
  );

  return {
    favorites,
    filteredFavorites,
    sortedFavorites,
    totalBp,
    maxBp,
    completedCount,
    filteredCompletedCount,
  };
}

export function computeSetupMaxBp(
  favoriteIds: number[],
  isVip: boolean
): number {
  const tasks = getTasksByIds(favoriteIds);
  return tasks.reduce((sum, t) => {
    const bp = isVip ? t.bpWithVip : t.bpWithoutVip;
    if (t.repeatable && t.maxRepeatCount != null) {
      return sum + t.maxRepeatCount * bp;
    }
    return sum + bp;
  }, 0);
}
