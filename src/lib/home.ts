import { api } from "@/lib/api";

/**
 * Remaining home-page feeds (announcement bar, smart-bet promo, sports news).
 * All public, fail-soft.
 */

export type Announcement = {
  id: number;
  caption: string;
  body: string;
  active: boolean;
};

export type NextSmartBet = {
  nextsmartbet: string;
  smartbetodds: string;
  nextsmartbetplus: string;
};

export type NewsItem = {
  id: number;
  date: string;
  image_link: string;
  caption: string;
  news_link: string;
};

export async function getAnnouncement(): Promise<Announcement | null> {
  try {
    const data = await api<Announcement>("announcements", {
      next: { revalidate: 600, tags: ["announcements"] },
    });
    return data && data.id && data.active !== false ? data : null;
  } catch {
    return null;
  }
}

export async function getNextSmartBet(): Promise<NextSmartBet[]> {
  try {
    return await api<NextSmartBet[]>("tips/next-smartbet", {
      next: { revalidate: 600, tags: ["matches"] },
    });
  } catch {
    return [];
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    return await api<NewsItem[]>("news", {
      next: { revalidate: 1800, tags: ["news"] },
    });
  } catch {
    return [];
  }
}
