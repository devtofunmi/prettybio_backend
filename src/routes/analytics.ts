import { Hono } from 'hono';
import { getLinkAnalytics, getSocialLinkAnalytics, addPageView } from '../controllers/analytics.js';
import { verifyToken } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';
export const analyticsRoutes = new Hono<{ Variables: { userId: string } }>();
const prisma = new PrismaClient();


// Authorization middleware to check for a valid token
analyticsRoutes.use(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return c.json({ error: 'Unauthorized: No token provided' }, 401);
  }

  try {
    const payload = await verifyToken(token);
    c.set('userId', payload.id); // Attach userId to context
    await next();
  } catch (err) {
    return c.json({ error: 'Unauthorized: Invalid token' }, 401);
  }
});

// Analytics routes
analyticsRoutes.get('/links', async (c) => {
  const userId = c.get('userId');
  const links = await getLinkAnalytics(userId);
  return c.json(links);
});

analyticsRoutes.get('/social-links', async (c) => {
  const userId = c.get('userId');
  const socialLinks = await getSocialLinkAnalytics(userId);
  return c.json(socialLinks);
});

// analyticsRoutes.get('/page-views', async (c) => {
//   const userId = c.get('userId');
//   const views = await getPageViews(userId);
//   return c.json(views);
// });

export const incrementLinkClick = async (id: string) => {
  await prisma.link.update({
    where: { id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
};

export const incrementSocialClick = async (id: string) => {
  await prisma.socialLink.update({
    where: { id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
};

analyticsRoutes.post('/page-view', async (c) => {
  const userId = c.get('userId');
  await addPageView(userId);
  return c.json({ success: true });
});