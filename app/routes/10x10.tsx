import { TenByTenPage } from "../components/bgg/10x10/10x10";
import type { Route } from "./+types/10x10";

export function meta({}: Route.MetaArgs) {
  const title = "Board Game 10x10 - Sean OBrien";
  const description = "View the 10x10 board game plays of Sean OBrien";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.sean-obrien.net/10x10" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function TenByTen() {
  return <TenByTenPage />;
}
