import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Send, ShieldCheck, Check, ClipboardCheck, Calculator, Scale } from "lucide-react";
import TKLogo from "@/components/TKLogo";
import ReviewsSection from "@/components/ReviewsSection";
import CertificatesSection from "@/components/CertificatesSection";
import PartnersSection from "@/components/PartnersSection";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

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

const planPoints = [
  {
    icon: ClipboardCheck,
    title: "Test druhé bonity",
    text: "Než dáte realitce zálohu, zjistíme, jestli vám banka vůbec schválí hypotéku na druhou nemovitost – a za jakých podmínek, i bez milionů na účtu.",
  },
  {
    icon: Calculator,
    title: "Nájemní cashflow",
    text: "Spočítáme skutečný poměr mezi splátkou a čistým nájmem po odečtení energií, fondu oprav a rezervy na neobsazenost. Číslo z fóra vás může stát statisíce.",
  },
  {
    icon: Scale,
    title: "Byt, nebo DIP",
    text: "Na rovinu vám řekneme, jestli se vám byt pro dítě vyplatí, nebo jestli zbytečně riskujete rodinné finance a spoření přes DIP by bylo bezpečnější.",
  },
];

const recognitionGroups = [
  {
    heading: "Bonita a banka",
    items: [
      "Co když nám banka řekne ne po měsících plánování a celý plán spadne?",
      "První hypotéka nás může připravit o druhou, aniž bychom to tušili dopředu.",
      "Jedna rodičovská dovolená a neutáhneme ani jednu splátku, natož obě.",
    ],
  },
  {
    heading: "Nájem a cashflow",
    items: [
      "Pár tisíc měsíčně navíc ze svého si všimneme, až bude pozdě.",
      "Nájem, co roky nezvedáme, tiše žere celou marži, dokud nejsme v mínusu.",
      "Číslo z fóra, podle kterého jsme počítali návratnost, je smyšlené.",
    ],
  },
  {
    heading: "Rozhodování ve dvou",
    items: [
      "Hádka o tom, jestli riskujeme rodinné jistoty kvůli bytu, co možná ani nebudeme potřebovat.",
      "Špatná dispozice a byt bude za deset let malý, nebo se ho nezbavíme.",
      "Prarodiče tlačí a nikdo nahlas neřekne, co se stane, když se to nepovede.",
    ],
  },
  {
    heading: "Byt, nebo alternativa",
    items: [
      "Zamknout se na dvacet let do bytu, který dítě možná ani nebude chtít.",
      "Riskovat rodinné finance kvůli nemovitosti místo klidného spoření, co nikoho nezruinuje.",
      "Rozhodnutí za milion korun podle rady cizích lidí z internetu, co neznají naši výplatní pásku.",
    ],
  },
];

