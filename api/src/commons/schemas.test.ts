import { expect, it, describe } from "bun:test";
import { id, name, username, email, password, direction, order } from "../commons/schemas";
import * as userSchemas from "../namespaces/user/schema";
import * as goalSchemas from "../namespaces/goal/schema";
import { momentumSnapshotInputSchema, commitRecordSchema } from "../namespaces/momentum/schemas";

describe("Common schemas", () => {
  describe("id", () => {
    it("accepts a valid ULID", () => {
      const result = id.parse("01ARZ3NDEKTSV4RRFFQ69G5FAV");
      expect(result).toBe("01ARZ3NDEKTSV4RRFFQ69G5FAV");
    });

    it("rejects an invalid ULID", () => {
      expect(() => id.parse("not-a-ulid")).toThrow();
    });

    it("rejects empty strings", () => {
      expect(() => id.parse("")).toThrow();
    });
  });

  describe("username", () => {
    it("accepts a valid username", () => {
      expect(username.parse("john_doe")).toBe("john_doe");
    });

    it("accepts a username with numbers", () => {
      expect(username.parse("user123")).toBe("user123");
    });

    it("rejects a username starting with underscore", () => {
      expect(() => username.parse("_john")).toThrow();
    });

    it("rejects a username ending with underscore", () => {
      expect(() => username.parse("john_")).toThrow();
    });

    it("rejects a username that is too long", () => {
      expect(() => username.parse("a".repeat(20))).toThrow();
    });

    it("trims whitespace", () => {
      expect(username.parse("  hello  ")).toBe("hello");
    });
  });

  describe("name", () => {
    it("accepts a valid name", () => {
      expect(name.parse("John Doe")).toBe("John Doe");
    });

    it("rejects an empty name", () => {
      expect(() => name.parse("")).toThrow();
    });

    it("rejects a name that is too long", () => {
      expect(() => name.parse("x".repeat(100))).toThrow();
    });
  });

  describe("email", () => {
    it("accepts a valid email", () => {
      expect(email.parse("test@example.com")).toBe("test@example.com");
    });

    it("rejects an invalid email", () => {
      expect(() => email.parse("not-an-email")).toThrow();
    });
  });

  describe("password", () => {
    it("accepts a password with 8 or more characters", () => {
      expect(password.parse("12345678")).toBe("12345678");
    });

    it("rejects a short password", () => {
      expect(() => password.parse("1234567")).toThrow();
    });
  });

  describe("direction", () => {
    it("accepts 'forward'", () => {
      expect(direction.parse("forward")).toBe("forward");
    });

    it("accepts 'backward'", () => {
      expect(direction.parse("backward")).toBe("backward");
    });

    it("rejects other values", () => {
      expect(() => direction.parse("left")).toThrow();
    });
  });

  describe("order", () => {
    it("accepts a non-negative integer", () => {
      expect(order.parse(0)).toBe(0);
      expect(order.parse(42)).toBe(42);
    });

    it("rejects negative numbers", () => {
      expect(() => order.parse(-1)).toThrow();
    });

    it("rejects floats", () => {
      expect(() => order.parse(1.5)).toThrow();
    });
  });
});

describe("User schemas", () => {
  describe("checkUsernameAvailability", () => {
    it("accepts valid input", () => {
      const result = userSchemas.checkUsernameAvailability.parse({ username: "testuser" });
      expect(result.username).toBe("testuser");
    });

    it("rejects missing username", () => {
      expect(() => userSchemas.checkUsernameAvailability.parse({})).toThrow();
    });

    it("rejects invalid username format", () => {
      expect(() => userSchemas.checkUsernameAvailability.parse({ username: "_bad" })).toThrow();
    });
  });

  describe("getSettings", () => {
    it("accepts an empty object", () => {
      const result = userSchemas.getSettings.parse({});
      expect(result).toEqual({});
    });
  });

  describe("updateSettings", () => {
    it("accepts a theme update", () => {
      const result = userSchemas.updateSettings.parse({
        preferences: { theme: "dark" },
      });
      expect(result.preferences?.theme).toBe("dark");
    });

    it("accepts a partial onboarding update", () => {
      const result = userSchemas.updateSettings.parse({
        onboarding: { completed: true },
      });
      expect(result.onboarding?.completed).toBe(true);
    });

    it("rejects invalid theme value", () => {
      expect(() =>
        userSchemas.updateSettings.parse({
          preferences: { theme: "yellow" },
        })
      ).toThrow();
    });

    it("rejects negative onboarding step", () => {
      expect(() =>
        userSchemas.updateSettings.parse({
          onboarding: { step: -1 },
        })
      ).toThrow();
    });
  });
});

describe("Goal schemas", () => {
  describe("getGoal", () => {
    it("accepts a valid ULID", () => {
      const result = goalSchemas.getGoal.parse({ id: "01ARZ3NDEKTSV4RRFFQ69G5FAV" });
      expect(result.id).toBe("01ARZ3NDEKTSV4RRFFQ69G5FAV");
    });

    it("rejects missing id", () => {
      expect(() => goalSchemas.getGoal.parse({})).toThrow();
    });
  });

  describe("updateGoal", () => {
    it("accepts a valid ULID", () => {
      const result = goalSchemas.updateGoal.parse({ id: "01ARZ3NDEKTSV4RRFFQ69G5FAV" });
      expect(result.id).toBe("01ARZ3NDEKTSV4RRFFQ69G5FAV");
    });
  });
});

describe("Momentum schemas", () => {
  describe("commitRecordSchema", () => {
    it("accepts a valid commit record", () => {
      const result = commitRecordSchema.parse({
        id: "rec-1",
        userId: "user-1",
        kind: "Habit",
        instanceId: "habit-1",
        timestamp: Date.now(),
        event: "COUNT_UP",
      });
      expect(result.id).toBe("rec-1");
    });

    it("rejects missing required fields", () => {
      expect(() => commitRecordSchema.parse({})).toThrow();
    });
  });

  describe("momentumSnapshotInputSchema", () => {
    it("applies default windowDays", () => {
      const result = momentumSnapshotInputSchema.parse({});
      expect(result.windowDays).toBe(10);
    });

    it("accepts a custom windowDays within range", () => {
      const result = momentumSnapshotInputSchema.parse({ windowDays: 15 });
      expect(result.windowDays).toBe(15);
    });

    it("rejects windowDays below minimum", () => {
      expect(() => momentumSnapshotInputSchema.parse({ windowDays: 3 })).toThrow();
    });

    it("rejects windowDays above maximum", () => {
      expect(() => momentumSnapshotInputSchema.parse({ windowDays: 31 })).toThrow();
    });

    it("accepts optional expansion flags", () => {
      const result = momentumSnapshotInputSchema.parse({
        explain: true,
        delta: true,
        impact: true,
        recommendations: true,
      });
      expect(result.explain).toBe(true);
      expect(result.delta).toBe(true);
    });

    it("accepts commitRecords array", () => {
      const result = momentumSnapshotInputSchema.parse({
        commitRecords: [
          {
            id: "rec-1",
            userId: "user-1",
            kind: "Habit",
            instanceId: "habit-1",
            timestamp: Date.now(),
            event: "COUNT_UP",
          },
        ],
      });
      expect(result.commitRecords).toHaveLength(1);
    });
  });
});
