import type { BillData } from "./types";

export const DEFAULT_TAX_PERCENT = 6;
export const DEFAULT_TIP_PERCENT = 20;

export const createDefaultBillData = (): BillData => ({
  finalTotal: null,
  people: [{ key: generateKey(), name: "", subtotal: 0 }],
  taxPercent: DEFAULT_TAX_PERCENT,
  tipPercent: DEFAULT_TIP_PERCENT,
});

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
