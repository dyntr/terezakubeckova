import { motion } from "framer-motion";
import { ArrowDown, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const heroPoster = "/hero-poster.webp";
const heroVideoDesktopAv1 = "/hero-desktop-av1.webm";
const heroVideoDesktopWebm = "/hero-desktop.webm";
const heroVideoDesktopMp4 = "/hero-desktop.mp4";
const heroVideoMobileAv1 = "/hero-mobile-av1.webm";
const heroVideoMobileWebm = "/hero-mobile.webm";
const heroVideoMobileMp4 = "/hero-mobile.mp4";

const HeroSection = () => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches
  );
  const videoRef = useRef<HTMLVideoElement>(null);

  // Spustí přehrávání co nejdřív (i kdyby prohlížeč autoplay odložil).
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    v.addEventListener("loadeddata", tryPlay, { once: true });
    return () => v.removeEventListener("loadeddata", tryPlay);
  }, [reducedMotion, isMobile]);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionMq.matches);
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionMq.addEventListener("change", onMotion);

    const sizeMq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(sizeMq.matches);
    const onSize = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    sizeMq.addEventListener("change", onSize);

    return () => {
      motionMq.removeEventListener("change", onMotion);
      sizeMq.removeEventListener("change", onSize);
    };
  }, []);

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  const videoAv1 = isMobile ? heroVideoMobileAv1 : heroVideoDesktopAv1;
  const videoWebm = isMobile ? heroVideoMobileWebm : heroVideoDesktopWebm;
  const videoMp4 = isMobile ? heroVideoMobileMp4 : heroVideoDesktopMp4;

  return (
    <section
      id="hero"
      className="relative mt-16 md:mt-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] min-h-[560px] w-full overflow-hidden bg-black"
    >
      {/* Video fills entire hero — edge to edge */}
      {reducedMotion ? (
        <img
          src={heroPoster}
          alt="Ing. Tereza Kubečková - finanční poradkyně"
          className="absolute inset-0 w-full h-full object-cover [object-position:50%_38%] z-0"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />
      ) : (
        <video
          ref={videoRef}
          key={videoMp4}
          className="absolute inset-0 w-full h-full object-cover [object-position:50%_38%] z-0"
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Ing. Tereza Kubečková - finanční poradkyně"
        >
          <source src={videoAv1} type='video/webm; codecs="av01.0.05M.08"' />
          <source src={videoWebm} type='video/webm; codecs="vp9"' />
          <source src={videoMp4} type="video/mp4" />
        </video>
      )}

      {/* Readability scrim over video – silnější, aby byl text vždy dobře čitelný */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-black/50 via-black/30 to-black/85 lg:bg-gradient-to-r lg:from-black/85 lg:via-black/55 lg:to-black/10" />
      {/* Jemná vinětace pro hloubku */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(120%_90%_at_30%_50%,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

      {/* Text overlay */}
      <div className="relative z-20 flex h-full w-full items-end lg:items-center pb-12 lg:pb-0">
        <div className="w-full mx-auto px-6 lg:px-12 xl:px-20">
          <div className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4 lg:mb-6"
            >
              <div className="h-px w-10 lg:w-12 bg-accent" />
              <span className="text-[11px] lg:text-sm font-medium text-accent tracking-wider uppercase">
                Nezávislé finanční poradenství
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.05] mb-4 lg:mb-6 drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]"
            >
              Vaše finance,
              <br />
              <span className="text-gradient-gold italic">Váš klid.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/95 leading-relaxed mb-6 lg:mb-10 [text-shadow:0_1px_12px_rgba(0,0,0,0.6)]"
            >
              Pomáhám lidem mít přehled o svých financích, chránit majetek a plnit si sny.
              Nezávisle, transparentně a s lidským přístupem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 lg:gap-4 mb-6 lg:mb-10 justify-center lg:justify-start"
            >
              <button
                onClick={scrollToContact}
                className="gold-gradient cta-glow text-accent-foreground px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-sm lg:text-base font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Nezávazná konzultace zdarma · 15 min
              </button>
              <button
                onClick={scrollToAbout}
                className="border-2 border-white/60 text-white px-6 lg:px-8 py-3 lg:py-4 rounded-xl text-sm lg:text-base font-semibold hover:border-accent hover:text-accent transition-all active:scale-[0.98] backdrop-blur-sm"
              >
                Zjistit více
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-1 text-xs lg:text-sm text-white/80"
            >
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={isMobile ? 12 : 14} className="fill-accent text-accent" />
              ))}
              <span className="ml-1.5 lg:ml-2">100+ spokojených klientů</span>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 text-white/80 hover:text-white transition-colors hidden lg:block"
      >
        <ArrowDown size={28} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
