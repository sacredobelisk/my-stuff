import { BillCalculatorPage } from "~/components/bill-calculator/bill-calculator";
import { buildPageMeta } from "~/utils/meta";

export const meta = () =>
  buildPageMeta({
    description: "Split a bill proportionally among a group, with adjustable tax and tip.",
    path: "/bill-calculator",
    title: "Bill Calculator",
  });

export default function BillCalculator() {
  return <BillCalculatorPage />;
}
