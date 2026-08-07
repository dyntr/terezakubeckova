import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Send, ChevronLeft, Check, Ban } from "lucide-react";
import TKLogo from "@/components/TKLogo";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";
import { calcRStopResult } from "@/lib/rstopCalc";

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

const recognitionItems = [
  "Schválí vám 7 milionů na dnešní příjem. Nikdo se nezeptá, jestli je utáhnete i na rodičovské.",
  "Nikdo vám neukázal výpočet, který počítá s bezpečnou splátkou – jen s tou nejvyšší možnou.",
  "Hypotéka se nepodepisuje na 30 let. Podepisuje se na první 3 roky s dítětem.",
  "Myslíte si, že máte rezervu. Poznáte to, až přijde první výplata jen z rodičovské.",
  "Vaše dnešní „jistota“ dvou platů zmizí ve chvíli, kdy jeden z vás nastoupí na mateřskou.",
  "Standardnímu výpočtu je jedno, že budete mít dítě na plenkách. Počítá jen s tím, co vyděláváte dnes.",
];

const questions = [
  {
    key: "dluhy",
    question: "Máte exekuce nebo jakékoliv jiné dluhy (kromě hypotéky)?",
    options: ["Ne, nemám", "Ano, mám"],
  },
  {
    key: "situace",
    question: "V jaké fázi jste teď?",
    options: [
      "Hypotéku teprve řešíme, dítě plánujeme",
      "Čekáme miminko a hypotéku už máme/řešíme",
      "Jsme na rodičovské a hypotéku už splácíme",
    ],
  },
  {
    key: "prijem",
    question: "Jaký je váš dnešní společný čistý příjem?",
    options: ["do 60 000 Kč", "60 000 – 80 000 Kč", "80 000 – 110 000 Kč", "110 000 Kč a více"],
  },
  {
    key: "hypoteka",
    question: "Jakou výši hypotéky řešíte?",
    options: ["do 4 mil. Kč", "4 – 6 mil. Kč", "6 – 8 mil. Kč", "Více než 8 mil. Kč / Nevím, chci poradit"],
  },
] as const;

const DEBT_DISQUALIFY_OPTION = "Ano, mám";
const LOWEST_INCOME_OPTION = "do 60 000 Kč";

type AnswerKey = (typeof questions)[number]["key"];
type Answers = Record<AnswerKey, string>;