const BytProDite = () => {
  const recognitionRef = useRef(null);
  const planRef = useRef(null);
  const formRef = useRef(null);
  const recognitionInView = useInView(recognitionRef, { once: true, margin: "-100px" });
  const planInView = useInView(planRef, { once: true, margin: "-100px" });
  const formInView = useInView(formRef, { once: true, margin: "-100px" });

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const update = (field: string, value: string) => {
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
      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        source: "/byt-pro-dite",
      };

      const [web3Res] = await Promise.allSettled([
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: "Poptávka – Test druhé bonity (/byt-pro-dite)",
            ...payload,
          }),
        }),
        fetch(MAKE_WEBHOOK_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      ]);

      if (web3Res.status === "fulfilled" && web3Res.value.ok) {
        window.fbq?.("track", "Lead");
        toast.success("Poptávka odeslána! Ozvu se Vám co nejdříve.");
        setForm({ name: "", email: "", phone: "" });
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
            <span className="sm:hidden">Poptávka</span>
            <span className="hidden sm:inline">Chci Druhý názor zdarma</span>
          </button>
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
                Pro rodiče, kteří vsázejí budoucnost dítěte na jeden podpis
              </span>
              <div className="h-px w-10 bg-accent" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-primary-foreground leading-[1.15] mb-6"
            >
              Ať byt vašemu dítěti splácí nájemník, ne vy. Jedna špatně spočítaná splátka a z{" "}
              <span className="text-gradient-gold italic">dárku pro dítě</span> je rodinný dluh na dvacet let.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base md:text-lg text-primary-foreground/85 leading-relaxed mb-8"
            >
              Nemusíte mít na účtu miliony. Ale jestli přeceníte nájem nebo podceníte splátku, nezaplatí to jen vy –
              zaplatí to celá rodina, dalších dvacet let. Zjistíme, jestli vám banka dnes vůbec dá druhou hypotéku a
              jestli vás ten byt jednou nezruinuje – <span className="text-accent font-semibold">zdarma</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <button
                onClick={scrollToForm}
                className="gold-gradient cta-glow text-accent-foreground px-8 py-4 rounded-xl text-base font-semibold uppercase tracking-wide hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Chci Druhý názor zdarma
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead form — hned pod hlavním textem, ať to nemusí nikdo hledat */}
      <section id="druhy-nazor" className="section-padding bg-background" ref={formRef}>
        <div className="container-narrow mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">Než cokoliv podepíšete:</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Získejte upřímný nezávislý názor druhé strany
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
              Vyplňte kontakt a ozvu se vám do 24 hodin. Na rovinu vám řeknu, jestli vám druhá hypotéka na byt pro
              dítě dnes reálně vyjde, nebo je bezpečnější počkat.
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
              {sending ? "Odesílám…" : "Chci Druhý názor zdarma"}
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
        </div>
      </section>

      {/* Reference — hned pod formulářem, stejná sekce jako na hlavní stránce */}
      <ReviewsSection />

      {/* Partneři napříč trhem */}
      <PartnersSection />

      {/* Certifikace ČNB */}
      <CertificatesSection />

      {/* Scéna z prohlídky menšího bytu — krátký emoční úvod */}
      <section className="section-padding bg-background pb-8 md:pb-10">
        <div className="container-narrow mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-lg md:text-xl text-foreground leading-relaxed"
          >
            Byli jste se podívat na menší byt – ne pro sebe, pro dítě. V hlavě už vidíte, jak za patnáct let bydlí
            nezávisle, zatímco jeho vrstevníci budou přeplácet nájmy na kraji města, protože byty budou o milion
            dráž. Jenže tenhle plán má chybu, kterou teď nevidíte: pokud špatně spočítáte nájem nebo splátku,
            neplatíte dítěti budoucnost. Platíte vlastní chybu – měsíc co měsíc, dalších dvacet let.
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
              Pokud ano, nejste sami – a přesně tahle nejistota rozhoduje o tom, jestli za pár let dítěti dáte
              zajištěný start, nebo jen další splátku, co vás bude držet zkrátka.
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

      {/* Pull quote — hlavní argument proč to má smysl řešit s číslem v ruce */}
      <section className="bg-primary py-12 md:py-16">
        <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground leading-snug"
          >
            Nula korun měsíčně navíc ještě <span className="text-gradient-gold">neznamená špatný obchod</span>.
            <br />
            Znamená to, že vám byt platí <span className="text-gradient-gold">někdo jiný</span>.
            <br />
            Špatný odhad nájmu ale znamená, že ho <span className="text-gradient-gold">platíte vy</span> – přesně
            tehdy, když to nejmíň čekáte.
          </motion.p>
        </div>
      </section>

      {/* Test druhé bonity — mechanismus/nabídka */}
      <section className="section-padding bg-background" ref={planRef}>
        <div className="container-narrow mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={planInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">Co dostanete</span>
              <div className="h-px w-12 bg-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Test druhé bonity
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Kupovat byt pro dítě je skvělý nápad. Bez správné matematiky se z něj ale může stát finanční past,
              kterou splácíte vy – ne nájemník.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {planPoints.map((point, i) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 30 }}
                animate={planInView ? { opacity: 1, y: 0 } : {}}
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
            animate={planInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center text-lg md:text-xl font-heading font-semibold text-foreground leading-relaxed mt-12 max-w-2xl mx-auto"
          >
            Nekupujte byt proto, že zní jako dobrý nápad. Kupujte ho, až budete přesně vědět, co se stane, když se
            něco pokazí.
          </motion.p>
        </div>
      </section>

      <Footer />
      <CookieBanner />
    </div>
  );
};

export default BytProDite;
