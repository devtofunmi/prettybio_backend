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

export const incrementLinkClick = async (linkId: string) => {
  return await prisma.link.update({
    where: { id: linkId },
    data: { clickCount: { increment: 1 } },
  });
};

export const incrementSocialClick = async (socialLinkId: string) => {
  return await prisma.socialLink.update({
    where: { id: socialLinkId },
    data: { clickCount: { increment: 1 } },
  });
};

export const addPageView = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0];

  const existing = await prisma.pageView.findFirst({
    where: { userId, date: new Date(today) },
  });

  if (existing) {
    await prisma.pageView.update({
      where: { id: existing.id },
      data: { views: { increment: 1 } },
    });
  } else {
    await prisma.pageView.create({
      data: {
        userId,
        date: new Date(today),
        views: 1,
      },
    });
  }
};


