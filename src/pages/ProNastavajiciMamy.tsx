import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Send } from "lucide-react";
import TKLogo from "@/components/TKLogo";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const isValidCzechMobile = (raw: string) => {
  const digits = raw.replace(/[\s()-]/g, "").replace(/^(\+420|00420)/, "");
  if (!/^[67]\d{8}$/.test(digits)) return false;
  if (/^(\d)\1{8}$/.test(digits)) return false;
  if (digits === "123456789" || digits === "987654321") return false;
  return true;
};

const leadSchema = z.object({
  name: z.string().trim().min(1, "Vyplňte jméno").max(100),
  email: z.string().trim().email("Zadejte platný e-mail").max(255),
  phone: z
    .string()
    .trim()
    .refine(isValidCzechMobile, "Zadejte platné české mobilní číslo (např. 601 234 567)"),
});

const WEB3FORMS_KEY = "288ee3af-59f1-422a-8dc0-918c2e503d6b";
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/1mm2ym4r8qw9bh521kt6eb75qdljxbht";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const ProNastavajiciMamy = () => {
  const navigate = useNavigate();
  const painRef = useRef(null);
  const processRef = useRef(null);
  const toolRef = useRef(null);
  const guaranteeRef = useRef(null);
  const painInView = useInView(painRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const toolInView = useInView(toolRef, { once: true, margin: "-100px" });
  const guaranteeInView = useInView(guaranteeRef, { once: true, margin: "-100px" });

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const scrollToForm = () => {
    document.querySelector("#mamy-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        source: "/pro-nastavajici-mamy",
      };

      const [web3Res] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "Bezpečná hypotéka pro nastávající mámy (/pro-nastavajici-mamy)",
            ...payload,
          }),
        }),
        fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          body: new URLSearchParams(payload),
        }),
      ]);

      if (web3Res.status === "fulfilled" && web3Res.value.ok) {
        window.fbq?.("track", "Lead");
        navigate("/pro-nastavajici-mamy-dekujeme");
      } else {
        toast.error("Něco se pokazilo. Zkuste to prosím znovu.");
      }
    } catch {
      toast.error("Chyba při odesílání. Zkuste to prosím znovu.");
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "w-full bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container-narrow mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <TKLogo className="w-7 h-7 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            <span className="font-heading text-base sm:text-lg md:text-xl font-bold text-foreground truncate">
              Tereza <span className="hidden sm:inline text-gradient-gold">Kubečková</span>
            </span>
          </Link>
          <button
            onClick={scrollToForm}
            className="inline-flex flex-shrink-0 items-center gap-2 gold-gradient text-accent-foreground px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <span className="sm:hidden">Chci pomoct</span>
            <span className="hidden sm:inline">Chci vyřídit hypotéku bezpečně</span>
          </button>
        </div>
      </header>

      {/* SEC 1 — HERO, perfektní message-match na kreativy */}
      <section className="relative overflow-hidden bg-secondary">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,hsl(38_65%_75%/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,hsl(38_65%_80%/0.25),transparent_60%)]" />

        <div className="container-narrow mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <span className="inline-block bg-accent/10 border-2 border-accent/30 text-accent px-4 py-1.5 rounded text-sm sm:text-base font-extrabold tracking-wider uppercase">
                Jen pro budoucí mámy s vlastní rezervou
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-black text-foreground leading-[1.15] mb-8 tracking-tight"
            >
              Banka vám hypotéku spočítá ze dvou výplat. Vy ji budete splácet i s jednou.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed"
            >
              Pomáhám budoucím mámám nastavit hypotéku na skutečný život s miminkem — ne na tabulku banky, která s
              rodičovskou vůbec nepočítá. Abyste po porodu řešily miminko, ne to, jestli vám zbyde do výplaty.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={scrollToForm}
                className="gold-gradient cta-glow text-accent-foreground px-8 py-5 rounded-xl text-base sm:text-lg font-extrabold leading-snug hover:opacity-90 transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                Chci vyřídit hypotéku bezpečně pro rodinu →
              </button>
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                Tohle není pro každou. Je to pro budoucí mámy, které mají už našetřeno přes 500 000 Kč a bydlení
                chtějí vyřešit v příštích měsících — ne jen „se podívat, kolik by to bylo".
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEC 2 — Pasti bank a syrová realita */}
      <section className="section-padding bg-background" ref={painRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={painInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold text-accent tracking-wider uppercase mb-6 text-center">
              Dva platy dnes. Jeden plat a rodičák za pár měsíců.
            </p>
            <div className="space-y-5 text-muted-foreground text-base sm:text-lg leading-relaxed">
              <p>
                Dnes vyděláváte se svým partnerem <span className="text-foreground font-bold">90 000 Kč</span> měsíčně.
                Byt vypadá dosažitelně. Banka se na vás usměje a schválí přesně to, o co si řeknete.
              </p>
              <p className="text-foreground font-bold">Jenže do té tabulky nikdy nezadá jedno slovo: rodičovská.</p>
              <p>
                Za pár měsíců zůstane na účtu jeden plat a k němu rodičovský příspěvek. Splátka{" "}
                <span className="text-foreground font-bold">30 000 Kč</span> ale zůstává stejná. Pořád, každý měsíc, bez
                výjimky.
              </p>
              <p>
                Zbyde vám plyn, elektřina, pleny — a ten pátek večer, kdy otevřete bankovnictví, uvidíte odečtenou
                splátku a přemýšlíte, jestli vydržíte do výplaty.
              </p>
              <p>
                A přesně tohle jste si nešetřily těch 500 000 Kč na účtu, abyste zažily. Ne to, aby se z vysněného
                bytu najednou stal důvod počítat každou korunu u večeře.
              </p>
              <p>
                Byla jste zvyklá mít svoje peníze. Rozhodovat se sama za sebe, ne podle toho, co zbyde po splátce.
              </p>
              <p>
                A možná se bojíte i věci, o které se nahlas moc nemluví — že finance, které dnes nejsou problém, se
                najednou stanou tím, o čem se s partnerem hádáte. Tohle vám nikdo neřekne dopředu — dokud to
                nezažijete na vlastní kůži.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEC 3 — Jak probíhá spolupráce */}
      <section className="bg-primary py-16 md:py-20" ref={processRef}>
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white mb-2 text-center">
              Žádné spamování. Žádné zbytečné schůzky.
            </h2>
            <p className="text-primary-foreground/70 text-center mb-10 text-sm sm:text-base">
              Tři kroky, žádné otravné telefonáty navíc.
            </p>
            <div className="space-y-6">
              {[
                {
                  n: "1",
                  t: "Vyplníte krátký kontaktní formulář",
                  d: "Jméno, e-mail a telefon — necelou minutu, žádné papírování.",
                },
                {
                  n: "2",
                  t: "Zavolám vám na 15minutový hovor",
                  d: "Zjistím vaši reálnou situaci, ne jen kolik chcete půjčit.",
                },
                {
                  n: "3",
                  t: "Připravím kompletní plán a vyřídím hypotéku",
                  d: "S rezervou na rodičovskou, ne na dnešní dva platy.",
                },
              ].map((s) => (
                <div key={s.n} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center flex-shrink-0 font-black text-accent-foreground">
                    {s.n}
                  </div>
                  <div>
                    <p className="font-bold text-white text-base sm:text-lg">{s.t}</p>
                    <p className="text-primary-foreground/70 text-sm sm:text-base">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEC 4 — Kontaktní formulář */}
      <section id="mamy-form" className="section-padding bg-secondary" ref={toolRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-black text-foreground mb-4">
              Zjistíme, jak vypadá hypotéka, se kterou budete v klidu spát i na rodičovské.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Vyplňte krátký formulář. Ozvu se vám do 24 hodin s termínem na nezávazný 15minutový hovor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-5 sm:p-8"
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Jméno a příjmení</label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                  placeholder="Jana Nováková"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={inputClass}
                    placeholder="jana@email.cz"
                  />
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Telefon</label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={inputClass}
                    placeholder="+420 xxx xxx xxx"
                    inputMode="tel"
                  />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full gold-gradient cta-glow text-accent-foreground py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                {sending ? "Odesílám…" : "Chci vyřídit hypotéku bezpečně pro rodinu →"}
              </button>

              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                🔒 Vaše údaje jsou 100% v bezpečí. Ozvu se vám do 24 hodin s termínem hovoru.
              </p>

              <p className="text-center text-xs text-muted-foreground leading-relaxed">
                Odesláním souhlasíte se{" "}
                <Link to="/gdpr" className="text-accent hover:underline font-medium" target="_blank">
                  zpracováním osobních údajů
                </Link>{" "}
                za účelem vyřízení poptávky.
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* SEC 5 — Osobní garance & autorita */}
      <section className="section-padding bg-background" ref={guaranteeRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={guaranteeInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glass-card p-6 sm:p-10"
          >
            <div className="flex justify-center mb-6">
              <img
                src="/hero-portrait.webp"
                alt="Tereza Kubečková"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-accent/40 shadow-lg"
              />
            </div>
            <p className="text-sm font-bold text-accent tracking-wider uppercase mb-6 text-center">
              Ode mě osobně
            </p>
            <div className="space-y-5 text-foreground text-base sm:text-lg leading-relaxed">
              <p>
                Jmenuju se <span className="font-bold">Tereza Kubečková</span> a roky řeším hypotéky rodinám, které
                se nechtějí po porodu budit v noci s úzkostí z výpisu z účtu.
              </p>
              <p>
                Banky vidí čísla. Já vidím lidi. Vidím ženu, co se bojí, že přijde o svobodu, na kterou si roky
                vydělávala. Vidím pár, co si spočítal splátku na dnešní dva platy a netuší, že za rok bude počítat
                úplně jinou matematiku.
              </p>
              <p className="font-bold">
                Proto nedělám hypotéky „na maximum, co vám banka dá". Dělám je na to, co reálně přežijete i s jedním
                platem a rodičákem na účtu.
              </p>
              <p>
                Aby vaše rodičovská byla o miminku, procházkách a nedělních obědech s rodinou — ne o tabulce v
                excelu.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reference — důvěra */}
      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default ProNastavajiciMamy;
