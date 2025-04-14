import type { MiddlewareHandler, Context } from "hono";
import { verifyToken } from "../utils/jwt.js";

// Middleware to authenticate requests using JWT token
export const authMiddleware: MiddlewareHandler = async (c, next) => {
  const authHeader = c.req.header("Authorization");

  // Check if the Authorization header is present and valid
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];

  if (process.env.NODE_ENV !== "production") {
    console.log("Token received:", token);
  }

  try {
    const payload = await verifyToken(token);

    if (!payload || !payload.sub) {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Verified user ID from token:", payload.sub);
    }

    c.set("userId", payload.sub as string);

    await next();
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : "Unauthorized" }, 401);
  }
};

// Helper to safely get the userId from context
export const getUserId = (c: Context): string => {
  const userId = c.get("userId");
  if (!userId) throw new Error("User ID not found in context");
  return userId;
};


