export interface Person {
  key: string;
  name: string;
  subtotal: number;
}

export interface BillData {
  finalTotal: number | null;
  people: Person[];
  taxPercent: number;
  tipPercent: number;
}
