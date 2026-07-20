import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import {
  Phone,
  Send,
  Calculator,
  PiggyBank,
  ScaleIcon,
  ShieldCheck,
  Check,
} from "lucide-react";
import TKLogo from "@/components/TKLogo";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Vyplňte jméno").max(100),
  email: z.string().trim().email("Zadejte platný e-mail").max(255),
  phone: z.string().trim().min(9, "Zadejte platné číslo").max(20),
  gdpr: z.literal(true, { errorMap: () => ({ message: "Musíte souhlasit se zpracováním údajů" }) }),
});

const WEB3FORMS_KEY = "288ee3af-59f1-422a-8dc0-918c2e503d6b";

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
    title: "Jasný verdikt",
    text: "Na rovinu vám řekneme, zda do koupě jít letos, nebo je bezpečnější počkat. Bez omáček a bez tlaku něco podepsat.",
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

const LepsiZivot = () => {
  const recognitionRef = useRef(null);
  const auditRef = useRef(null);
  const formRef = useRef(null);
  const recognitionInView = useInView(recognitionRef, { once: true, margin: "-100px" });
  const auditInView = useInView(auditRef, { once: true, margin: "-100px" });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });

  const [form, setForm] = useState({ name: "", email: "", phone: "", gdpr: false as boolean });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const scrollToForm = () => {
    document.querySelector("#druhy-nazor")?.scrollIntoView({ behavior: "smooth" });
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
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Poptávka – Rodinný audit bezpečnosti (/lepsi-zivot)",
          name: form.name,
          email: form.email,
          phone: form.phone,
        }),
      });

      if (res.ok) {
        toast.success("Poptávka odeslána! Ozvu se Vám co nejdříve.");
        setForm({ name: "", email: "", phone: "", gdpr: false });
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
    <div className="min-h-screen">
      {/* Minimal header — no nav, aby nic neodvádělo pozornost od poptávky */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="container-narrow mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <TKLogo className="w-8 h-8 text-accent" />
            <span className="font-heading text-lg md:text-xl font-semibold text-foreground">
              Tereza <span className="text-gradient-gold">Kubečková</span>
            </span>
          </Link>
          <a
            href="tel:+420775303314"
            className="hidden sm:inline-flex items-center gap-2 navy-gradient text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Phone size={16} />
            775 303 314
          </a>
        </div>
      </header>

      {/* Hero — headline navazuje na hlavní kreativu kampaně */}
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_80%_0%,hsl(215_35%_35%/0.6),transparent_60%)]" />
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-2 mb-5"
            >
              <div className="h-px w-10 bg-accent" />
              <span className="text-xs md:text-sm font-medium text-accent tracking-wider uppercase">
                Nezávislý Druhý názor pro rodiny, co čekají miminko
              </span>
              <div className="h-px w-10 bg-accent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary-foreground leading-[1.15] mb-6"
            >
              Chcete do nového bydlení, ale děsí vás představa, že s miminkem na cestě přijdete o finanční jistotu?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-primary-foreground/85 leading-relaxed mb-8"
            >
              Banka vám hypotéku klidně schválí z vašich dvou dnešních platů. Jenže ji nezajímá, co bude za rok, až
              jeden z vás bude na rodičovské. Zjistěte během 3 minut, jestli to bezpečně utáhnete – a jak si u toho
              rovnou nesáhnout na dno.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={scrollToForm}
                className="gold-gradient cta-glow text-accent-foreground px-8 py-4 rounded-xl text-base font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Chci vědět, jestli to utáhneme – zdarma
              </button>
              <p className="mt-4 text-xs sm:text-sm text-primary-foreground/70">
                100 % zdarma a bez závazků. Nic tím nekupujete ani neobjednáváte – jen si to nechte spočítat.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

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
            běžela matematika, kterou vám žádná bankovní kalkulačka nespočítá.
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
              Pokud ano, nejste sami. Tohle si v hlavě přehrává skoro každý pár, který čeká miminko a řeší bydlení.
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

      {/* Rodinný audit bezpečnosti — mechanismus/nabídka */}
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
              Rodinný audit bezpečnosti
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
            Nehledejte „nejlevnější hypotéku“. Hledejte jistotu, že vaše rodina neskočí do pasti.
          </motion.p>
        </div>
      </section>

      {/* Lead form */}
      <section id="druhy-nazor" className="section-padding bg-secondary" ref={formRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">Nezávazné a zdarma</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Než cokoliv podepíšete, ověřte si to
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Vyplňte kontakt a ozvu se vám do 24 hodin. Na rovinu vám řeknu, jestli do koupě jít teď, nebo je
              bezpečnější počkat.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-5 sm:p-8 space-y-4 sm:space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Jméno a příjmení</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
                placeholder="Jan Novák"
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
                  placeholder="jan@email.cz"
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

            <label className="flex items-start gap-3 cursor-pointer group/gdpr">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={form.gdpr}
                  onChange={(e) => update("gdpr", e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center group-hover/gdpr:border-accent/60 ${
                    form.gdpr ? "bg-accent border-accent" : "border-border bg-background"
                  }`}
                >
                  {form.gdpr && (
                    <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed">
                Souhlasím se{" "}
                <Link to="/gdpr" className="text-accent hover:underline font-medium" target="_blank">
                  zpracováním osobních údajů
                </Link>{" "}
                za účelem vyřízení poptávky.
              </span>
            </label>
            {errors.gdpr && <p className="text-destructive text-xs -mt-2">{errors.gdpr}</p>}

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
              {sending ? "Odesílám…" : "Chci Druhý názor zdarma"}
            </button>

            <p className="text-center text-xs text-muted-foreground pt-1">
              Nebo rovnou zavolejte:{" "}
              <a href="tel:+420775303314" className="text-accent hover:underline font-medium">
                775 303 314
              </a>
            </p>
          </motion.form>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default LepsiZivot;
