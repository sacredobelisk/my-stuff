import { AboutPage } from "~/components/about/about";
import { buildPageMeta } from "~/utils/meta";

export const meta = () =>
  buildPageMeta({
    description:
      "Learn about Sean OBrien, a software engineer based outside of Philadelphia specializing in React, JavaScript, and TypeScript.",
    title: "About",
  });

export default function Home() {
  return <AboutPage />;
}
