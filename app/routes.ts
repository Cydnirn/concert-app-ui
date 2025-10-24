import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("concert/:id", "routes/concert.$id.tsx"),
  route("images/:id", "routes/images.$id.tsx"),
] satisfies RouteConfig;
