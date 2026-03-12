import { describe, expect, it } from "vitest";
import { applyXp, progressionSummary, xpRequiredForLevel } from "@/lib/xp-engine";

describe("xp-engine", () => {
  it("returns the base xp requirement for level 1", () => {
    expect(xpRequiredForLevel(1)).toBe(100);
  });

  it("increases xp requirement as levels rise", () => {
    expect(xpRequiredForLevel(2)).toBe(125);
    expect(xpRequiredForLevel(3)).toBe(150);
  });

  it("applies xp without leveling up when threshold is not met", () => {
    const result = applyXp(
      {
        level: 1,
        xp: 20,
        totalXp: 20,
      },
      30,
    );

    expect(result.level).toBe(1);
    expect(result.xp).toBe(50);
    expect(result.totalXp).toBe(50);
    expect(result.leveledUp).toBe(false);
    expect(result.levelsGained).toBe(0);
  });

  it("levels up and carries over remaining xp", () => {
    const result = applyXp(
      {
        level: 1,
        xp: 90,
        totalXp: 90,
      },
      20,
    );

    expect(result.level).toBe(2);
    expect(result.xp).toBe(10);
    expect(result.totalXp).toBe(110);
    expect(result.leveledUp).toBe(true);
    expect(result.levelsGained).toBe(1);
    expect(result.xpForNextLevel).toBe(125);
  });

  it("supports multiple level gains from a single reward", () => {
    const result = applyXp(
      {
        level: 1,
        xp: 0,
        totalXp: 0,
      },
      260,
    );

    expect(result.level).toBe(3);
    expect(result.xp).toBe(35);
    expect(result.totalXp).toBe(260);
    expect(result.levelsGained).toBe(2);
  });

  it("builds a progression summary with percentage", () => {
    const summary = progressionSummary({
      level: 2,
      xp: 50,
      totalXp: 150,
    });

    expect(summary.xpForNextLevel).toBe(125);
    expect(summary.progressPercentage).toBe(40);
  });

  it("throws for negative xp awards", () => {
    expect(() =>
      applyXp(
        {
          level: 1,
          xp: 0,
          totalXp: 0,
        },
        -1,
      ),
    ).toThrow("awardedXp must be a non-negative integer");
  });
}
