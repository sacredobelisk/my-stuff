import { BillCalculatorPage } from "../components/bill-calculator/bill-calculator";
import type { Route } from "./+types/bill-calculator";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Bill Calculator - Sean OBrien" }, { name: "description", content: "Welcome to my site!" }];
}

export default function BillCalculator() {
  return <BillCalculatorPage />;
}
