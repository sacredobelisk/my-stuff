import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/my-stuff/" : "/",
  plugins: [reactRouter(), tsconfigPaths(), devtoolsJson()],
}));
