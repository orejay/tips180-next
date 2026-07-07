import { api } from "@/lib/api";
import type { CardMatch } from "@/lib/predictions";

/**
 * Remaining home-page feeds (announcement bar, smart-bet promo, league tips,
 * sports news). All public, fail-soft.
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

export type LeagueTips = {
  epl: CardMatch[];
  la_liga: CardMatch[];
  seria_a: CardMatch[];
  bundesliga: CardMatch[];
};

export async function getAnnouncement(): Promise<Announcement | null> {
  try {
    const data = await api<Announcement>("announcements", {
      next: { revalidate: 600 },
    });
    return data && data.id && data.active !== false ? data : null;
  } catch {
    return null;
  }
}

export async function getNextSmartBet(): Promise<NextSmartBet[]> {
  try {
    return await api<NextSmartBet[]>("tips/next-smartbet", { next: { revalidate: 600 } });
  } catch {
    return [];
  }
}

export async function getLeagueTips(): Promise<LeagueTips | null> {
  try {
    return await api<LeagueTips>("tips/leagues", { next: { revalidate: 300 } });
  } catch {
    return null;
  }
}

export async function getNews(): Promise<NewsItem[]> {
  try {
    return await api<NewsItem[]>("news", { next: { revalidate: 1800 } });
  } catch {
    return [];
  }
}
