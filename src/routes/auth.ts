import { Hono } from "hono";
import { login, logout, setup, signup, refreshToken } from "../controllers/auth.js";
import { authMiddleware } from "../middleware/authmiddleware.js";

const authRoutes = new Hono();

authRoutes.post("/signup", signup);
authRoutes.post("/login", login);
authRoutes.post("/refreshToken", refreshToken);
authRoutes.post("/logout", logout);
authRoutes.patch("/setup", authMiddleware, setup);

export default authRoutes;