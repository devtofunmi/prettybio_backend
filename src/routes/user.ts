import { Hono } from "hono";
import { getUserProfile } from "../controllers/user.js";

const userRoutes = new Hono();

userRoutes.get("/profile/:userLinkName", getUserProfile);

export default userRoutes;