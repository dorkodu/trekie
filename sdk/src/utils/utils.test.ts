import { expect, it, describe } from "bun:test";
import { format } from "./format";
import { cyrb53, hash } from "./hash";
import { tryCatch } from "./trycatch";

describe("format", () => {
  describe("percentage", () => {
    it("formats a number as percentage", () => {
      expect(format.percentage(75)).toBe("75%");
    });

    it("handles zero", () => {
      expect(format.percentage(0)).toBe("0%");
    });
  });

  describe("number", () => {
    it("formats with compact notation by default", () => {
      expect(format.number(1500)).toBe("1.5K");
      expect(format.number(500)).toBe("500");
    });

    it("formats with long notation when requested", () => {
      expect(format.number(1500, true)).toBe("1,500");
    });
  });

  describe("percentile", () => {
    it("formats a decimal as percentile", () => {
      const result = format.percentile(0.75);
      expect(result).toContain("75");
    });
  });

  describe("date", () => {
    it("formats a numeric date", () => {
      const date = new Date("2024-06-15T12:00:00Z").getTime();
      const result = format.date(date);
      expect(result).toContain("2024");
    });
  });

  describe("relativeDateString", () => {
    it('returns "now" for current time', () => {
      expect(format.relativeDateString(Date.now())).toBe("now");
    });

    it("returns minutes for timestamps a few minutes ago", () => {
      const fiveMinAgo = Date.now() - 5 * 60_000;
      expect(format.relativeDateString(fiveMinAgo)).toMatch(/[0-9]+m/);
    });

    it("returns a date for timestamps many days ago", () => {
      const lastWeek = Date.now() - 10 * 24 * 3_600_000;
      expect(format.relativeDateString(lastWeek)).toBeTruthy();
    });
  });
});

describe("cyrb53", () => {
  it("produces consistent hashes for the same input", () => {
    expect(cyrb53("hello")).toBe(cyrb53("hello"));
  });

  it("produces different hashes for different inputs", () => {
    expect(cyrb53("hello")).not.toBe(cyrb53("world"));
  });

  it("handles empty strings", () => {
    expect(typeof cyrb53("")).toBe("number");
  });
});

describe("hash", () => {
  it("produces a hex string", () => {
    const result = hash({ foo: "bar" });
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("produces consistent hashes for the same data", () => {
    const data = { a: 1, b: [2, 3] };
    expect(hash(data)).toBe(hash(data));
  });
});

describe("tryCatch", () => {
  it("returns data for a resolving promise", async () => {
    const result = await tryCatch(Promise.resolve(42));
    expect(result.data).toBe(42);
    expect(result.error).toBeNull();
  });

  it("returns error for a rejecting promise", async () => {
    const result = await tryCatch(Promise.reject(new Error("fail")));
    expect(result.data).toBeNull();
    expect(result.error).toBeInstanceOf(Error);
    expect((result.error as Error).message).toBe("fail");
  });


});
