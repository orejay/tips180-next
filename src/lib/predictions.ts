import { api } from "@/lib/api";

/**
 * Home-page prediction + testimonial data. All three endpoints are public:
 *  - GET /tips/recent-win     -> CardMatch[]  (winning tips, last 20)
 *  - GET /matches/upcoming    -> CardMatch[]  (upcoming tips)
 *  - GET /feedbacks           -> Feedback[]   (active testimonials)
 * Fetched server-side so predictions land in the initial HTML. Fail-soft.
 */

/** Match row from the backend `card_model` (cardformat). */
export type CardMatch = {
  id: number;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  time?: string | null;
  league: string;
  name: string;
  fttip: string | null;
  ftscore: string | null;
  ft_odds: string | null;
  upcoming_tip?: string | null;
};

export type Feedback = {
  name: string;
  message: string;
  country: string;
};

export async function getRecentWins(): Promise<CardMatch[]> {
  try {
    return await api<CardMatch[]>("tips/recent-win", {
      next: { revalidate: 600 },
    });
  } catch {
    return [];
  }
}

export async function getFreeExperts(): Promise<CardMatch[]> {
  try {
    return await api<CardMatch[]>("tips/free-experts", {
      next: { revalidate: 300 },
    });
  } catch {
    return [];
  }
}

export async function getUpcomingMatches(): Promise<CardMatch[]> {
  try {
    return await api<CardMatch[]>("matches/upcoming", {
      next: { revalidate: 600 },
    });
  } catch {
    return [];
  }
}

export async function getFeedbacks(): Promise<Feedback[]> {
  try {
    return await api<Feedback[]>("feedbacks", {
      next: { revalidate: 3600 },
    });
  } catch {
    return [];
  }
}

/** ISO date (YYYY-MM-DD) -> "dd/mm" for the compact home tables. */
export function formatDayMonth(iso: string): string {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}` : iso ?? "";
}
