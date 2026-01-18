import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ command }) => ({
  plugins: [reactRouter(), tsconfigPaths(), devtoolsJson()],
}));
