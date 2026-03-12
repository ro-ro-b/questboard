export type ProgressionState = {
  level: number;
  xp: number;
  totalXp: number;
};

export type ProgressionResult = ProgressionState & {
  leveledUp: boolean;
  levelsGained: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
};

const BASE_XP_PER_LEVEL = 100;
const XP_GROWTH_PER_LEVEL = 25;

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) {
    return BASE_XP_PER_LEVEL;
  }

  return BASE_XP_PER_LEVEL + (level - 1) * XP_GROWTH_PER_LEVEL;
}

export function applyXp(state: ProgressionState, awardedXp: number): ProgressionResult {
  if (!Number.isInteger(awardedXp) || awardedXp < 0) {
    throw new Error("awardedXp must be a non-negative integer");
  }

  let level = Math.max(1, state.level);
  let xp = Math.max(0, state.xp) + awardedXp;
  const totalXp = Math.max(0, state.totalXp) + awardedXp;
  let levelsGained = 0;

  while (xp >= xpRequiredForLevel(level)) {
    xp -= xpRequiredForLevel(level);
    level += 1;
    levelsGained += 1;
  }

  return {
    level,
    xp,
    totalXp,
    leveledUp: levelsGained > 0,
    levelsGained,
    xpForCurrentLevel: xp,
    xpForNextLevel: xpRequiredForLevel(level),
  };
}

export function progressionSummary(state: ProgressionState) {
  const xpForNextLevel = xpRequiredForLevel(state.level);
  return {
    ...state,
    xpForCurrentLevel: state.xp,
    xpForNextLevel,
    progressPercentage: Math.min(100, Math.round((state.xp / xpForNextLevel) * 100)),
  };
}
