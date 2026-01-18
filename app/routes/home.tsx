import { About } from "../components/about/about";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Home - Sean OBrien" }, { name: "description", content: "Welcome to my site!" }];
}

export default function Home() {
  return <About />;
}
