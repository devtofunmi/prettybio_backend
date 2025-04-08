import type { Context } from "hono";
import { prisma } from "../lib/prisma.js";

// Get all links for current user
export const getLinks = async (c: Context) => {
    const userId = c.get("userId");
  
    const links = await prisma.link.findMany({
      where: { userId },
      select: {
        id: true,
        url: true,
        title: true, // if you have a title or other fields
        clickCount: true,
        createdAt: true, // optional, but helpful for UI
      },
    });
  
    return c.json({ links });
  };

  // Increment click count for a public link
export const incrementLinkClick = async (c: Context) => {
    const id = c.req.param("id");
  
    const link = await prisma.link.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
    });
  
    return c.json({ message: "Link click tracked", totalClicks: link.clickCount });
  };
  
  

// Create a new link
export const createLink = async (c: Context) => {
  const userId = c.get("userId");
  const { title, url } = await c.req.json();

  if (!title || !url) {
    return c.json({ error: "Title and URL are required" }, 400);
  }

  const newLink = await prisma.link.create({
    data: {
      title,
      url,
      userId,
    },
  });

  return c.json({ message: "Link created", link: newLink }, 201);
};

// Update a link
export const updateLink = async (c: Context) => {
  const userId = c.get("userId");
  const linkId = c.req.param("id");
  const { title, url } = await c.req.json();

  const link = await prisma.link.findUnique({
    where: { id: linkId },
  });

  if (!link || link.userId !== userId) {
    return c.json({ error: "Link not found or unauthorized" }, 404);
  }

  const updated = await prisma.link.update({
    where: { id: linkId },
    data: { title, url },
  });

  return c.json({ message: "Link updated", link: updated });
};

// Delete a link
export const deleteLink = async (c: Context) => {
  const userId = c.get("userId");
  const linkId = c.req.param("id");

  const link = await prisma.link.findUnique({
    where: { id: linkId },
  });

  if (!link || link.userId !== userId) {
    return c.json({ error: "Link not found or unauthorized" }, 404);
  }

  await prisma.link.delete({ where: { id: linkId } });

  return c.json({ message: "Link deleted" });
};
