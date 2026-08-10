import { Link } from "react-router-dom";
import TKLogo from "@/components/TKLogo";
import Footer from "@/components/Footer";

const StresTestDekujeme = () => {
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
            Díky! Poptávka je odeslaná. ✅
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Ozveme se vám do 24 hodin s termínem na 15minutový diagnostický hovor R-STOP. Mezitím se můžete vrátit na
            hlavní stránku.
          </p>
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

export default StresTestDekujeme;
