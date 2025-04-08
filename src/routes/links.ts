import { Hono } from "hono";
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  incrementLinkClick,
} from "../controllers/links.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const linkRoutes = new Hono();
linkRoutes.use("/*", authMiddleware);


linkRoutes.get("/", getLinks);
linkRoutes.post("/", createLink);
linkRoutes.put("/:id", updateLink);
linkRoutes.delete("/:id", deleteLink);

// Public click tracker (no auth)
const publicRoutes = new Hono();
publicRoutes.get("/click/:id", incrementLinkClick);

export default new Hono()
  .route("/links", linkRoutes)
  .route("/public", publicRoutes);
  // At the end of routes/links.ts
 export { publicRoutes };


