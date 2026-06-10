import { expect, it, describe } from "bun:test";
import { Encoder, formatNumber, formatPercent, relativeDateString, formatDate, getDayDiff, isSameDay } from "./index";

describe("Encoder", () => {
  it("converts string from utf-8 to hex", () => {
    const input = "Hello, Trekie!";
    const binary = Encoder.toBinary(input, "utf-8");
    expect(Buffer.isBuffer(binary)).toBe(true);
  });

  it("converts binary buffer back to string", () => {
    const input = "Hello, Trekie!";
    const binary = Encoder.toBinary(input, "utf-8");
    const decoded = Encoder.fromBinary(binary, "hex");
    expect(decoded.length).toBeGreaterThan(0);
  });

  it("handles empty string", () => {
    const binary = Encoder.toBinary("", "utf-8");
    const decoded = Encoder.fromBinary(binary, "hex");
    expect(decoded).toBe("");
  });
});

describe("formatNumber", () => {
  it("formats numbers with compact notation by default", () => {
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(1_000_000)).toBe("1M");
    expect(formatNumber(500)).toBe("500");
  });

  it("formats with long notation when long argument is true", () => {
    expect(formatNumber(1500, true)).toBe("1,500");
    expect(formatNumber(1_000_000, true)).toBe("1,000,000");
  });
});

describe("formatPercent", () => {
  it("formats a decimal as a percentage", () => {
    const result = formatPercent(0.75);
    expect(result).toContain("75");
  });
});

describe("relativeDateString", () => {
  it('returns "now" for the current time', () => {
    const now = Date.now();
    const result = relativeDateString(now);
    expect(result).toBe("now");
  });

  it("returns minutes for timestamps a few minutes ago", () => {
    const fiveMinutesAgo = Date.now() - 5 * 60_000;
    const result = relativeDateString(fiveMinutesAgo);
    expect(result).toMatch(/[0-9]+m/);
  });

  it("returns hours for timestamps a few hours ago", () => {
    const threeHoursAgo = Date.now() - 3 * 3_600_000;
    const result = relativeDateString(threeHoursAgo);
    expect(result).toMatch(/[0-9]+h/);
  });

  it("returns a formatted date for timestamps many days ago", () => {
    const lastWeek = Date.now() - 10 * 24 * 3_600_000;
    const result = relativeDateString(lastWeek);
    expect(result).toBeTruthy();
  });

  it("returns a date with year for timestamps from previous year", () => {
    const lastYear = Date.now() - 400 * 24 * 3_600_000;
    const result = relativeDateString(lastYear);
    expect(result).toContain(",");
  });
});

describe("formatDate", () => {
  it("formats a numeric date", () => {
    const date = new Date("2024-01-15T12:00:00Z").getTime();
    const result = formatDate(date);
    expect(result).toContain("2024");
  });

  it("includes time when requested", () => {
    const date = new Date("2024-01-15T14:30:00Z").getTime();
    const result = formatDate(date, true);
    expect(result).toMatch(/2024/);
  });
});

describe("getDayDiff", () => {
  it("calculates the difference in days", () => {
    const from = new Date("2024-01-01").getTime();
    const to = new Date("2024-01-10").getTime();
    expect(getDayDiff(from, to)).toBe(9);
  });

  it("returns 0 for two timestamps on the same day", () => {
    const date = new Date("2024-01-01").getTime();
    expect(getDayDiff(date, date)).toBe(0);
  });

  it("returns negative when the second date is before the first", () => {
    const from = new Date("2024-01-10").getTime();
    const to = new Date("2024-01-01").getTime();
    expect(getDayDiff(from, to)).toBe(-9);
  });
});

describe("isSameDay", () => {
  it("returns true for two Date objects on the same calendar day", () => {
    expect(isSameDay(new Date("2024-01-01T10:00:00"), new Date("2024-01-01T22:00:00"))).toBe(true);
  });

  it("returns false for different calendar days", () => {
    expect(isSameDay(new Date("2024-01-01"), new Date("2024-01-02"))).toBe(false);
  });

  it("returns false when either argument is undefined", () => {
    expect(isSameDay(undefined, new Date())).toBe(false);
    expect(isSameDay(new Date(), undefined)).toBe(false);
    expect(isSameDay(undefined, undefined)).toBe(false);
  });
});
