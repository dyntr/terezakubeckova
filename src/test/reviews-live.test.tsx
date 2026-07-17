import { readFileSync } from "node:fs";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, afterEach, describe, expect, it, vi } from "vitest";
import ReviewsSection from "@/components/ReviewsSection";

// Reálná odpověď, kterou vrací nasazený endpoint https://terezakubeckova.cz/api/reviews
// (zachycená do fixture). Tím testujeme render proti skutečným živým datům z Googlu.
const prodPayload = JSON.parse(
  readFileSync("src/test/fixtures/reviews-prod.json", "utf8"),
);

// jsdom nemá IntersectionObserver (framer-motion useInView) ani ResizeObserver (embla).
beforeAll(() => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // @ts-expect-error – test polyfill
  globalThis.IntersectionObserver = NoopObserver;
  // @ts-expect-error – test polyfill
  globalThis.ResizeObserver = NoopObserver;
});

afterEach(() => vi.restoreAllMocks());

describe("ReviewsSection – živé Google recenze z produkce", () => {
  it("nahradí seed živými daty: vyrenderuje recenzi 'Patrick Dyntr' (jen v živých datech) a počet 5", async () => {
    // sanity: payload je opravdu živý
    expect(prodPayload.live).toBe(true);
    expect(prodPayload.reviews.length).toBe(5);

    global.fetch = vi.fn(async (url: string) => {
      expect(String(url)).toContain("/api/reviews");
      return {
        ok: true,
        json: async () => prodPayload,
      } as Response;
    }) as unknown as typeof fetch;

    render(<ReviewsSection />);

    // "Patrick Dyntr" NENÍ v seedu (4 recenze) → jeho výskyt = důkaz, že se vyrenderovala ŽIVÁ data.
    await waitFor(() => {
      expect(screen.getByText("Patrick Dyntr")).toBeInTheDocument();
    });

    // všechny živé recenze 5★ jsou v DOM
    for (const r of prodPayload.reviews) {
      expect(screen.getByText(r.author)).toBeInTheDocument();
    }

    // souhrnná karta ukazuje hodnocení 5,0 a počet 5 recenzí
    expect(screen.getByText("5,0")).toBeInTheDocument();
    expect(screen.getByText(/^5\s+recenzí$/)).toBeInTheDocument();
  });
});