const RStop = () => {
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const toolRef = useRef(null);
  const recognitionInView = useInView(recognitionRef, { once: true, margin: "-100px" });
  const toolInView = useInView(toolRef, { once: true, margin: "-100px" });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ dluhy: "", situace: "", prijem: "", hypoteka: "" });
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [disqualified, setDisqualified] = useState(false);

  const result = useMemo(() => calcRStopResult(answers.prijem, answers.hypoteka), [answers.prijem, answers.hypoteka]);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const scrollToForm = () => {
    document.querySelector("#r-stop-test")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectAnswer = (key: AnswerKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    if (key === "dluhy" && value === DEBT_DISQUALIFY_OPTION) {
      setDisqualified(true);
      return;
    }
    if (key === "prijem" && value === LOWEST_INCOME_OPTION) {
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
    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
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
        situace: answers.situace,
        prijem: answers.prijem,
        hypoteka: answers.hypoteka,
        source: "/r-stop",
      };

      const [web3Res] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "R-STOP (DTI2) – bezpečná splátka (/r-stop)",
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
        navigate("/r-stop-vysledek", { state: result });
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
      {/* Minimal header — ostrý, tmavý, žádný soft glass */}
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
            <span className="sm:hidden">Můj R-STOP (DTI2)</span>
            <span className="hidden sm:inline">Chci znát svůj R-STOP (DTI2)</span>
          </button>
        </div>
      </header>

      {/* Hero — jedno tvrdé tvrzení, jedna nabídka, jeden CTA */}
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
                Tohle číslo vám žádná kalkulačka nespočítá.
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl font-body font-black text-white leading-[1.1] mb-8 tracking-tight"
            >
              Hypotéku vám spočítají z dnešních dvou platů. Jestli ji utáhnete i s miminkem a rodičákem, to už nikdo
              neřeší.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-white/60 mb-10 leading-relaxed"
            >
              R-STOP (odborně DTI2) je jedno číslo: nejvyšší splátka, kterou bezpečně utáhnete i na rodičovské.
              Spočítám vám ho za 60 vteřin – zdarma.
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
                Spočítat můj R-STOP (DTI2) zdarma →
              </button>
              <p className="mt-4 text-xs sm:text-sm text-white/50">Bez závazků. Výsledek hned na obrazovce.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mechanismus — proč na tom záleží, kanál existující nedůvěry k bance */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-4xl font-heading font-black text-primary-foreground leading-snug"
          >
            Standardní kalkulačka počítá s tím, co máte <span className="text-gradient-gold">dnes</span>.
            <br />
            R-STOP (DTI2) počítá s tím, co přijde <span className="text-gradient-gold">za rok</span>.
          </motion.p>
        </div>
      </section>

      {/* Nástroj — R-STOP test — tmavá plocha navazující na hero, žádný soft glass */}
      <section id="r-stop-test" className="section-padding bg-[#0a0a0f] relative overflow-hidden" ref={toolRef}>
        <div className="absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,hsl(38_65%_30%/0.12),transparent_60%)]" />
        <div className="container-narrow mx-auto max-w-2xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm font-bold text-accent tracking-wider uppercase">
                3 kliknutí. Žádné papírování. Jedno číslo.
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">R-STOP (DTI2) test</h2>
            <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base">
              Odpovězte na 3 rychlé otázky a svůj R-STOP (DTI2) – bezpečnou splátku, se kterou přežijete rodičovskou
              bez stresu – uvidíte hned tady na obrazovce.
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
                    Ještě jeden krok a uvidíte svůj R-STOP (DTI2)
                  </h3>
                  <p className="text-center text-sm text-white/50 mb-3">
                    Zadejte kontakt – výsledek se zobrazí hned tady na obrazovce. Přesné číslo na míru vám pak do 24
                    hodin ještě upřesním.
                  </p>

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
                    {sending ? "Počítám…" : "Zobrazit můj R-STOP (DTI2) →"}
                  </button>

                  <p className="text-center text-xs text-white/40 leading-relaxed">
                    🔒 Vaše údaje jsou 100% v bezpečí. Výsledek uvidíte okamžitě, přesné číslo na míru vám pošleme do
                    24 hodin.
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

      {/* Poznáváte se? — tmavý "rap sheet" seznam, žádné kulaté karty */}
      <section className="section-padding bg-[#0a0a0f]" ref={recognitionRef}>
        <div className="container-narrow mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={recognitionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">
              Poznáváte se v některé z těchto vět?
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={recognitionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="rounded-xl border-2 border-white/10 bg-white/[0.02] p-6 sm:p-8"
          >
            <ul className="space-y-4">
              {recognitionItems.map((item) => (
                <li key={item} className="flex items-start gap-3 border-l-4 border-red-500/50 pl-4 py-1">
                  <Ban size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">„{item}“</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={recognitionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-10"
          >
            <div className="flex items-center justify-center gap-2 mb-3">
              <Check size={18} className="text-accent" />
              <span className="text-sm sm:text-base font-bold text-white">
                R-STOP (DTI2) vám dá jasné číslo místo špatného pocitu.
              </span>
            </div>
            <button
              onClick={scrollToForm}
              className="gold-gradient cta-glow text-accent-foreground px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold uppercase tracking-wide hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Spočítat můj R-STOP (DTI2) →
            </button>
          </motion.div>
        </div>
      </section>

      {/* Reference — důvěra, minimum ostatního */}
      <ReviewsSection />

      <Footer />
    </div>
  );
};

export default RStop;
