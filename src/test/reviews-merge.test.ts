import { describe, expect, it } from "vitest";
import { mergeReviews, presentReviews } from "../../functions/api/reviews.js";

type Rv = {
  author: string;
  rating: number;
  date: string;
  text: string;
  src?: string;
};

const rv = (author: string, date: string, extra: Partial<Rv> = {}): Rv => ({
  author,
  rating: 5,
  date,
  text: `Recenze od ${author}`,
  ...extra,
});

describe("mergeReviews – akumulace recenzí v KV", () => {
  it("přidá nového autora z API a zachová uložené recenze, které API už nevrací", () => {
    const stored = [rv("Mirka Fedoryk", "2026-07-21", { src: "scrape" })];
    const incoming = [rv("Monika Vyhlidkova", "2026-06-05")];

    const merged = mergeReviews(stored, incoming);

    expect(merged).toHaveLength(2);
    expect(merged.map((r) => r.author)).toContain("Mirka Fedoryk");
    expect(merged.map((r) => r.author)).toContain("Monika Vyhlidkova");
  });

  it("API verze nahradí scrapovanou verzi téhož autora (přesnější datum z API)", () => {
    const stored = [rv("Adam Kurka", "2026-07-15", { src: "scrape" })];
    const incoming = [rv("Adam Kurka", "2026-07-15T09:12:00Z")];

    const merged = mergeReviews(stored, incoming);

    expect(merged).toHaveLength(1);
    expect(merged[0].date).toBe("2026-07-15T09:12:00Z");
    expect(merged[0].src).toBe("api");
  });

  it("editovaná recenze z API přepíše starší API záznam téhož autora", () => {
    const stored = [
      rv("Patrick Dyntr", "2026-06-09", { src: "api", text: "Stará verze" }),
    ];
    const incoming = [rv("Patrick Dyntr", "2026-06-10", { text: "Nová verze" })];

    const merged = mergeReviews(stored, incoming);

    expect(merged).toHaveLength(1);
    expect(merged[0].text).toBe("Nová verze");
  });
});

describe("presentReviews – payload pro web", () => {
  it("řadí od nejnovější, pustí jen 5★ s textem a odstraní interní pole src", () => {
    const list = [
      rv("Stará", "2026-06-02", { src: "api" }),
      rv("Nejnovější", "2026-07-21T13:40:00Z", { src: "scrape" }),
      rv("Čtyřhvězda", "2026-07-20", { rating: 4 }),
      rv("Bez textu", "2026-07-19", { text: "  " }),
      rv("Novější", "2026-07-15"),
    ];

    const out = presentReviews(list);

    expect(out.map((r) => r.author)).toEqual(["Nejnovější", "Novější", "Stará"]);
    expect(out.every((r) => !("src" in r))).toBe(true);
  });
});
