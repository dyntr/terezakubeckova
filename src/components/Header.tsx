import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import TKLogo from "./TKLogo";
import { scrollToId } from "@/lib/scroll";

const navItems = [
  { label: "Úvod", href: "#hero" },
  { label: "O mně", href: "#about" },
  { label: "Služby", href: "#services" },
  { label: "Certifikace", href: "#certificates" },
  { label: "Kalkulačky", href: "#calculators" },
  { label: "Reference", href: "#reviews" },
  { label: "Galerie", href: "#gallery" },
  { label: "Kontakt", href: "#contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setIsMobileOpen(false);
    const id = href.replace(/^#/, "");
    // On sub-pages (e.g. /gdpr, /cookies) the target sections don't exist, so
    // navigate home with the hash; Index reads it and scrolls after mount.
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    // Defer the scroll until after React commits the menu-close re-render,
    // otherwise the state update + exit animation cancels the smooth scroll
    // (the bug that made the mobile menu feel "broken").
    requestAnimationFrame(() => scrollToId(id));
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-card/95 backdrop-blur-md shadow-lg border-b border-border/50"
          : "bg-card/90 backdrop-blur-md border-b border-border/40"
      }`}
    >
      <div className="container-narrow mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-20">
        <button onClick={() => scrollTo("#hero")} className="flex items-center gap-2.5">
          <TKLogo className="w-8 h-8 text-accent" />
          <span className="font-heading text-lg md:text-xl font-semibold text-foreground">
            Tereza <span className="text-gradient-gold">Kubečková</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => scrollTo(item.href)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("#contact")}
            className="gold-gradient text-accent-foreground px-5 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Nezávazná konzultace
          </button>
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="lg:hidden p-2 text-foreground"
          aria-label="Otevřít menu"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card backdrop-blur-lg border-b border-border overflow-hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className="text-left py-3 text-base font-medium text-foreground hover:text-accent transition-colors border-b border-border/30 last:border-0"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollTo("#contact")}
                className="gold-gradient text-accent-foreground py-3 px-5 rounded-lg text-base font-semibold mt-3 text-center"
              >
                Nezávazná konzultace
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
