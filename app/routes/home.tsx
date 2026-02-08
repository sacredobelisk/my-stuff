import { About } from "../components/about/about";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  const title = "About - Sean OBrien";
  const description =
    "Learn about Sean OBrien, a software engineer based outside of Philadelphia specializing in React, JavaScript, and TypeScript.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.sean-obrien.net" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function Home() {
  return <About />;
}
