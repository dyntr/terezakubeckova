import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Správce osobních údajů",
    content: (
      <>
        <p>Správcem osobních údajů je:</p>
        <div className="glass-card p-5 mt-3 space-y-1">
          <p className="font-semibold text-foreground">Tereza Kubečková</p>
          <p>IČO: 08711631</p>
          <p>Sídlo: Jílovská 1150/41, 142 00 Praha 4</p>
          <p>
            E-mail:{" "}
            <a href="mailto:terezakubeckova.spoluprace@email.cz" className="text-accent hover:underline">
              terezakubeckova.spoluprace@email.cz
            </a>
          </p>
          <p>Telefon: 775 303 314</p>
        </div>
      </>
    ),
  },
  {
    title: "2. Jaké osobní údaje zpracováváme",
    content: (
      <>
        <p>Prostřednictvím kontaktního formuláře na webu zpracováváme:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>jméno a příjmení</li>
          <li>e-mailovou adresu</li>
          <li>telefonní číslo</li>
        </ul>
        <p className="mt-3">
          Dále mohou být automaticky zpracovávány technické údaje (IP adresa, cookies, údaje o zařízení a chování na webu).
        </p>
      </>
    ),
  },
  {
    title: "3. Účely zpracování a právní základ",
    content: (
      <>
        <p className="mb-3">Osobní údaje jsou zpracovávány za účelem:</p>

        <h4 className="font-semibold text-foreground mt-4 mb-1">a) Vyřízení poptávky a navazující komunikace</h4>
        <p>Právní základ: plnění předsmluvních opatření dle čl. 6 odst. 1 písm. b) GDPR.</p>

        <h4 className="font-semibold text-foreground mt-4 mb-1">b) Nabídka souvisejících služeb a obchodní komunikace</h4>
        <p>
          V případě, že projevíte zájem o služby Správce prostřednictvím formuláře, může Správce využít vaše kontaktní
          údaje k zaslání informací o obdobných službách nebo novinkách.
        </p>
        <p className="mt-2">Právní základ: oprávněný zájem dle čl. 6 odst. 1 písm. f) GDPR.</p>
        <p className="mt-2 text-sm italic">
          Proti tomuto zpracování můžete kdykoliv vznést námitku nebo se z další komunikace odhlásit.
        </p>
      </>
    ),
  },
  {
    title: "4. Příjemci osobních údajů",
    content: (
      <>
        <p>Osobní údaje mohou být zpřístupněny:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>poskytovateli e-mailových služeb</li>
          <li>poskytovateli hostingu</li>
        </ul>
        <p className="mt-3">
          V případě přenosu mimo EU dochází k zabezpečení prostřednictvím standardních smluvních doložek.
        </p>
      </>
    ),
  },
  {
    title: "5. Doba uchování",
    content: (
      <ul className="list-disc list-inside space-y-1">
        <li>po dobu trvání komunikace</li>
        <li>následně maximálně 3 roky od posledního kontaktu</li>
        <li>nebo do doby vznesení námitky proti zpracování</li>
      </ul>
    ),
  },
  {
    title: "6. Vaše práva",
    content: (
      <>
        <p>Máte právo:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>na přístup k osobním údajům</li>
          <li>na opravu</li>
          <li>na výmaz</li>
          <li>na omezení zpracování</li>
          <li>vznést námitku proti zpracování</li>
          <li>podat stížnost u Úřadu pro ochranu osobních údajů</li>
        </ul>
        <p className="mt-3">
          Kontakt pro uplatnění práv:{" "}
          <a href="mailto:terezakubeckova.spoluprace@email.cz" className="text-accent hover:underline">
            terezakubeckova.spoluprace@email.cz
          </a>
        </p>
      </>
    ),
  },
  {
    title: "7. Cookies",
    content: (
      <p>
        Web využívá technické cookies nezbytné pro správné fungování webu. Podrobnosti jsou uvedeny v samostatných{" "}
        <Link to="/cookies" className="text-accent hover:underline">
          Zásadách cookies
        </Link>
        .
      </p>
    ),
  },
  {
    title: "8. Zabezpečení",
    content: <p>Osobní údaje jsou zabezpečeny odpovídajícími technickými a organizačními opatřeními.</p>,
  },
];

const Gdpr = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="pt-28 pb-20">
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Zpět na hlavní stránku
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <Shield size={24} className="text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Zásady zpracování osobních údajů
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Datum účinnosti: 29. 1. 2026</p>
            </div>
          </div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.section
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                className="glass-card p-6 sm:p-8"
              >
                <h2 className="text-lg font-heading font-bold text-foreground mb-3">{s.title}</h2>
                <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{s.content}</div>
              </motion.section>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default Gdpr;
