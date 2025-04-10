import { Hono, type Context } from "hono";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma.js";
import { signAccessToken, signRefreshToken,verifyToken } from "./../utils/jwt.js";

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
  
// Login function to authenticate user and generate tokens
export const login = async (c: Context) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: "Username and password are required" }, 400);
  }

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  // Compare the password provided with the hashed password in the database
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  // Generate access token and refresh token
  const accessToken = await signAccessToken({ sub: user.id });
  const refreshToken = await signRefreshToken({ sub: user.id });

  // Set the refresh token in a cookie
  c.header("Set-Cookie", `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=604800`);

  // Return the generated access token and a success message
  return c.json({ accessToken, message: "Login successful" });
};
  

  export const setup = async (c: Context) => {
    try {
      const userId = c.get("userId");
      const { name, bio, image, user_link_name } = await c.req.json();
  
      if (!name || !bio || !image || !user_link_name) {
        return c.json({ error: "All fields are required" }, 400);
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          bio,
          image,
          user_link_name,
          setup_complete: true
        }
      });
  
      return c.json({ message: "Profile setup complete", user: { id: updatedUser.id, name: updatedUser.name } });
    } catch (err) {
      console.error("Setup Error:", err);
      return c.json({ error: "Internal server error" }, 500);
    }
  };

  export const refreshToken = async (c: Context) => {
    const cookies = c.req.header("cookie");
    const token = cookies?.split("; ").find(cookie => cookie.startsWith("refresh_token="))?.split("=")[1];
    if (!token) return c.json({ error: "No refresh token" }, 401);
  
    const payload = await verifyToken(token);
    if (!payload || !payload.sub) return c.json({ error: "Invalid token" }, 403);
  
    const newAccessToken = await signAccessToken({ sub: payload.sub });
    return c.json({ accessToken: newAccessToken });
  };

  export const logout = async (c: Context) => {
    c.header(
      "Set-Cookie",
      "refresh_token=; HttpOnly; Path=/; Max-Age=0"
    );
    return c.json({ message: "Logged out" });
  };