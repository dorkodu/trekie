import { expect, it, describe } from "bun:test";
import { getDayDiff, isSameDay, daystamp } from "./index";

describe("getDayDiff", () => {
  it("calculates positive day differences", () => {
    const from = new Date("2024-01-01").getTime();
    const to = new Date("2024-01-10").getTime();
    expect(getDayDiff(from, to)).toBe(9);
  });

  it("returns 0 for the same day", () => {
    const date = new Date("2024-01-01").getTime();
    expect(getDayDiff(date, date)).toBe(0);
  });

  it("returns negative when to is before from", () => {
    const from = new Date("2024-01-10").getTime();
    const to = new Date("2024-01-01").getTime();
    expect(getDayDiff(from, to)).toBe(-9);
  });
});

describe("isSameDay", () => {
  it("returns true for two timestamps on the same day", () => {
    const t1 = new Date("2024-01-01T10:00:00").getTime();
    const t2 = new Date("2024-01-01T22:00:00").getTime();
    expect(isSameDay(t1, t2)).toBe(true);
  });

  it("returns false for different days", () => {
    const t1 = new Date("2024-01-01").getTime();
    const t2 = new Date("2024-01-02").getTime();
    expect(isSameDay(t1, t2)).toBe(false);
  });

  it("returns false when either argument is undefined", () => {
    expect(isSameDay(undefined, 1000)).toBe(false);
    expect(isSameDay(1000, undefined)).toBe(false);
  });
});

describe("daystamp", () => {
  describe("get", () => {
    it("returns today's daystamp by default", () => {
      const stamp = daystamp.get();
      expect(typeof stamp).toBe("string");
      expect(stamp.length).toBe(10);
    });

    it("converts a timestamp to daystamp", () => {
      const date = new Date("2024-06-15T12:00:00Z").getTime();
      const stamp = daystamp.get(date);
      expect(stamp.length).toBe(10);
      expect(stamp).toContain("2024");
    });
  });

  describe("fromDate", () => {
    it("converts a Date object to daystamp", () => {
      const stamp = daystamp.fromDate(new Date("2024-12-25T10:00:00"));
      expect(stamp.length).toBe(10);
      expect(stamp).toContain("12-25");
    });
  });

  describe("today", () => {
    it("returns a string in YYYY-MM-DD format", () => {
      const stamp = daystamp.today();
      expect(stamp).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("match", () => {
    it("returns true when daystamp matches timestamp", () => {
      const day = daystamp.get(new Date("2024-06-15T12:00:00Z").getTime());
      const date = new Date("2024-06-15T18:00:00Z").getTime();
      expect(daystamp.match(day, date)).toBe(true);
    });

    it("returns false when they differ", () => {
      const day = daystamp.get(new Date("2024-06-15T12:00:00Z").getTime());
      const date = new Date("2024-06-16T12:00:00Z").getTime();
      expect(daystamp.match(day, date)).toBe(false);
    });
  });
});
