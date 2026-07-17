import { useEffect, useState } from "react";
import {
  googleReviews as seedReviews,
  GOOGLE_RATING as seedRating,
  GOOGLE_REVIEW_COUNT as seedCount,
  type GoogleReview,
} from "@/data/reviews";

interface GoogleReviewsState {
  reviews: GoogleReview[];
  rating: number;
  count: number;
  /** true = data přišla živě z Google (přes /api/reviews) */
  live: boolean;
}

// Zobrazujeme jen 5hvězdičkové recenze.
const fiveStar = (list: GoogleReview[]) => list.filter((r) => r.rating >= 5);

const SEED: GoogleReviewsState = {
  reviews: fiveStar(seedReviews),
  rating: seedRating,
  count: seedCount,
  live: false,
};

/**
 * Vrací Google recenze. Zkusí načíst ŽIVÁ data z naší Cloudflare Pages Function
 * `/api/reviews` (ta tahá z Google Places API server-side a vrací jen 5★).
 * Při jakékoli chybě (funkce bez klíče, offline, špatná odpověď) tiše zůstanou
 * ověřené (seed) recenze, takže web vždy něco zobrazí.
 */
export const useGoogleReviews = (): GoogleReviewsState => {
  const [state, setState] = useState<GoogleReviewsState>(SEED);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/reviews", { signal: controller.signal });
        if (!res.ok) return;
        const data = await res.json();
        if (!data?.live || !Array.isArray(data.reviews)) return;

        const live = fiveStar(data.reviews as GoogleReview[]);
        if (live.length > 0) {
          setState({
            reviews: live,
            rating: typeof data.rating === "number" ? data.rating : seedRating,
            count: typeof data.count === "number" ? data.count : live.length,
            live: true,
          });
        }
      } catch {
        // ponecháme ověřené recenze
      }
    })();

    return () => controller.abort();
  }, []);

  return state;
};
