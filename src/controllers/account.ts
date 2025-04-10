import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

export const getAccount = async (c: Context) => {
  const userId = c.get("userId");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      bio: true,
      image: true,
      user_link_name: true,
      setup_complete: true,
      createdAt: true,
    },
  });

  if (!user) return c.json({ error: "User not found" }, 404);

  return c.json({ user });
};

export const updateAccount = async (c: Context) => {
  const userId = c.get("userId");
  const { name, bio, image, user_link_name } = await c.req.json();

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { name, bio, image, user_link_name },
  });

  return c.json({ user: updatedUser });
};
