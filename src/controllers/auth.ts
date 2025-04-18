import { Hono, type Context } from "hono";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { signAccessToken, signRefreshToken,verifyToken } from "./../utils/jwt.js";
const isProd = process.env.NODE_ENV === "production";

export const signup = async (c: Context) => {
    try {
      const { username, password, email, setup_complete = false } = await c.req.json();
  
      if (!username || !password || !email) {
        return c.json({ error: "All fields are required" }, 400);
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        }
      });
  
      if (existingUser) {
        return c.json({ error: "User already exists" }, 400);
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          setup_complete
        }
      });
  
      return c.json({ message: "User registered successfully", user: { id: newUser.id, email: newUser.email } }, 201);
    } catch (err) {
      console.error("Signup Error:", err);
      return c.json({ error: "Internal server error" }, 500);
    }
  };
  

  export const login = async (c: Context) => {
    const { username, password } = await c.req.json();
  
    const user = await prisma.user.findUnique({
      where: { username },
    });
  
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }
  
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }
  
    // Generate tokens
    const accessToken = await signAccessToken({ sub: user.id });
    const refreshToken = await signRefreshToken({ sub: user.id });
  
    // Set refresh token as HTTP-only cookie
    c.header(
      "Set-Cookie",
      `refresh_token=${refreshToken}; Path=/; HttpOnly; ${
        isProd ? "Secure; SameSite=None" : "SameSite=Lax"
      }`
    );
  
    // Return only access token
    return c.json({
      accessToken,
      message: "Login successful",
    });
  };
  

  export const setup = async (c: Context) => {
    try {
      const authHeader = c.req.header("Authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
      const token = authHeader.split(" ")[1];
      const payload = await verifyToken(token);
  
      // ✅ Check if payload is valid and has a `sub`
      if (!payload || typeof payload !== "object" || !("sub" in payload)) {
        return c.json({ error: "Invalid token payload" }, 401);
      }
  
      const userId = payload.sub as string;
  
      const { name, bio, image, userLinkName } = await c.req.json();
  
      if (!name || !bio || !image || !userLinkName) {
        return c.json({ error: "All fields are required" }, 400);
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          bio,
          image,
          userLinkName,
          setup_complete: true,
        },
      });
  
      return c.json({
        message: "Profile setup complete",
        user: { id: updatedUser.id, name: updatedUser.name },
      });
  
    } catch (err: any) {
      console.error("Setup Error:", err);
      return c.json({ error: err.message || "Internal server error" }, 500);
    }
  };
  

//  Refresh token handler
export const refreshToken = async (c: Context) => {
  const cookie = c.req.header("cookie");
  const token = cookie?.split("; ").find((c) => c.startsWith("refresh_token="))?.split("=")[1];

  if (!token) return c.json({ error: "No refresh token" }, 401);

  try {
    const payload = await verifyToken(token);
    if (!payload.sub) return c.json({ error: "Invalid token" }, 403);

    const newAccessToken = await signAccessToken({ sub: payload.sub });
    console.log("Incoming cookies:", c.req.header("cookie"));
    return c.json({ accessToken: newAccessToken });
  } catch (err) {
    return c.json({ error: "Token verification failed" }, 403);
  }
};


export const logout = async (c: Context) => {
  // c.header(
  //   "Set-Cookie",
  //   `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; Secure; SameSite=Strict`
  // );
  c.header(
    "Set-Cookie",
    `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800; ${isProd ? "Secure; " : ""}SameSite=Strict`
  );
  return c.json({ message: "Logged out successfully" });
};
  