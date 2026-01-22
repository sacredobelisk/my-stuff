import type { BillData } from "./types";

export const DEFAULT_TAX_PERCENT = 6;
export const DEFAULT_TIP_PERCENT = 20;

export const generateKey = () => Math.random().toString(36).substring(2, 9);

export const createDefaultBillData = (): BillData => ({
  finalTotal: null,
  people: [{ key: generateKey(), name: "", subtotal: 0 }],
  taxPercent: DEFAULT_TAX_PERCENT,
  tipPercent: DEFAULT_TIP_PERCENT,
});
