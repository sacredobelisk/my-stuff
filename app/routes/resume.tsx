import { ResumePage } from "../components/resume/resume";
import type { Route } from "./+types/resume";

export function meta({}: Route.MetaArgs) {
  const title = "Resume - Sean OBrien";
  const description =
    "View the professional resume of Sean OBrien, a software engineer specializing in React, JavaScript, and TypeScript.";

  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.sean-obrien.net/resume" },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}

export default function Resume() {
  return <ResumePage />;
}
