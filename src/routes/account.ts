import { Hono } from "hono";
import { getAccount, updateAccount } from "../controllers/account.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

export const accountRoutes = new Hono();


accountRoutes.get("/accountRoutes", authMiddleware, getAccount);
accountRoutes.put("/accountRoutes", authMiddleware, updateAccount);

