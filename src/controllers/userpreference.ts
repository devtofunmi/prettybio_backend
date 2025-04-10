import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

// Fetch user preferences (including theme and social position)
export const getUserPreferences = async (c: Context) => {
  const userId = c.get("userId");
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { theme: true, socialPosition: true }, 
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    throw new Error('Error fetching user preferences');
  }
};


// Update user preferences (theme and social position)
export const updateUserPreferences = async (userId: string, theme: string, socialPosition: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { theme, socialPosition },
    });

    return updatedUser;
  } catch (error) {
    throw new Error('Error updating user preferences');
  }
};
