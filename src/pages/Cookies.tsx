import { motion } from "framer-motion";
import { ArrowLeft, Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  {
    title: "1. Co jsou cookies",
    content: (
      <p>
        Cookies jsou malé textové soubory, které se ukládají do vašeho zařízení při návštěvě webových stránek.
        Umožňují webu rozpoznat uživatele, zapamatovat si jeho nastavení a zlepšovat uživatelský zážitek.
      </p>
    ),
  },
  {
    title: "2. Jaké cookies používáme",
    content: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-foreground mb-2">Nezbytné (technické) cookies</h3>
          <p>Tyto cookies jsou nutné pro správné fungování webu. Nelze je vypnout.</p>
          <p className="mt-2">Používají se například pro:</p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>zabezpečení webu</li>
            <li>správu souhlasů</li>
            <li>technické fungování formulářů</li>
          </ul>
          <p className="mt-2 text-xs italic">Právní základ: oprávněný zájem správce.</p>
        </div>
      </div>
    ),
  },
  {
    title: "3. Kdo má k údajům přístup",
    content: (
      <>
        <p>Údaje mohou být zpřístupněny:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>poskytovateli hostingu</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Jak můžete cookies spravovat",
    content: (
      <>
        <p>Při první návštěvě webu si můžete zvolit:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Přijmout cookies</li>
          <li>Odmítnout cookies</li>
        </ul>
        <p className="mt-3">
          Souhlas můžete kdykoliv změnit prostřednictvím odkazu „Nastavení cookies" v patičce webu.
        </p>
        <p className="mt-2">Cookies můžete také spravovat ve svém internetovém prohlížeči.</p>
      </>
    ),
  },
  {
    title: "5. Doba uchování",
    content: (
      <p>
        Technické cookies jsou uchovávány po dobu nezbytnou pro fungování webu, zpravidla do konce relace prohlížeče.
      </p>
    ),
  },
];

const CookiesPage = () => (
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

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
              <Cookie size={24} className="text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground">
                Zásady používání cookies
              </h1>
              <p className="text-sm text-muted-foreground mt-1">Datum účinnosti: 29. 1. 2026</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Webové stránky terezakubeckova.cz používají pouze technické cookies nezbytné pro správné fungování webu.
          </p>

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

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Podrobnosti o zpracování osobních údajů naleznete v{" "}
              <Link to="/gdpr" className="text-accent hover:underline font-medium">
                Zásadách zpracování osobních údajů
              </Link>
              .
            </p>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
  </div>
);

export default CookiesPage;
