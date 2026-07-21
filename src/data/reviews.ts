// Google recenze – Tereza Kubečková
// ---------------------------------------------------------------------------
// Profil na Mapách Google:  https://maps.app.goo.gl/qRJfhZGuTADjBzmw6
// CID:        10598494637910266256
// FTID (hex): 0x470b9586742d1bf1:0x93156ab84e861190
// Feature ID: /g/11z81436gr
//
// Tato data jsou ověřené reálné recenze z Google profilu (stav: 21. 7. 2026).
// Sekce je připravená i na ŽIVÉ načítání přes Google Places API – stačí do
// .env doplnit VITE_GOOGLE_PLACES_API_KEY a VITE_GOOGLE_PLACE_ID (formát
// "ChIJ…"), zbytek řeší hook useGoogleReviews(). Když klíč chybí, použijí se
// tyto ověřené recenze níže, takže web funguje vždy.

export interface GoogleReview {
  /** Jméno autora přesně tak, jak je uvedeno na Google */
  author: string;
  /** Počet hvězdiček 1–5 */
  rating: number;
  /** Datum recenze (ISO) – relativní čas se dopočítává v UI */
  date: string;
  /** Text recenze */
  text: string;
}

export const GOOGLE_PROFILE_URL = "https://maps.app.goo.gl/qRJfhZGuTADjBzmw6";

// Odkaz, který otevře přímo VÝPIS VŠECH recenzí na Google (záložka recenze
// je aktivní díky `!9m1!1b1`), takže návštěvník je uvidí hned.
export const GOOGLE_ALL_REVIEWS_URL =
  "https://www.google.com/maps/place/Tereza+Kube%C4%8Dkov%C3%A1/@50.0932528,14.4378452,17z/data=!4m8!3m7!1s0x470b9586742d1bf1:0x93156ab84e861190!8m2!3d50.0932528!4d14.4378452!9m1!1b1";

// Odkaz „Napsat recenzi" – oficiální „write review" zkrácený odkaz z Google
// Business Profilu (otevře rovnou formulář pro přidání hodnocení).
export const GOOGLE_WRITE_REVIEW_URL = "https://g.page/r/CZARhk64ahWTEBM/review";

export const GOOGLE_RATING = 5.0;
export const GOOGLE_REVIEW_COUNT = 7;

export const googleReviews: GoogleReview[] = [
  {
    author: "Mirka Fedoryk",
    rating: 5,
    date: "2026-07-21",
    text:
      "Velice děkujeme za vaši ochotu a trpělivost, jste profíci ve svém oboru. Jsme moc rádi, že jste nám věnovali tolik času a pomohli nám. Nyní můžeme bydlet ve vysněném domečku. Z celého srdce doporučujeme",
  },
  {
    author: "Adam Kurka",
    rating: 5,
    date: "2026-07-15",
    text:
      "Výborná zkušenost s paní Kubečkovou. Oceňuji profesionální přístup, ochotu a trpělivost při vysvětlování všech možností a za to upřímně děkuji.",
  },
  {
    author: "Vojta Krejčí",
    rating: 5,
    date: "2026-06-06",
    text:
      "Služby finanční poradkyně Terezy K. mohu jen doporučit. Veškeré informace a potřebné záležitosti byly vyřízeny rychle a profesionálně. Finální detaily jsme s paní asistentkou Míšou doladili na výbornou. Oceňuji vstřícný přístup, skvělou komunikaci a bezproblémový průběh celé spolupráce.",
  },
  {
    author: "Monika Vyhlídková",
    rating: 5,
    date: "2026-06-05",
    text:
      "Slečna Tereza je moc šikovná, vždy je nabitá informacemi a umí poradit, v případě potřeby vyřešit co je potřeba, ať už šlo v mém případě o pojištění vozu, domácnosti nebo investice. Chválím přátelský přístup a rychlé vyřízení, její služby moc doporučuji.",
  },
  {
    author: "Michaela Milotová",
    rating: 5,
    date: "2026-06-03",
    text:
      "Skvělá zkušenost s finančním poradenstvím. Slečna Kubečková je velmi profesionální, ochotná a vše dokáže vysvětlit jednoduše a srozumitelně. Pomohla mi najít vhodné řešení a vždy jednala v mém nejlepším zájmu. Doporučuji všemi deseti.",
  },
  {
    author: "Margret Santiová",
    rating: 5,
    date: "2026-06-03",
    text:
      "Terka je skvělá, stará se o naší celou rodinu téměř od začátku své kariéry. Je to extrémně spolehlivý a pracovitý člověk u kterého je vidět, že svou práci dělá srdcem. Děkujeme Terko, Santiovi.",
  },
];

// ---- pomocné funkce pro UI ------------------------------------------------

/** Iniciály pro avatar, např. "Vojta Krejčí" -> "VK" */
export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** Stabilní barva avataru odvozená od jména */
const AVATAR_COLORS = [
  "bg-[#1a73e8]",
  "bg-[#34a853]",
  "bg-[#ea4335]",
  "bg-[#fbbc04]",
  "bg-[#a142f4]",
  "bg-[#ff6d00]",
];
export const avatarColor = (name: string) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
};

/** Česká relativní doba „před X dny / týdny / měsíci" */
export const relativeCzech = (iso: string) => {
  const then = new Date(iso).getTime();
  const days = Math.max(0, Math.round((Date.now() - then) / 86_400_000));
  if (days <= 0) return "dnes";
  if (days === 1) return "včera";
  if (days < 7) return `před ${days} dny`;
  const weeks = Math.round(days / 7);
  if (days < 31) return weeks === 1 ? "před týdnem" : `před ${weeks} týdny`;
  const months = Math.round(days / 30);
  if (days < 365) return months === 1 ? "před měsícem" : `před ${months} měsíci`;
  const years = Math.round(days / 365);
  return years === 1 ? "před rokem" : `před ${years} lety`;
};
