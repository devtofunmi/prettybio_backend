import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

export const getUserProfile = async (c: Context) => {
  const userLinkName = c.req.param("userLinkName");

  try {
    const user = await prisma.user.findFirst({
      where: { userLinkName: userLinkName },
      include: {
        links: true,
        socialLinks: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      username: user.name,
      bio: user.bio,
      image: user.image,
      links: user.links,
      socials: user.socialLinks,
    });
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return c.json({ error: "Internal Server Error" }, 500);
  }
};
