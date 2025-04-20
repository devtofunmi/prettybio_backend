import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

export const getUserPreferences = async (c: Context) => {
  const userId = c.get('userId');
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { theme: true, socialPosition: true }
  });

  return c.json(user);
};

export const updateUserPreferences = async (c: Context) => {
  const userId = c.get('userId');
  const { theme, socialPosition } = await c.req.json();

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { theme, socialPosition }
  });

  return c.json({ message: 'Preferences updated', data: updated });
};

