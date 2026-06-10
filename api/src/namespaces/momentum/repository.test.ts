import { expect, it, describe } from "bun:test";
import { createMomentumRepository } from "./repository";
import type { CommitRecord } from "./repository";

function makeCommitRecord(overrides: Partial<CommitRecord> = {}): CommitRecord {
  return {
    id: overrides.id ?? "test-id",
    userId: overrides.userId ?? "test-user",
    kind: overrides.kind ?? "Habit",
    instanceId: overrides.instanceId ?? "habit-1",
    timestamp: overrides.timestamp ?? Date.now(),
    event: overrides.event ?? "COUNT_UP",
    data: overrides.data,
    reward: overrides.reward,
  };
}

describe("MomentumRepository", () => {
  describe("addCommitRecord", () => {
    it("adds a commit record and returns it with an id", async () => {
      const repo = createMomentumRepository({});
      const record = await repo.addCommitRecord({
        userId: "user-1",
        kind: "Habit",
        instanceId: "habit-1",
        timestamp: Date.now(),
        event: "COUNT_UP",
      });
      expect(record.id).toBeDefined();
      expect(record.userId).toBe("user-1");
    });

    it("preserves a provided id", async () => {
      const repo = createMomentumRepository({});
      const record = await repo.addCommitRecord({
        id: "custom-id",
        userId: "user-1",
        kind: "Habit",
        instanceId: "habit-1",
        timestamp: Date.now(),
        event: "COUNT_UP",
      });
      expect(record.id).toBe("custom-id");
    });
  });

  describe("getCommitRecords", () => {
    it("returns provided records filtered by window", async () => {
      const repo = createMomentumRepository({});
      const oldRecord = makeCommitRecord({
        id: "old",
        timestamp: Date.now() - 30 * 86_400_000,
      });
      const newRecord = makeCommitRecord({
        id: "new",
        timestamp: Date.now() - 1 * 86_400_000,
      });
      const records = await repo.getCommitRecords("test-user", 7, [
        oldRecord,
        newRecord,
      ]);
      expect(records).toHaveLength(1);
      expect(records[0]?.id).toBe("new");
    });

    it("returns empty array when no records match window", async () => {
      const repo = createMomentumRepository({});
      const oldRecord = makeCommitRecord({
        timestamp: Date.now() - 30 * 86_400_000,
      });
      const records = await repo.getCommitRecords("test-user", 7, [oldRecord]);
      expect(records).toHaveLength(0);
    });

    it("returns empty array when no records exist", async () => {
      const repo = createMomentumRepository({});
      const records = await repo.getCommitRecords("test-user", 7);
      expect(records).toEqual([]);
    });
  });

  describe("getHabits", () => {
    it("derives habits from habit commit events", async () => {
      const repo = createMomentumRepository({});
      const records = [
        makeCommitRecord({
          instanceId: "habit-1",
          event: "COUNT_UP",
          data: { count: 3 },
          timestamp: Date.now(),
        }),
        makeCommitRecord({
          instanceId: "habit-1",
          event: "COUNT_UP",
          data: { count: 2 },
          timestamp: Date.now(),
        }),
        makeCommitRecord({
          instanceId: "habit-2",
          event: "DAILYCHECK",
          timestamp: Date.now(),
        }),
      ];
      const habits = await repo.getHabits("test-user", 7, records);
      expect(habits).toHaveLength(2);
      expect(habits[0]?.id).toBe("habit-1");
    });

    it("aggregates history per day per habit", async () => {
      const repo = createMomentumRepository({});
      const today = new Date();
      const records = [
        makeCommitRecord({
          id: "1",
          instanceId: "habit-1",
          event: "COUNT_UP",
          data: { count: 3 },
          timestamp: today.getTime(),
        }),
        makeCommitRecord({
          id: "2",
          instanceId: "habit-1",
          event: "COUNT_UP",
          data: { count: 2 },
          timestamp: today.getTime(),
        }),
      ];
      const habits = await repo.getHabits("test-user", 7, records);
      expect(habits).toHaveLength(1);

      const day = today.toISOString().slice(0, 10);
      expect(habits[0]?.history[day]).toBe(5);
    });

    it("handles progress.logged legacy events", async () => {
      const repo = createMomentumRepository({});
      const records = [
        makeCommitRecord({
          kind: "Progress",
          event: "progress.logged",
          data: { amount: 3 },
        }),
      ];
      const habits = await repo.getHabits("test-user", 7, records);
      expect(habits).toHaveLength(1);
    });

    it("ignores non-habit events when deriving habits", async () => {
      const repo = createMomentumRepository({});
      const records = [
        makeCommitRecord({
          kind: "Todo",
          event: "COMPLETED",
          instanceId: "todo-1",
        }),
      ];
      const habits = await repo.getHabits("test-user", 7, records);
      expect(habits).toHaveLength(0);
    });
  });

  describe("getPreviousSnapshot", () => {
    it("returns undefined when no DB is available", async () => {
      const repo = createMomentumRepository({});
      const snapshot = await repo.getPreviousSnapshot("test-user", 7);
      expect(snapshot).toBeUndefined();
    });
  });

  describe("saveSnapshot", () => {
    it("skips save for demo users", async () => {
      const repo = createMomentumRepository({});
      const snapshot = {
        id: "test",
        userId: "demo-user",
        windowDays: 7,
        createdAt: new Date(),
        score: 75,
      };
      // Demo users are skipped silently
      await repo.saveSnapshot(snapshot);
    });
  });
});
