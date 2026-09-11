import { ResumePage } from "~/components/resume/resume";
import { buildPageMeta } from "~/utils/meta";

export const meta = () =>
  buildPageMeta({
    description:
      "View the professional resume of Sean OBrien, a software engineer specializing in React, JavaScript, and TypeScript.",
    path: "/resume",
    title: "Resume",
  });

export default function Resume() {
  return <ResumePage />;
}
