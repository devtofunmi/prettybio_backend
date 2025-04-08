import { type MiddlewareHandler } from "hono";
import { verifyToken } from "./../utils/jwt.js";

export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const payload = await verifyToken(token);

  if (!payload || !payload.sub) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  // Attach user ID to context
  c.set("userId", payload.sub as string);
  await next();
};
