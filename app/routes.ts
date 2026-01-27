import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/bill-calculator", "routes/bill-calculator.tsx"),
] satisfies RouteConfig;
