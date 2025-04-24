// src/routes/public-analytics.ts
import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const publicAnalyticsRoutes = new Hono();

// POST /analytics/page-view — anonymous
publicAnalyticsRoutes.post('/page-view', async (c) => {
  const { username } = await c.req.json();

  const user = await prisma.user.findUnique({
    where: { userLinkName: username },
    select: { id: true },
  });

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const today = new Date().toISOString().split("T")[0];

  const existing = await prisma.pageView.findFirst({
    where: { userId: user.id, date: new Date(today) },
  });

  if (existing) {
    await prisma.pageView.update({
      where: { id: existing.id },
      data: { views: { increment: 1 } },
    });
  } else {
    await prisma.pageView.create({
      data: {
        userId: user.id,
        date: new Date(today),
        views: 1,
      },
    });
  }

  return c.json({ success: true });
});

// POST /analytics/click/link/:id — anonymous
publicAnalyticsRoutes.post('/click/link/:id', async (c) => {
  const id = c.req.param('id');

  await prisma.link.update({
    where: { id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });

  return c.json({ success: true });
});

// POST /analytics/click/social/:id — anonymous
publicAnalyticsRoutes.post('/click/social/:id', async (c) => {
  const id = c.req.param('id');

  await prisma.socialLink.update({
    where: { id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });

  return c.json({ success: true });
});
