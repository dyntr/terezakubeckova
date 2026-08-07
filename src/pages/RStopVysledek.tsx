import { Link, useLocation } from "react-router-dom";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import TKLogo from "@/components/TKLogo";
import Footer from "@/components/Footer";
import {
  formatKc,
  STANDARD_RATE_PCT,
  STANDARD_YEARS,
  PARENTAL_INCOME_SHARE_PCT,
  SAFE_PAYMENT_SHARE_PCT,
  type RStopResult,
} from "@/lib/rstopCalc";

const RStopVysledek = () => {
  const location = useLocation();
  const result = location.state as RStopResult | null;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0f]">
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b-2 border-accent/30">
        <div className="container-narrow mx-auto flex items-center px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <TKLogo className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            <span className="font-heading text-base sm:text-lg md:text-xl font-bold text-white">
              Tereza <span className="text-gradient-gold">Kubečková</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          {!result ? (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white mb-4">
                Tenhle výsledek nemáme
              </h1>
              <p className="text-white/50 mb-8 leading-relaxed">
                Odkaz vypršel nebo jste na stránku přišli přímo. Vyplňte prosím R-STOP test znovu.
              </p>
              <Link
                to="/r-stop"
                className="gold-gradient text-accent-foreground px-6 py-3 rounded-lg font-bold inline-block hover:opacity-90 transition-opacity"
              >
                Spustit R-STOP test
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2">
                  Díky! Poptávka je odeslaná. ✅
                </h1>
                <p className="text-white/50 text-sm sm:text-base">
                  Přesný R-STOP (DTI2) na míru vám pošlu do 24 hodin. Mezitím tady je váš orientační výsledek.
                </p>
              </div>

              <div className="rounded-xl border-2 border-accent/50 bg-black p-6 sm:p-8 text-center">
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-2">
                  Váš orientační výsledek
                </p>
                <p className="text-sm sm:text-base text-white/60 mb-6">
                  R-STOP (DTI2) — bezpečná splátka na rodičovské
                </p>

                <div className="text-5xl sm:text-6xl md:text-7xl font-black text-gradient-gold leading-none mb-2 tabular-nums">
                  {formatKc(result.rStop)}
                </div>
                <p className="text-white/40 text-xs sm:text-sm mb-8">měsíčně</p>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                  <div className="rounded-xl border border-red-400/30 bg-red-400/10 p-4">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-red-300 mb-1">
                      Standardní výpočet by vám nabídl
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-white/70 line-through decoration-red-400/70 tabular-nums">
                      {formatKc(result.standardPayment)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-accent/40 bg-accent/10 p-4">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-accent mb-1">
                      Váš bezpečný R-STOP
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-white tabular-nums">{formatKc(result.rStop)}</p>
                  </div>
                </div>

                {result.gap > 0 ? (
                  <p className="mt-5 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-red-300">
                    <AlertTriangle size={18} className="flex-shrink-0" />
                    Rozdíl {formatKc(result.gap)} měsíčně mezi tím, co vám nabídnou, a tím, co je bezpečné.
                  </p>
                ) : (
                  <p className="mt-5 flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-emerald-300">
                    <ShieldCheck size={18} className="flex-shrink-0" />
                    Podle odhadu jste v bezpečném pásmu.
                  </p>
                )}

                <p className="mt-5 text-[11px] sm:text-xs text-white/30 leading-relaxed">
                  Orientační odhad z vašich odpovědí (sazba {STANDARD_RATE_PCT.toString().replace(".", ",")} % p.a.,{" "}
                  {STANDARD_YEARS} let; na rodičovské cca {PARENTAL_INCOME_SHARE_PCT} % dnešního příjmu, bezpečná
                  splátka max. {SAFE_PAYMENT_SHARE_PCT} % z něj).
                </p>
              </div>

              <div className="text-center mt-8">
                <Link to="/" className="text-white/40 hover:text-accent text-sm transition-colors">
                  Zpět na hlavní stránku
                </Link>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RStopVysledek;
