import { describe, expect, it } from "vitest";
import { computeMomentumSnapshot } from "./model";

const SAMPLE_HISTORY: Record<string, number> = {
  "2025-10-10": 320,
  "2025-10-09": 280,
  "2025-10-08": 340,
  "2025-10-07": 150,
  "2025-10-06": 400
};

describe("momentum snapshot", () => {
  it("computes a snapshot for the provided XP history", () => {
    const snapshot = computeMomentumSnapshot({ xpHistory: SAMPLE_HISTORY, dailyTarget: 300, windowDays: 5 });
    expect(snapshot.score).toBeGreaterThanOrEqual(0);
    expect(snapshot.history.length).toBeGreaterThan(0);
    expect(snapshot.explanation.factors.length).toBeGreaterThan(0);
  });
});
