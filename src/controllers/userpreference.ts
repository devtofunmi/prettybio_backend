import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

export const getUserPreferences = async (c: Context) => {
  const userId = c.req.param('userId'); 
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true, socialPosition: true }
  });

  if (!user) {
    return c.json({ message: 'User not found' }, 404);
  }

  return c.json(user);
};

export const updateUserPreferences = async (c: Context) => {
  const userId = c.req.param('userId'); 
  const { theme, socialPosition } = await c.req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { theme, socialPosition }
  });

  return c.json({ message: 'Preferences updated', data: updated });
};


