import { expect, it, describe } from "bun:test";
import { Commitment } from "./commitment";
import { CommitMessage, CommitReward, CommitmentInstance } from "./schema";

describe("Commitment factory", () => {
  it("creates a commitment module with name and events", () => {
    const habit = Commitment("Habit", {
      COUNT_UP: () => ({ xp: 10, coins: 1 }),
    });
    expect(habit.name).toBe("Habit");
    expect(habit.events.COUNT_UP).toBeDefined();
  });

  it("creates a status message", () => {
    const habit = Commitment("Habit", {
      COUNT_UP: () => ({ xp: 10, coins: 1 }),
    });
    const status = habit.status("COUNT_UP", "instance-1", { count: 3 });
    expect(status.kind).toBe("Habit");
    expect(status.event).toBe("COUNT_UP");
    expect(status.instanceId).toBe("instance-1");
    expect(status.data).toEqual({ count: 3 });
  });

  it("commits an event and returns reward", () => {
    const habit = Commitment("Habit", {
      COUNT_UP: () => ({ xp: 10, coins: 1 }),
    });
    const result = habit.commit("COUNT_UP", "instance-1", { count: 3 });
    expect(result.reward).toEqual({ xp: 10, coins: 1 });
  });

  it("creates a commitment instance", () => {
    const habit = Commitment("Habit", {
      COUNT_UP: () => ({ xp: 10, coins: 1 }),
    });
    const instance = habit.create({ userId: "user-1" });
    expect(instance.kind).toBe("Habit");
    expect(instance.userId).toBe("user-1");
    expect(instance.completedAt).toBeNull();
    expect(instance.isDeleted).toBe(false);
  });
});

describe("CommitMessage schema", () => {
  it("validates a valid commit message", () => {
    const msg = CommitMessage.parse({
      id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
      event: "COUNT_UP",
      kind: "Habit",
      instanceId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
      timestamp: Date.now(),
    });
    expect(msg.event).toBe("COUNT_UP");
  });

  it("rejects invalid ULIDs", () => {
    expect(() =>
      CommitMessage.parse({
        id: "not-ulid",
        event: "COUNT_UP",
        kind: "Habit",
        instanceId: "not-ulid",
        timestamp: Date.now(),
      })
    ).toThrow();
  });
});

describe("CommitReward schema", () => {
  it("validates a reward object", () => {
    const reward = CommitReward.parse({ xp: 100, coins: 5 });
    expect(reward.xp).toBe(100);
    expect(reward.coins).toBe(5);
  });

  it("rejects non-numeric xp", () => {
    expect(() => CommitReward.parse({ xp: "lots", coins: 5 })).toThrow();
  });
});

describe("CommitmentInstance schema", () => {
  it("validates a commitment instance", () => {
    const instance = CommitmentInstance.parse({
      id: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
      kind: "Habit",
      completedAt: null,
      userId: "01ARZ3NDEKTSV4RRFFQ69G5FAV",
      createdAt: Date.now(),
      lastActivity: Date.now(),
      isDeleted: false,
    });
    expect(instance.isDeleted).toBe(false);
  });

  it("rejects missing required fields", () => {
    expect(() => CommitmentInstance.parse({})).toThrow();
  });
});
