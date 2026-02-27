import { motion } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";

const heroImage = "/hero-portrait.webp";

const HeroSection = () => {
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative lg:min-h-screen flex flex-col lg:flex-row lg:items-center overflow-hidden bg-secondary">
      {/* Mobile: Full-width hero photo at top - immediate render */}
      <div className="relative lg:hidden w-full pt-14">
        <div className="relative w-full flex justify-center overflow-hidden" style={{ maxHeight: '45vh' }}>
          <img
            src={heroImage}
            alt="Ing. Tereza Kubečková - finanční poradkyně"
            className="w-auto h-full max-h-[45vh] object-cover object-top"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            width={600}
            height={800}
          />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-secondary to-transparent" />
        </div>
      </div>

      <div className="relative z-10 container-narrow mx-auto px-4 sm:px-6 lg:px-8 pb-6 lg:pb-0 md:pt-0">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-8 items-center lg:min-h-screen">
          <div className="max-w-xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center gap-2 mb-2 md:mb-6 -mt-4 lg:mt-0"
            >
              <div className="h-px w-8 md:w-12 bg-accent" />
              <span className="text-[10px] md:text-sm font-medium text-accent tracking-wider uppercase">
                Nezávislé finanční poradenství
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground leading-tight mb-2 md:mb-6"
            >
              Vaše finance,
              <br />
              <span className="text-gradient-gold italic">Váš klid.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm md:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4 md:mb-8"
            >
              Pomáhám lidem mít přehled o svých financích, chránit majetek a plnit si sny.
              Nezávisle, transparentně a s lidským přístupem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 md:mb-12"
            >
              <button
                onClick={scrollToContact}
                className="gold-gradient cta-glow text-accent-foreground px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Nezávazná konzultace zdarma · 15 min
              </button>
              <button
                onClick={scrollToAbout}
                className="border-2 border-border text-foreground px-5 sm:px-8 py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:border-accent hover:text-accent transition-all active:scale-[0.98]"
              >
                Zjistit více
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-accent text-accent sm:w-3.5 sm:h-3.5" />
              ))}
              <span className="ml-1.5">100+ spokojených klientů</span>
            </motion.div>
          </div>

          {/* Desktop: Photo on right */}
          <div className="hidden lg:flex items-end justify-center self-end overflow-hidden">
            <img
              src={heroImage}
              alt="Ing. Tereza Kubečková - finanční poradkyně"
              className="w-auto max-h-[80vh] object-contain drop-shadow-2xl"
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              width={600}
              height={800}
            />
          </div>
        </div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-20 text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
      >
        <ArrowDown size={24} />
      </motion.button>
    </section>
  );
};

export default HeroSection;