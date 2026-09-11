import { TenByTenPage } from "~/components/bgg/10x10/10x10";
import { buildPageMeta } from "~/utils/meta";

export const meta = () =>
  buildPageMeta({
    description: "View the 10x10 board game plays of Sean OBrien",
    path: "/10x10",
    title: "Board Game 10x10",
  });

export default function TenByTen() {
  return <TenByTenPage />;
}
