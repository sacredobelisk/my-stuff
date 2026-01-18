import { OweMePage } from "../components/owe-me/owe-me";
import type { Route } from "./+types/owe-me";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Owe Me - Sean OBrien" }, { name: "description", content: "Welcome to my site!" }];
}

export default function OweMe() {
  return <OweMePage />;
}
