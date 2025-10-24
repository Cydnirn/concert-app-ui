import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("concert/:id", "routes/concert.$id.tsx"),
  route("images/:id.jpeg", "routes/images.$id[.]jpeg.tsx"),
] satisfies RouteConfig;
