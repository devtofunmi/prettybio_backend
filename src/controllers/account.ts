import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";

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
      userLinkName: true,
      setup_complete: true,
      createdAt: true,
    },
  });

  if (!user) return c.json({ error: "User not found" }, 404);

  return c.json({ user });
};

export const updateAccount = async (c: Context) => {
  const userId = c.get("userId");
  const { name, bio, image, userLinkName, password, username } = await c.req.json();

  try {
    const dataToUpdate: any = {
      name,
      bio,
      image,
      userLinkName,
      username,
      setup_complete: true,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return c.json({
      message: "Account updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        bio: updatedUser.bio,
        image: updatedUser.image,
        userLinkName: updatedUser.userLinkName,
        username: updatedUser.username,
      },
    });
  } catch (err) {
    console.error("Update Error:", err);
    return c.json({ error: "Could not update account" }, 500);
  }
};

export const deleteAccount = async (c: Context) => {
  const userId = c.get("userId");

  try {
    // Delete related data (manually)
    await prisma.pageView.deleteMany({ where: { userId } });
    await prisma.link.deleteMany({ where: { userId } });
    await prisma.socialLink.deleteMany({ where: { userId } });

    // Finally delete the user
    await prisma.user.delete({
      where: { id: userId },
    });
    
    return c.json({ message: "Account and all related data deleted successfully" });
  } catch (error) {
    console.error("Account deletion error:", error);
    return c.json({ error: "Failed to delete account" }, 500);
  }
};


