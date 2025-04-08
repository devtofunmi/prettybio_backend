import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

// Get all social links
export const getSocialLinks = async (c: Context) => {
    const userId = c.get("userId");
  
    const links = await prisma.socialLink.findMany({
      where: { userId },
      select: {
        id: true,
        url: true,
        clickCount: true,
      },
    });
  
    return c.json({ links });
  };
  
  
  // Create a new social link
  export const createSocialLink = async (c: Context) => {
    const userId = c.get("userId");
    const { url } = await c.req.json();
  
    if (!url) return c.json({ error: "URL is required" }, 400);
  
    const link = await prisma.socialLink.create({
      data: {
        url,
        userId,
      },
    });
  
    return c.json({ message: "Social link created", link }, 201);
  };
  
  // Update a social link
  export const updateSocialLink = async (c: Context) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const { url } = await c.req.json();
  
    const existing = await prisma.socialLink.findUnique({ where: { id } });
  
    if (!existing || existing.userId !== userId) {
      return c.json({ error: "Unauthorized or not found" }, 404);
    }
  
    const updated = await prisma.socialLink.update({
      where: { id },
      data: { url },
    });
  
    return c.json({ message: "Social link updated", link: updated });
  };
  
  // Delete a social link
  export const deleteSocialLink = async (c: Context) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
  
    const existing = await prisma.socialLink.findUnique({ where: { id } });
  
    if (!existing || existing.userId !== userId) {
      return c.json({ error: "Unauthorized or not found" }, 404);
    }
  
    await prisma.socialLink.delete({ where: { id } });
    return c.json({ message: "Social link deleted" });
  };

  // Increment click count when someone clicks the social link
export const incrementSocialClick = async (c: Context) => {
    const id = c.req.param("id");
  
    const link = await prisma.socialLink.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  
    return c.json({ message: "Click tracked", totalClicks: link.clickCount });
  };
  