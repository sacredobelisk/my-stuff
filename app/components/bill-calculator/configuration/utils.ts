import type { BillData, Person } from "~/components/bill-calculator/configuration/types";

export const DEFAULT_TAX_PERCENT = 6;
export const DEFAULT_TIP_PERCENT = 20;

export const generateKey = (() => {
  let counter = 0;
  return () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    counter += 1;
    return `person-${Date.now()}-${counter}`;
  };
})();

export const createPerson = (): Person => ({ key: generateKey(), name: "", subtotal: 0 });

export const createDefaultBillData = (): BillData => ({
  finalTotal: null,
  people: [createPerson()],
  taxPercent: DEFAULT_TAX_PERCENT,
  tipPercent: DEFAULT_TIP_PERCENT,
});

/** The grid hands back whatever was typed, so normalise it to a non-negative number. */
export const toSubtotal = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/**
 * Whether a committed row actually changes what the bill comes to.
 *
 * The grid commits a whole row at a time, so renaming someone — or committing a row untouched —
 * arrives here too. Only a subtotal change should be allowed to disturb a manually entered total.
 */
export const hasSubtotalChanged = (people: Person[], updated: Person) => {
  const previous = people.find(({ key }) => key === updated.key);
  return !!previous && toSubtotal(updated.subtotal) !== previous.subtotal;
};

const isPerson = (value: unknown): value is Person => {
  if (typeof value !== "object" || value === null) return false;
  const { key, name, subtotal } = value as Partial<Person>;
  return typeof key === "string" && typeof name === "string" && typeof subtotal === "number";
};

/**
 * Validates a payload read back out of storage. Older or hand-edited data can be missing the
 * fields the grid relies on, so anything that does not match the shape is rejected outright.
 */
export const parseBillData = (value: unknown): BillData | null => {
  if (typeof value !== "object" || value === null) return null;

  const { finalTotal, people, taxPercent, tipPercent } = value as Partial<BillData>;

  if (!Array.isArray(people) || people.length === 0 || !people.every(isPerson)) return null;
  if (typeof taxPercent !== "number" || typeof tipPercent !== "number") return null;
  if (finalTotal !== null && finalTotal !== undefined && typeof finalTotal !== "number") return null;

  return { finalTotal: finalTotal ?? null, people, taxPercent, tipPercent };
};

/**
 * Splits `total` across `people` in proportion to their subtotals, working in whole cents.
 *
 * Rounding each share independently lets the parts drift away from the whole, so the leftover
 * cents are handed out by largest remainder — the shares always add back up to `total` exactly.
 * When nothing has been itemised yet there is no proportion to honour, so the total is split evenly.
 *
 * @returns A map of person key to the amount that person owes.
 */
export const allocateShares = (people: Person[], total: number): Record<string, number> => {
  if (people.length === 0) return {};

  const totalCents = Math.round(total * 100);
  const subtotalCents = people.map((person) => Math.max(0, Math.round(person.subtotal * 100)));
  const weightTotal = subtotalCents.reduce((sum, cents) => sum + cents, 0);
  const weights = weightTotal === 0 ? people.map(() => 1) : subtotalCents;
  const weightSum = weightTotal === 0 ? people.length : weightTotal;

  const exactShares = weights.map((weight) => (weight / weightSum) * totalCents);
  const flooredShares = exactShares.map((share) => Math.floor(share));
  const leftoverCents = totalCents - flooredShares.reduce((sum, cents) => sum + cents, 0);

  // Stable sort, so ties fall to the person listed first.
  const nextInLine = new Set(
    exactShares
      .map((share, index) => ({ index, remainder: share - Math.floor(share) }))
      .sort((a, b) => b.remainder - a.remainder)
      .slice(0, Math.max(0, leftoverCents))
      .map(({ index }) => index)
  );

  return Object.fromEntries(
    people.map((person, index) => [person.key, (flooredShares[index] + (nextInLine.has(index) ? 1 : 0)) / 100])
  );
};
