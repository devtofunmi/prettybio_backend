import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface LinkStat {
  id: string;
  url: string;
  clickCount: number;
}

export interface SocialStat {
  id: string;
  url: string;
  clickCount: number;
}

export interface PageView {
  date: string;
  views: number;
}

export const getLinkAnalytics = async (userId: string): Promise<LinkStat[]> => {
  return await prisma.link.findMany({
    where: { userId },
    select: {
      id: true,
      url: true,
      clickCount: true,
    },
  });
};

export const getSocialLinkAnalytics = async (userId: string): Promise<SocialStat[]> => {
  return await prisma.socialLink.findMany({
    where: { userId },
    select: {
      id: true,
      url: true,
      clickCount: true,
    },
  });
};

export const getPageViews = async (userId: string): Promise<PageView[]> => {
  const pageViews = await prisma.pageView.findMany({
    where: { userId },
    select: {
      date: true,
      views: true,
    },
    orderBy: { date: 'desc' },
    take: 5, // Limit to the last 5 days
  });

  return pageViews.map((view) => ({
    date: view.date.toISOString(),
    views: view.views,
  }));
};

