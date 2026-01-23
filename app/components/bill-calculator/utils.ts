import { v4 as uuidv4 } from "uuid";
import type { BillData } from "./types";

export const DEFAULT_TAX_PERCENT = 6;
export const DEFAULT_TIP_PERCENT = 20;

export const createDefaultBillData = (): BillData => ({
  finalTotal: null,
  people: [{ key: uuidv4(), name: "", subtotal: 0 }],
  taxPercent: DEFAULT_TAX_PERCENT,
  tipPercent: DEFAULT_TIP_PERCENT,
});
