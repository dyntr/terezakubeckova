import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Send, Calculator, PiggyBank, ScaleIcon, Check, ChevronLeft } from "lucide-react";
import TKLogo from "@/components/TKLogo";
import ReviewsSection from "@/components/ReviewsSection";
import CertificatesSection from "@/components/CertificatesSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Vyplňte jméno").max(100),
  email: z.string().trim().email("Zadejte platný e-mail").max(255),
  phone: z.string().trim().min(9, "Zadejte platné číslo").max(20),
});

const WEB3FORMS_KEY = "288ee3af-59f1-422a-8dc0-918c2e503d6b";
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/1mm2ym4r8qw9bh521kt6eb75qdljxbht";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const auditPoints = [
  {
    icon: Calculator,
    title: "Simulace mateřské",
    text: "Spočítáme do koruny, jak bude vypadat váš rozpočet v den, kdy z výplaty zbyde jen rodičovský příspěvek. Ne podle bankovní kalkulačky – podle reality.",
  },
  {
    icon: PiggyBank,
    title: "Zajištění dítěte",
    text: "Najdeme ve vašem rozpočtu 1–2 tisíce měsíčně, které místo bankovních poplatků porostou dítěti na účtu (DIP) a v 18 letech mu reálně pomůžou.",
  },
  {
    icon: ScaleIcon,
    title: "Vaše bezpečné číslo",
    text: "Na rovinu vám řekneme přesnou částku, do které je hypotéka na rodičovské bezpečná – a jestli letos jít do koupě, nebo počkat.",
  },
];

const recognitionGroups = [
  {
    heading: "Bydlení a rozhodování",
    items: [
      "Byli jsme na prohlídce domu (nebo bytu). Cestou domů nastalo v autě ticho.",
      "Menší bydlení teď, nebo rovnou větší nastálo – nechceme se stěhovat pětkrát.",
      "Stěhovat se za levnějším bydlením, nebo zůstat a škrtit rozpočet?",
    ],
  },
  {
    heading: "Hypotéka na jeden plat",
    items: [
      "Banka nám hypotéku schválí z dnešních dvou platů. Co ale bude za rok, až jeden z nás bude na rodičovské?",
      "Utáhneme splátku 30 000 Kč jen z jednoho platu?",
      "Vydělávám víc než partner. Co bude s hypotékou, až půjdu na mateřskou?",
    ],
  },
  {
    heading: "Těhotenství a banka",
    items: [
      "Jsme těhotní a chceme žádat o hypotéku – musíme to před bankou tajit?",
      "Refixace nám vychází přesně na termín porodu.",
    ],
  },
  {
    heading: "Rozpočet a děti",
    items: [
      "Vycházíme tak tak už teď. Zvládneme to i s miminkem navíc?",
      "Kroužky a školy v přírodě se nezaplatí samy – zaplatíme je i s dalším dítětem na stejný plat?",
      "Máme naspořeno 20 000 Kč měsíčně na papíře. Bude to stačit, až skutečně dojde na věc?",
    ],
  },
];

const questions = [
  {
    key: "propertyPrice",
    question: "Kolik stojí nemovitost, o kterou máte zájem?",
    options: ["Do 4 mil. Kč", "4–6 mil. Kč", "6–8 mil. Kč", "Přes 8 mil. Kč"],
  },
  {
    key: "savings",
    question: "Kolik máte našetřeno na vlastní zdroje?",
    options: ["Méně než 300 tis. Kč", "300–700 tis. Kč", "700 tis.–1,5 mil. Kč", "Přes 1,5 mil. Kč"],
  },
  {
    key: "income",
    question: "Jaký je váš společný čistý měsíční příjem dnes?",
    options: ["Do 60 000 Kč", "60 000–90 000 Kč", "90 000–120 000 Kč", "Přes 120 000 Kč"],
  },
  {
    key: "timing",
    question: "Kdy jeden z vás nastoupí na rodičovskou / čekáte miminko?",
    options: ["Už jsme na rodičovské", "Do 3 měsíců", "Za 4–8 měsíců", "Za víc než 8 měsíců"],
  },
] as const;

type AnswerKey = (typeof questions)[number]["key"];
type Answers = Record<AnswerKey, string>;

