import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Award, Heart, Users, Shield, ChevronDown } from "lucide-react";

const values = [
  {
    icon: Heart,
    label: "Empatie",
    tagline: "Finance nejsou jen čísla. Jsou to sny, obavy, rodina, budoucnost.",
    paragraphs: [
      "Nejdřív poslouchám. Teprve potom navrhuji řešení.",
      "Každý klient má jiný příběh, jiné priority i jiné tempo. Mojí rolí je pochopit Vaši situaci do hloubky, dát Vám jistotu v rozhodování a vytvořit strategii, která bude dávat smysl nejen dnes, ale i za deset let.",
      "Spolupráce se mnou není o produktech. Je o důvěře, otevřenosti a dlouhodobém partnerství.",
      "Pokud hledáte někoho, kdo Vás nebude tlačit do rozhodnutí, ale bude stát na Vaší straně, pojďme si domluvit schůzku.",
    ],
  },
  {
    icon: Shield,
    label: "Nezávislost",
    tagline: "Nejsem vázaná na jednu banku ani jednu pojišťovnu. Jsem vázaná na Vás.",
    paragraphs: [
      "Jako nezávislá poradkyně vybírám z nabídek více než 60 institucí – bank, pojišťoven i investičních společností. Každé řešení stavím na tom, co je nejlepší pro Vás, ne pro konkrétní firmu.",
      "Moje práce není prodat produkt. Moje práce je chránit a rozvíjet Váš majetek s nadhledem a objektivitou.",
    ],
  },
  {
    icon: Users,
    label: "Dlouhodobost",
    tagline: "Finance nejsou jednorázové rozhodnutí. Jsou to kroky, které ovlivňují celý Váš život.",
    paragraphs: [
      "Nestavím řešení jen na aktuální situaci, ale i na Vaší budoucnosti. Sleduji vývoj, pravidelně vyhodnocuji nastavení a přizpůsobuji strategii tak, aby Vás podporovala v každé životní fázi – při koupi nemovitosti, založení rodiny i budování majetku.",
      "Nejsem tu jen při podpisu smlouvy. Jsem tu i za rok. Za pět let. I ve chvílích, kdy věci nejdou zrovna podle plánu.",
    ],
  },
  {
    icon: Award,
    label: "Odbornost",
    tagline: "Rozhodnutí ve financích mají dlouhodobé dopady. Proto je stavím na datech, zkušenostech a hluboké znalosti trhu.",
    paragraphs: [
      "Sleduji vývoj úrokových sazeb, legislativy, pojistné podmínky i investiční a realitní trendy. Každé řešení navrhuji v širších souvislostech, s ohledem na rizika, příležitosti i daňové dopady. Nepracuji s univerzálními šablonami, ale s promyšlenou strategií.",
      "Odbornost pro mě není jen o vzdělání a praxi. Je o odpovědnosti za Vaše rozhodnutí.",
    ],
  },
];

const ValueCard = ({ val, index, isInView }: { val: typeof values[0]; index: number; isInView: boolean }) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
      className="glass-card p-6 hover-lift cursor-pointer"
      onClick={() => setOpen(!open)}
      role="button"
      aria-expanded={open}
    >
      <div className="flex items-start justify-between mb-3">
        <val.icon size={28} className="text-accent" />
        {val.paragraphs.length > 1 && (
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown size={16} className="text-muted-foreground" />
          </motion.div>
        )}
      </div>
      <h3 className="font-heading font-semibold text-foreground text-lg mb-2">{val.label}</h3>
      <p className="text-sm text-muted-foreground italic leading-relaxed">{val.tagline}</p>

      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden"
      >
        <div className="space-y-3 pt-4 border-t border-border/50 mt-4">
          {val.paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-muted-foreground leading-relaxed">{p}</p>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="about" className="px-4 sm:px-6 lg:px-8 py-10 md:py-24 bg-background" ref={ref}>
      <div className="container-narrow mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">O mně</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
              Ing. Tereza Kubečková
            </h2>
            <div className="space-y-3 md:space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
              <p>
                Vystudovala jsem Vysokou školu hotelovou v oboru Marketingová komunikace, PR a reklama.
                Ke studiu mě přivedl zájem o komunikaci a původní sen stát se reportérkou.
              </p>
              <p>
                Zlom přišel během covidu, kdy jsem ze dne na den přišla o práci. Právě v této době
                jsem se dostala do světa financí a začala pracovat v pojišťovnictví. Brzy jsem ale zjistila,
                že mi nevyhovuje nabízet pouze produkty jedné společnosti – vždy jsem chtěla vybírat
                to nejlepší pro konkrétního klienta.
              </p>

              {/* Expandable section */}
              <motion.div
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 md:space-y-4 pt-0 text-sm md:text-base">
                  <p>
                    Postupem času jsem zjistila, že práce před kamerou pro mě není tím pravým směrem,
                    a začala jsem hledat uplatnění v jiných oblastech marketingu a obchodu. Hned po škole
                    jsem nastoupila jako obchodník v oblasti venkovní reklamy. Následně jsem pracovala
                    v reklamní agentuře, kde jsem měla na starosti organizaci eventů a promo akcí.
                  </p>
                  <p>
                    A tak jsem se dostala do nezávislého finančního a majetkového poradenství, kde jsem 
                    konečně našla své skutečné poslání. Tato práce mě naplňuje, protože mi dává možnost 
                    reálně pomáhat lidem – ať už s vlastním bydlením, úsporami, investicemi nebo ochranou 
                    jejich majetku. Největší odměnou pro mě jsou spokojení klienti, kteří se na mě rádi 
                    obracejí znovu a doporučují mě dál.
                  </p>
                  <p>
                    Jsem empatická, lidská a otevřená. Vždy se snažím pochopit nejen finance, ale i 
                    životní situaci každého klienta – jeho cíle, hodnoty a potřeby. Nehledám jednorázové 
                    obchody, ale dlouhodobé vztahy. Svým klientům často říkám, že hledám spolupráci 
                    „na celý život" – někoho, komu budou důvěřovat a kdo jim bude stát po boku v různých 
                    životních situacích.
                  </p>
                  <p>
                    Svou práci vnímám jako majetkové poradenství – tedy ochranu a rozvoj majetku klienta 
                    za pomoci bank, pojišťoven a investičních společností. Zároveň spolupracuji s realitními 
                    makléři, daňovými poradci a právníky, abych byla schopná klientům pomoci i v náročnějších 
                    životních momentech, jako jsou koupě nemovitosti, dědictví či rozvod.
                  </p>
                  <p>
                    Základem mé práce je finanční analýza. Přirovnávám ji k návštěvě truhláře, když si 
                    chcete nechat vyrobit kuchyň na míru – nejdřív je potřeba zjistit Vaše potřeby, 
                    možnosti a představy. Stejně tak nejprve detailně zmapuji Vaši současnou finanční 
                    situaci, Vaše cíle a přání do budoucna. Na základě toho pak připravuji osobní 
                    finanční plán, který je vždy šitý na míru.
                  </p>
                  <p className="font-medium text-foreground">
                    Mým cílem je, aby finance dávaly smysl, byly přehledné a pracovaly ve Váš prospěch 
                    – dnes i v budoucnu.
                  </p>
                </div>
              </motion.div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-2 text-accent font-medium hover:opacity-80 transition-opacity mt-2"
              >
                {expanded ? "Zobrazit méně" : "Přečíst celý příběh"}
                <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown size={18} />
                </motion.div>
              </button>
            </div>
          </motion.div>

          {/* Values grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {values.map((val, i) => (
              <ValueCard key={val.label} val={val} index={i} isInView={isInView} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
