import { describe, expect, it } from "vitest";
import { formatCurrency, roundToCents } from "~/helpers/numbers";

describe("formatCurrency", () => {
  it("formats a value as US currency", () => {
    expect(formatCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("roundToCents", () => {
  it("rounds to two decimal places", () => {
    expect(roundToCents(10.005)).toBe(10.01);
    expect(roundToCents(10.004)).toBe(10);
  });

  it("leaves whole numbers alone", () => {
    expect(roundToCents(42)).toBe(42);
  });
});