const LepsiZivot = () => {
  const recognitionRef = useRef(null);
  const auditRef = useRef(null);
  const toolRef = useRef(null);
  const recognitionInView = useInView(recognitionRef, { once: true, margin: "-100px" });
  const auditInView = useInView(auditRef, { once: true, margin: "-100px" });
  const toolInView = useInView(toolRef, { once: true, margin: "-100px" });

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    propertyPrice: "",
    savings: "",
    income: "",
    timing: "",
  });
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const scrollToForm = () => {
    document.querySelector("#ted-nebo-pockat")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectAnswer = (key: AnswerKey, value: string) => {
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

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
        cena_nemovitosti: answers.propertyPrice,
        uspory: answers.savings,
        prijem: answers.income,
        terminace_rodicovske: answers.timing,
        source: "/lepsi-zivot",
      };

      const [web3Res] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "Kalkulačka klidného spánku – bezpečné číslo (/lepsi-zivot)",
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
        toast.success("Odpovědi odeslány! Do 48 hodin vám pošlu vaše bezpečné číslo.");
        setForm({ name: "", email: "", phone: "" });
        setAnswers({ propertyPrice: "", savings: "", income: "", timing: "" });
        setStep(0);
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

  const totalSteps = questions.length + 1;
  const progressPct = ((step + 1) / totalSteps) * 100;
  const currentQuestion = step < questions.length ? questions[step] : null;

  return (
    <div className="min-h-screen">
      {/* Minimal header — no nav, aby nic neodvádělo pozornost od poptávky */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="container-narrow mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <TKLogo className="w-7 h-7 sm:w-8 sm:h-8 text-accent flex-shrink-0" />
            <span className="font-heading text-base sm:text-lg md:text-xl font-semibold text-foreground truncate">
              Tereza <span className="hidden sm:inline text-gradient-gold">Kubečková</span>
            </span>
          </Link>
          <button
            onClick={scrollToForm}
            className="inline-flex flex-shrink-0 items-center gap-2 gold-gradient text-accent-foreground px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold uppercase tracking-wide hover:opacity-90 transition-opacity"
          >
            <span className="sm:hidden">Bezpečná splátka</span>
            <span className="hidden sm:inline">Chci své bezpečné číslo zdarma</span>
          </button>
        </div>
      </header>

      {/* Hero — stark direct-response styl: tmavé pozadí, tvrdý kontrast, dilema jako centrální mechanismus */}
      <section className="relative overflow-hidden bg-[#0a0a0f]">
        <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,hsl(0_60%_25%/0.35),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_100%,hsl(38_65%_30%/0.25),transparent_60%)]" />

        <div className="container-narrow mx-auto px-5 sm:px-6 lg:px-8 py-14 md:py-20 relative z-10 w-full">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-4"
            >
              <span className="text-xs sm:text-sm font-extrabold text-red-400 tracking-wider uppercase">
                Máte před sebou nejtěžší rozhodnutí na začátku rodičovství
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-body font-extrabold text-white leading-[1.15] mb-8 tracking-tight"
            >
              Vzít si hypotéku na 30 let a modlit se, že to na rodičovské zvládnete? Nebo odsoudit rodinu na doživotí
              v nájmu?
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={scrollToForm}
                className="gold-gradient cta-glow text-accent-foreground px-8 py-5 rounded-xl text-base sm:text-lg font-extrabold leading-snug hover:opacity-90 transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                Chci zjistit do 24 hodin moji přesnou BEZPEČNOU splátku hypotéky na rodičovské
              </button>
              <p className="mt-4 text-xs sm:text-sm text-white/50">
                Dnes zcela zdarma
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Kalkulačka klidného spánku — interaktivní nástroj nahrazující statický formulář */}
      <section id="ted-nebo-pockat" className="section-padding bg-background" ref={toolRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm font-medium text-accent tracking-wider uppercase">
                4 kliknutí. Nulové papírování. Vaše bezpečné číslo.
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Kalkulačka klidného spánku
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Zjistěte, jak to řeší rodiny přesně ve vaší situaci. Žádné papírování, žádný hovor navíc – jen pár
              kliknutí. Vaše přesné bezpečné číslo hypotéky na rodičovské vám pošlu do 48 hodin.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={toolInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-5 sm:p-8"
          >
            {/* Progress bar */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="Zpět"
                  className="flex-shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-muted transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full gold-gradient rounded-full"
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="flex-shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                {Math.min(step + 1, totalSteps)}/{totalSteps}
              </span>
            </div>

            <>
              {currentQuestion ? (
                <motion.div
                  key={currentQuestion.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-6 text-center">
                    {currentQuestion.question}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => selectAnswer(currentQuestion.key, option)}
                        className="text-left px-5 py-4 rounded-xl border-2 border-border bg-background hover:border-accent hover:bg-accent/5 transition-all font-medium text-foreground active:scale-[0.98]"
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
                  <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-2 text-center">
                    Skoro hotovo — kam vám mám poslat vaše bezpečné číslo?
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Vaše čísla už mám. Nechte mi na sebe kontakt a do 48 hodin budete mít svoje přesné bezpečné
                    číslo.
                  </p>

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
                    className="w-full gold-gradient cta-glow text-accent-foreground py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg uppercase tracking-wide flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    ) : (
                      <Send size={20} />
                    )}
                    {sending ? "Odesílám…" : "Chci své bezpečné číslo zdarma"}
                  </button>

                  <p className="text-center text-xs text-muted-foreground leading-relaxed">
                    Odesláním souhlasíte se{" "}
                    <Link to="/gdpr" className="text-accent hover:underline font-medium" target="_blank">
                      zpracováním osobních údajů
                    </Link>{" "}
                    za účelem vyřízení poptávky.
                  </p>

                  <p className="text-center text-xs text-muted-foreground pt-1">
                    Nebo rovnou zavolejte:{" "}
                    <a href="tel:+420775303314" className="text-accent hover:underline font-medium">
                      775 303 314
                    </a>
                  </p>
                </motion.form>
              )}
            </>
          </motion.div>
        </div>
      </section>

      {/* Reference — hned pod nástrojem, stejná sekce jako na hlavní stránce */}
      <ReviewsSection />

      {/* Partneři napříč trhem */}
      <PartnersSection />

      {/* Certifikace ČNB */}
      <CertificatesSection />

      {/* Scéna z prohlídky nemovitosti — krátký emoční úvod */}
      <section className="section-padding bg-background pb-8 md:pb-10">
        <div className="container-narrow mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-foreground leading-relaxed"
          >
            To bydlení se vám líbilo — dům se zahradou, nebo byt, ve kterém by se konečně narovnala záda. Už jste si
            představovali, kde bude stát postýlka. Jenže cestou domů v autě nastalo ticho — protože v hlavě vám
            běžela matematika, kterou vám žádná bankovní kalkulačka nespočítá. My ji spočítáme za vás.
          </motion.p>
        </div>
      </section>

      {/* "Poznáváte se?" — checklist, který zrcadlí konkrétní obavy z reklam */}
      <section className="section-padding bg-secondary pt-8 md:pt-10" ref={recognitionRef}>
        <div className="container-narrow mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={recognitionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Poznáváte se v některé z těchto vět?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Pokud ano, nejste sami — a přesně těmhle rodinám pomáhám změnit chaos v hlavě na jasné ano, nebo ne.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {recognitionGroups.map((group, gi) => (
              <motion.div
                key={group.heading}
                initial={{ opacity: 0, y: 30 }}
                animate={recognitionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * gi }}
                className="glass-card p-6"
              >
                <h3 className="font-heading font-bold text-base text-accent mb-4">{group.heading}</h3>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={16} className="text-accent mt-1 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-foreground leading-relaxed">„{item}“</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote — hlavní argument proč teď a proč nezávisle */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground leading-snug"
          >
            Banka počítá s <span className="text-gradient-gold">dneškem</span>.
            <br />
            Vy musíte počítat s <span className="text-gradient-gold">příštím rokem</span>.
          </motion.p>
        </div>
      </section>

      {/* Rodinný audit bezpečnosti — co konkrétně z odpovědí vytěžíte */}
      <section className="section-padding bg-background" ref={auditRef}>
        <div className="container-narrow mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={auditInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">Co dostanete</span>
              <div className="h-px w-12 bg-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Co přesně z vašich odpovědí zjistíte
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Většinu mladých rodin nestojí miliony špatný úrok. Stojí je to špatné načasování.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {auditPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                animate={auditInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 * i }}
                className="glass-card p-6 sm:p-8 hover-lift"
              >
                <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mb-5">
                  <point.icon size={24} className="text-accent-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={auditInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-lg md:text-xl font-heading font-semibold text-foreground leading-relaxed mt-12 max-w-2xl mx-auto"
          >
            Nehledejte „nejlevnější hypotéku“. Hledejte svoje bezpečné číslo, se kterým budete klidně spát.
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LepsiZivot;
