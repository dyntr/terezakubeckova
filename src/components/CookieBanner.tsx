import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Link } from "react-router-dom";

const CookieBanner = () => {
  const [show, setShow] = useState(false);

  const checkConsent = () => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShow(true);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkConsent, 1500);

    // Listen for reopen from footer "Nastavení cookies" button
    const handleConsentChange = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        setShow(true);
      }
    };
    window.addEventListener("cookie-consent-change", handleConsentChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("cookie-consent-change", handleConsentChange);
    };
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 glass-card p-5 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <Cookie size={20} className="text-accent mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground font-medium mb-1">Cookies</p>
              <p className="text-xs text-muted-foreground mb-4">
                Tento web používá pouze technické cookies nezbytné pro správné fungování. Více v sekci{" "}
                <Link to="/cookies" className="text-accent hover:underline">Cookies</Link> a{" "}
                <Link to="/gdpr" className="text-accent hover:underline">GDPR</Link>.
              </p>
              <div className="flex gap-2">
                <button onClick={accept} className="gold-gradient text-accent-foreground px-4 py-2 rounded-lg text-xs font-semibold">
                  Přijmout
                </button>
                <button onClick={decline} className="border border-border text-muted-foreground px-4 py-2 rounded-lg text-xs hover:text-foreground transition-colors">
                  Odmítnout
                </button>
              </div>
            </div>
            <button onClick={decline} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieBanner;
