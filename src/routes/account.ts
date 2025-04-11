import { Hono } from "hono";
import { getAccount, updateAccount } from "../controllers/account.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

export const accountRoutes = new Hono();

// The routes are now consistent with "/account" path
accountRoutes.get("/",  getAccount);  // GET /account
accountRoutes.put("/", authMiddleware, updateAccount);  // PUT /account


