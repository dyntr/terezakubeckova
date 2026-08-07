import { Link, useLocation } from "react-router-dom";
import TKLogo from "@/components/TKLogo";
import Footer from "@/components/Footer";

type LocationState = { email?: string } | null;

const LepsiZivotDekujeme = () => {
  const location = useLocation();
  const email = (location.state as LocationState)?.email;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/50">
        <div className="container-narrow mx-auto flex items-center px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <TKLogo className="w-7 h-7 sm:w-8 sm:h-8 text-accent" />
            <span className="font-heading text-lg font-semibold text-foreground">
              Tereza <span className="text-gradient-gold">Kubečková</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
            Zkontrolujte e-mail 📩
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {email ? (
              <>
                Poslali jsme vám potvrzovací e-mail na <span className="font-semibold text-foreground">{email}</span>
                . Klikněte na tlačítko uvnitř a hned se pustím do výpočtu vaší bezpečné splátky.
              </>
            ) : (
              <>Poslali jsme vám potvrzovací e-mail. Klikněte na tlačítko uvnitř a hned se pustím do výpočtu vaší bezpečné splátky.</>
            )}
          </p>
          <p className="text-muted-foreground text-xs mb-8">Nic nepřišlo? Zkontrolujte prosím i spam/hromadné.</p>
          <Link
            to="/"
            className="gold-gradient text-accent-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:opacity-90 transition-opacity"
          >
            Zpět na hlavní stránku
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LepsiZivotDekujeme;
