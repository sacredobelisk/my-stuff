import { BillCalculatorPage } from "../components/bill-calculator/bill-calculator";
import type { Route } from "./+types/bill-calculator";

export function meta({}: Route.MetaArgs) {
  const title = "Bill Calculator - Sean OBrien";
  const description = "Split a bill proportionally among a group, with adjustable tax and tip.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.sean-obrien.net/bill-calculator" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function BillCalculator() {
  return <BillCalculatorPage />;
}
