import { expect, it, describe } from "bun:test";
import { calculateStreak } from "./lib";

describe("calculateStreak", () => {
  it("returns 0 when no history exists", () => {
    const streak = calculateStreak({}, 100);
    expect(streak).toBe(0);
  });

  it("counts consecutive days meeting the target", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const xpHistory: Record<string, number> = {
      // Only add yesterday and before — today may be partial
    };
    xpHistory[yesterday.toISOString().slice(0, 10)] = 150;
    xpHistory[twoDaysAgo.toISOString().slice(0, 10)] = 200;

    const streak = calculateStreak(xpHistory, 100);
    expect(streak).toBeGreaterThanOrEqual(1);
  });

  it("breaks streak when xp is below target", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const xpHistory: Record<string, number> = {};
    xpHistory[yesterday.toISOString().slice(0, 10)] = 50; // below target of 100

    const streak = calculateStreak(xpHistory, 100);
    expect(streak).toBe(0);
  });

  it("counts today if target met", () => {
    const today = new Date();
    const todayStamp = today.toISOString().slice(0, 10);
    const xpHistory: Record<string, number> = {
      [todayStamp]: 200,
    };
    const streak = calculateStreak(xpHistory, 100);
    expect(streak).toBe(1);
  });
});
