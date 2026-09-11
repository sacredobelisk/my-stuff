import { describe, expect, it } from "vitest";
import type { Person } from "~/components/bill-calculator/configuration/types";
import { allocateShares, parseBillData } from "~/components/bill-calculator/configuration/utils";

const person = (key: string, subtotal: number): Person => ({ key, name: key, subtotal });

const sumOf = (shares: Record<string, number>) =>
  Object.values(shares).reduce((total, share) => Math.round(total * 100 + share * 100) / 100, 0);

describe("allocateShares", () => {
  it("splits in proportion to subtotals", () => {
    expect(allocateShares([person("a", 10), person("b", 20)], 33)).toEqual({ a: 11, b: 22 });
  });

  it("hands out leftover cents so the shares add up to the total exactly", () => {
    const shares = allocateShares([person("a", 10), person("b", 10), person("c", 10)], 100);

    expect(shares).toEqual({ a: 33.34, b: 33.33, c: 33.33 });
    expect(sumOf(shares)).toBe(100);
  });

  it("splits evenly when nothing has been itemised yet", () => {
    expect(allocateShares([person("a", 0), person("b", 0)], 10)).toEqual({ a: 5, b: 5 });
  });

  it("gives everything to the only person on the bill", () => {
    expect(allocateShares([person("a", 12.34)], 56.78)).toEqual({ a: 56.78 });
  });

  it("returns nothing for an empty bill", () => {
    expect(allocateShares([], 100)).toEqual({});
  });

  it("still balances on a total that does not divide cleanly", () => {
    const people = [person("a", 13.37), person("b", 4.2), person("c", 99.99), person("d", 0.01)];
    const shares = allocateShares(people, 149.99);

    expect(sumOf(shares)).toBe(149.99);
  });
});

describe("parseBillData", () => {
  const valid = {
    finalTotal: null,
    people: [{ key: "a", name: "Sean", subtotal: 10 }],
    taxPercent: 6,
    tipPercent: 20,
  };

  it("accepts a well formed payload", () => {
    expect(parseBillData(valid)).toEqual(valid);
  });

  it("normalises a missing finalTotal to null", () => {
    const withoutFinalTotal = { people: valid.people, taxPercent: valid.taxPercent, tipPercent: valid.tipPercent };

    expect(parseBillData(withoutFinalTotal)?.finalTotal).toBeNull();
  });

  it.each([
    ["not an object", "nope"],
    ["null", null],
    ["people missing", { ...valid, people: undefined }],
    ["people empty", { ...valid, people: [] }],
    ["a person without a key", { ...valid, people: [{ name: "Sean", subtotal: 10 }] }],
    ["a person with a non-numeric subtotal", { ...valid, people: [{ key: "a", name: "Sean", subtotal: "10" }] }],
    ["a non-numeric taxPercent", { ...valid, taxPercent: "6" }],
    ["a non-numeric finalTotal", { ...valid, finalTotal: "100" }],
  ])("rejects %s", (_label, payload) => {
    expect(parseBillData(payload)).toBeNull();
  });
});
