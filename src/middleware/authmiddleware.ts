import { type MiddlewareHandler } from "hono";
import { verifyToken } from "../utils/jwt.js";

// Middleware to authenticate requests using JWT token
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  // Check if the Authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Extract token from the Authorization header
  const token = authHeader.split(" ")[1];
  console.log("Token:", token);  // Log token for debugging

  // Verify the token and decode payload
  const payload = await verifyToken(token);

  // If no valid payload or missing user ID, return an error
  if (!payload || !payload.sub) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }

  console.log("User ID from token:", payload.sub);

  // Attach user ID to the context for subsequent use in routes
  c.set("userId", payload.sub as string);

  // Proceed to the next middleware or route handler
  await next();
};

