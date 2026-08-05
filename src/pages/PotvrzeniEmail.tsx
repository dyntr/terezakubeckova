import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TKLogo from "@/components/TKLogo";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

type Status = "loading" | "success" | "error";

const PotvrzeniEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const requested = useRef(false);

  useEffect(() => {
    if (requested.current) return;
    requested.current = true;

    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setErrorMsg("Chybí potvrzovací kód. Zkuste prosím odkaz z e-mailu otevřít znovu.");
      return;
    }

    fetch("/api/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.ok) {
          window.fbq?.("track", "Lead");
          setName(data.name || "");
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Nepodařilo se potvrdit zájem. Zkuste to prosím znovu.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Nepodařilo se potvrdit zájem. Zkuste to prosím znovu.");
      });
  }, [searchParams]);

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
          {status === "loading" && (
            <>
              <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-muted-foreground">Potvrzuji váš zájem…</p>
            </>
          )}

          {status === "success" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
                Díky{name ? `, ${name.split(" ")[0]}` : ""}! Zájem je potvrzený.
              </h1>
              <p className="text-muted-foreground mb-8">
                Vaši bezpečnou splátku vám pošlu do 24 hodin. Mezitím se můžete vrátit na hlavní stránku.
              </p>
              <Link
                to="/"
                className="gold-gradient text-accent-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:opacity-90 transition-opacity"
              >
                Zpět na hlavní stránku
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">Něco se nepovedlo</h1>
              <p className="text-muted-foreground mb-8">{errorMsg}</p>
              <Link
                to="/lepsi-zivot"
                className="gold-gradient text-accent-foreground px-6 py-3 rounded-lg font-semibold inline-block hover:opacity-90 transition-opacity"
              >
                Vyplnit formulář znovu
              </Link>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PotvrzeniEmail;
