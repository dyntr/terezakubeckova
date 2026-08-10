import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Send, ChevronLeft, Check } from "lucide-react";
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

const questions = [
  {
    key: "dluhy",
    question: "Máte exekuce nebo jakékoliv jiné dluhy (kromě hypotéky)?",
    options: ["Ne, nemám", "Ano, mám"],
  },
  {
    key: "situace",
    question: "V jaké fázi bydlení a rodiny jste?",
    options: [
      "Hledáme/kupujeme bydlení, rodinu plánujeme",
      "Bydlení řešíme souběžně s těhotenstvím",
      "Bydlení máme, řešíme rozpočet na dítě/rodičovskou",
    ],
  },
  {
    key: "rezerva",
    question: "Máte našetřeno alespoň 200 000 Kč rezervy nebo vlastního kapitálu?",
    options: ["Ano, mám", "Ne, nemám"],
  },
] as const;

const DEBT_DISQUALIFY_OPTION = "Ano, mám";
const RESERVE_DISQUALIFY_OPTION = "Ne, nemám";

type AnswerKey = (typeof questions)[number]["key"];
type Answers = Record<AnswerKey, string>;

const StresTest = () => {
  const navigate = useNavigate();
  const painRef = useRef(null);
  const identityRef = useRef(null);
  const mechanismRef = useRef(null);
  const toolRef = useRef(null);
  const painInView = useInView(painRef, { once: true, margin: "-100px" });
  const identityInView = useInView(identityRef, { once: true, margin: "-100px" });
  const mechanismInView = useInView(mechanismRef, { once: true, margin: "-100px" });
  const toolInView = useInView(toolRef, { once: true, margin: "-100px" });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ dluhy: "", situace: "", rezerva: "" });
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [disqualified, setDisqualified] = useState(false);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const scrollToForm = () => {
    document.querySelector("#stres-test-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectAnswer = (key: AnswerKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (key === "dluhy" && value === DEBT_DISQUALIFY_OPTION) {
      setDisqualified(true);
      return;
    }
    if (key === "rezerva" && value === RESERVE_DISQUALIFY_OPTION) {
      setDisqualified(true);
      return;
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (disqualified) {
      setDisqualified(false);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
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
        dluhy: answers.dluhy,
        situace: answers.situace,
        rezerva: answers.rezerva,
        source: "/stres-test",
      };

      const [web3Res] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "Stres-Test R-STOP – termín na hovor (/stres-test)",
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
        navigate("/stres-test-dekujeme");
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
    "w-full bg-white/5 border-2 border-white/15 rounded-lg px-4 py-3 text-base text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-shadow";

  const totalSteps = questions.length + 1;
  const progressPct = ((step + 1) / totalSteps) * 100;
  const currentQuestion = step < questions.length ? questions[step] : null;

  return (
    <div className="min-h-screen">
      {/* Header — tmavý, ostrý */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-md border-b-2 border-accent/30">
        <div className="container-narrow mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <TKLogo className="w-7 h-7 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            <span className="font-heading text-base sm:text-lg md:text-xl font-bold text-white truncate">
              Tereza <span className="hidden sm:inline text-gradient-gold">Kubečková</span>
            </span>
          </Link>
          <button
            onClick={scrollToForm}
            className="inline-flex flex-shrink-0 items-center gap-2 gold-gradient text-accent-foreground px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <span className="sm:hidden">Můj R-STOP</span>
            <span className="hidden sm:inline">Chci znát svůj R-STOP</span>
          </button>
        </div>
      </header>

      {/* SEC 1 — HERO */}
      <section className="relative overflow-hidden bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,hsl(0_60%_25%/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,hsl(38_65%_30%/0.25),transparent_60%)]" />

        <div className="container-narrow mx-auto px-5 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-6"
            >
              <span className="inline-block bg-red-500/10 border-2 border-red-500/40 text-red-400 px-4 py-1.5 rounded text-sm sm:text-base font-extrabold tracking-wider uppercase">
                Banka vám spočítala vaše maximum. Na rodičák zapomněla.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-body font-black text-white leading-[1.15] mb-8 tracking-tight"
            >
              Dnes na hypotéku stačí dva platy. Za rok budete potřebovat dvojnásobnou jistotu — a mít jen polovinu
              příjmu.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-white/60 mb-10 leading-relaxed"
            >
              R-STOP — Rodičovský Strop Bezpečné Splátky — je jediné číslo, které vám ukáže přesné dno vašeho
              rozpočtu. Dřív, než ho najdete sami, s prázdným kontem a dítětem v náručí.
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
                Chci znát svůj R-STOP
              </button>
              <p className="mt-4 text-xs sm:text-sm text-white/50 max-w-sm mx-auto">
                Tenhle test je pro páry, co to myslí vážně a mají aspoň nějakou rezervu. Pokud hledáte zázrak bez
                vlastních úspor, ušetříme si čas oba.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEC 2 — Prohloubení bolesti */}
      <section className="section-padding bg-[#0a0a0f]" ref={painRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={painInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold text-red-400 tracking-wider uppercase mb-6 text-center">
              Skrytá past, kterou banka nikdy nespočítá
            </p>
            <div className="space-y-5 text-white/80 text-base sm:text-lg leading-relaxed">
              <p>
                Dnes vyděláváte <span className="text-white font-bold">90 000 Kč</span> měsíčně. Byt za 7 milionů
                vypadá dosažitelně. Banka vám gratuluje a schválí přesně tolik, kolik chcete.
              </p>
              <p className="text-white font-bold">Nikdo se vás nezeptá, co bude za rok.</p>
              <p>
                <span className="text-red-400 font-bold">Měsíc X.</span> Jeden plat zmizí. Místo 50 000 Kč přijde na
                účet rodičovský příspěvek — 13 000 Kč. Hypotéka zůstává stejná. 28 000 Kč, každý měsíc, bez výjimky.
              </p>
              <p>
                Zbyde vám plyn, elektřina, pleny, kočárek. A svírání žaludku, když v bankovnictví vidíte odečtenou
                splátku a do rodičáku zbývá 14 dní.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={painInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 rounded-xl border-2 border-accent/40 bg-accent/5 p-6 sm:p-8 text-center"
          >
            <p className="text-lg sm:text-xl font-heading font-black text-white leading-snug">
              Rozdíl mezi tím, co vám dovolí <span className="text-red-400">BANKA</span>, a tím, co přežije vaše{" "}
              <span className="text-gradient-gold">MANŽELSTVÍ</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* SEC 3 — Ztráta nezávislosti */}
      <section className="bg-primary py-16 md:py-20" ref={identityRef}>
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={identityInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm font-bold text-gradient-gold tracking-wider uppercase mb-6 text-center">
              Pro ženy, které si na sobě vydělaly každou korunu
            </p>
            <div className="space-y-5 text-primary-foreground/85 text-base sm:text-lg leading-relaxed text-center">
              <p>
                Vypracovala jste se sama. Umíte počítat, plánovat, mít věci pod kontrolou — a přesně proto vás děsí
                představa, že budete muset prosit o každý tisíc.
              </p>
              <p>
                Nejde jen o peníze. Jde o tu jistotu, na kterou jste si zvykla. O to, že se rozhodujete sama za sebe,
                ne podle toho, co zbyde po splátce.
              </p>
              <p className="font-bold text-white">
                Rodičovská tohle na čas vezme každé ženě. Otázka je, jestli víte přesně, o kolik — a jestli jste na
                to připravená, nebo to zjistíte až v novém bytě, s miminkem v náručí a kalkulačkou v ruce.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEC 4 — Mechanismus */}
      <section className="section-padding bg-[#0a0a0f] relative overflow-hidden" ref={mechanismRef}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,hsl(38_65%_30%/0.12),transparent_60%)]" />
        <div className="container-narrow mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={mechanismInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-6 text-center">
              Stres-Test R-STOP: Rodičovský Strop Bezpečné Splátky
            </h2>
            <div className="space-y-5 text-white/80 text-base sm:text-lg leading-relaxed">
              <p>
                R-STOP <span className="text-white font-bold">není hypoteční poradenství</span>. Je to diagnostika.
              </p>
              <p>
                Přesné číslo, kde je dno vašeho rozpočtu — a jestli hypotéka, o které uvažujete, tohle dno vůbec
                respektuje.
              </p>
              <p>
                Žádná tříhodinová schůzka s deseti tabulkami v Excelu. 15 minut po telefonu, ve kterých společně
                spočítáme:
              </p>
              <ul className="space-y-2 pl-1">
                <li className="flex items-start gap-2.5">
                  <Check size={18} className="text-accent mt-1 flex-shrink-0" />
                  <span>Váš reálný příjem v den, kdy nastoupíte na rodičovskou.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={18} className="text-accent mt-1 flex-shrink-0" />
                  <span>Fixní náklady, které nezmizí ani na den.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={18} className="text-accent mt-1 flex-shrink-0" />
                  <span>Bezpečnou splátku, kterou tohle všechno unese, aniž byste sáhli na rezervu.</span>
                </li>
              </ul>
              <p className="text-white font-bold">
                Na konci budete mít jedno číslo. Váš R-STOP. A budete přesně vědět, jestli byt, který se vám líbí, do
                něj patří — nebo ne.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEC 5 — Kvalifikační formulář */}
      <section id="stres-test-form" className="section-padding bg-[#0a0a0f] relative overflow-hidden" ref={toolRef}>
        <div className="container-narrow mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm font-bold text-accent tracking-wider uppercase">
                15 minut. Žádný nátlak. Jedno číslo.
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-4">
              Zjistěte svůj R-STOP
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
              Odpovězte na pár otázek. Pokud to dává smysl, domluvíme si 15minutový diagnostický hovor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl border-2 border-accent/25 bg-white/[0.03] backdrop-blur-md p-5 sm:p-8"
          >
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              {(step > 0 || disqualified) && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Zpět"
                  className="flex-shrink-0 p-1.5 rounded-lg text-white/40 hover:text-accent hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full gold-gradient rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="flex-shrink-0 text-xs font-bold text-white/40 tabular-nums">
                {Math.min(step + 1, totalSteps)}/{totalSteps}
              </span>
            </div>

            <>
              {disqualified ? (
                <motion.div
                  key="disqualified"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-center py-6"
                >
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-white mb-4">Děkujeme za váš čas</h3>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                    Na základě vašich odpovědí vám bohužel teď nemůžeme nabídnout řešení, které by dávalo smysl.
                    Nechceme vás zdržovat něčím, co by nakonec nevyšlo. Kdyby se vaše situace v budoucnu změnila,
                    ozvěte se — rádi se na to podíváme znovu.
                  </p>
                </motion.div>
              ) : currentQuestion ? (
                <motion.div
                  key={currentQuestion.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-white mb-6 text-center">
                    {currentQuestion.question}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectAnswer(currentQuestion.key, option)}
                        className="text-left px-5 py-4 rounded-lg border-2 border-white/10 bg-white/[0.02] hover:border-accent hover:bg-accent/10 transition-all font-bold text-white active:scale-[0.98]"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="contact"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 sm:space-y-5"
                >
                  <h3 className="text-xl sm:text-2xl font-heading font-black text-white mb-1 text-center">
                    Kam vám mám poslat termín na hovor?
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-white/80 mb-1.5">Jméno a příjmení</label>
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className={inputClass}
                      placeholder="Jana Nováková"
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                    <div>
                      <label className="block text-sm font-bold text-white/80 mb-1.5">E-mail</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className={inputClass}
                        placeholder="jana@email.cz"
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white/80 mb-1.5">Telefon</label>
                      <input
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        className={inputClass}
                        placeholder="+420 xxx xxx xxx"
                        inputMode="tel"
                      />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full gold-gradient cta-glow text-accent-foreground py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg uppercase tracking-wide flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    {sending ? "Odesílám…" : "Chci termín na R-STOP hovor →"}
                  </button>

                  <p className="text-center text-xs text-white/40 leading-relaxed">
                    🔒 Vaše údaje jsou 100% v bezpečí. Ozveme se vám do 24 hodin s termínem hovoru.
                  </p>

                  <p className="text-center text-xs text-white/40 leading-relaxed">
                    Odesláním souhlasíte se{" "}
                    <Link to="/gdpr" className="text-accent hover:underline font-medium" target="_blank">
                      zpracováním osobních údajů
                    </Link>{" "}
                    za účelem vyřízení poptávky.
                  </p>
                </motion.form>
              )}
            </>
          </motion.div>
        </div>
      </section>

      {/* Reference — důvěra */}
      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default StresTest;
