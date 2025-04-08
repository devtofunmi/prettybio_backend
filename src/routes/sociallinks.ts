import { Hono } from "hono";
import {
  getSocialLinks,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
  incrementSocialClick,
} from "../controllers/sociallink.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const socialRoutes = new Hono();


socialRoutes.use("/*", authMiddleware);

socialRoutes.get("/", getSocialLinks);
socialRoutes.post("/", createSocialLink);
socialRoutes.put("/:id", updateSocialLink);
socialRoutes.delete("/:id", deleteSocialLink);

// Public route to track clicks (no auth!)
const publicRoutes = new Hono();
publicRoutes.get("/click/:id", incrementSocialClick);

export default new Hono()
  .route("/socials", socialRoutes)
  .route("/public", publicRoutes); // mount public route
  // At the end of routes/links.ts
   export { publicRoutes };

