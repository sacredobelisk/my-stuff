import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/bill-calculator", "routes/bill-calculator.tsx"),
  route("/resume", "routes/resume.tsx"),
  route("/10x10", "routes/10x10.tsx"),
] satisfies RouteConfig;
