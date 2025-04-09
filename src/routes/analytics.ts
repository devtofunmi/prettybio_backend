// routes/analytics.ts
import { Hono } from 'hono';
import { getLinkAnalytics, getSocialLinkAnalytics, getPageViews } from '../controllers/analytics.js';

export const analyticsRoutes = new Hono();

// GET /analytics/links/:userId
analyticsRoutes.get('/links/:userId', async (c) => {
  const userId = c.req.param('userId');
  const links = await getLinkAnalytics(userId);
  return c.json(links);
});

// GET /analytics/social-links/:userId
analyticsRoutes.get('/social-links/:userId', async (c) => {
  const userId = c.req.param('userId');
  const socialLinks = await getSocialLinkAnalytics(userId);
  return c.json(socialLinks);
});

// GET /analytics/page-views/:userId
analyticsRoutes.get('/page-views/:userId', async (c) => {
  const userId = c.req.param('userId');
  const views = await getPageViews(userId);
  return c.json(views);
});

