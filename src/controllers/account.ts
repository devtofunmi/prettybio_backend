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

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        image,
        user_link_name,
        setup_complete: true,
      },
    });

    return c.json({
      message: "Account updated successfully",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
        bio: updatedUser.bio,
        image: updatedUser.image,
        user_link_name: updatedUser.user_link_name,
      },
    });
  } catch (err) {
    console.error("Update Error:", err);
    return c.json({ error: "Could not update account" }, 500);
  }
};