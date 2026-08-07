// Sdílená logika orientačního výpočtu R-STOP (DTI2) — používá ji /r-stop
// (kalkulace) i /r-stop-vysledek (zobrazení po odeslání formuláře), aby se
// vzorec/konstanty neduplikovaly a časem nerozjely.

export const incomeMidpoint: Record<string, number> = {
  "do 60 000 Kč": 50_000,
  "60 000 – 80 000 Kč": 70_000,
  "80 000 – 110 000 Kč": 95_000,
  "110 000 Kč a více": 130_000,
};

export const mortgageMidpoint: Record<string, number> = {
  "do 4 mil. Kč": 3_500_000,
  "4 – 6 mil. Kč": 5_000_000,
  "6 – 8 mil. Kč": 7_000_000,
  "Více než 8 mil. Kč / Nevím, chci poradit": 9_000_000,
};

export const STANDARD_RATE_PCT = 5.3;
export const STANDARD_YEARS = 30;
export const PARENTAL_INCOME_SHARE_PCT = 55;
export const SAFE_PAYMENT_SHARE_PCT = 35;

export const roundToHundred = (n: number) => Math.round(n / 100) * 100;
export const formatKc = (n: number) => `${n.toLocaleString("cs-CZ")} Kč`;

export const calcAnnuityPayment = (principal: number, annualRatePct: number, years: number) => {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

export type RStopResult = { standardPayment: number; rStop: number; gap: number };

export const calcRStopResult = (prijem: string, hypoteka: string): RStopResult | null => {
  const income = incomeMidpoint[prijem];
  const mortgage = mortgageMidpoint[hypoteka];
  if (!income || !mortgage) return null;

  const standardPayment = roundToHundred(calcAnnuityPayment(mortgage, STANDARD_RATE_PCT, STANDARD_YEARS));
  const rStop = roundToHundred(income * (PARENTAL_INCOME_SHARE_PCT / 100) * (SAFE_PAYMENT_SHARE_PCT / 100));
  const gap = standardPayment - rStop;

  return { standardPayment, rStop, gap };
};
