import { motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import { useInView } from "framer-motion";

const partners = [
  { name: "Raiffeisen Bank", logo: "/logos/raiffeisen.png" },
  { name: "mBank", logo: "/logos/mbank.png" },
  { name: "Česká spořitelna", logo: "/logos/ceska-sporitelna.png" },
  { name: "UniCredit Bank", logo: "/logos/unicredit.png" },
  { name: "Komerční banka", logo: "/logos/komercni-banka.png" },
  { name: "ČSOB", logo: "/logos/csob.png" },
  { name: "Modrá pyramida", logo: "/logos/modra-pyramida.png" },
  { name: "Amundi", logo: "/logos/amundi.png" },
  { name: "Conseq", logo: "/logos/conseq.png" },
  { name: "Cyrrus", logo: "/logos/cyrrus.png" },
  { name: "Investika", logo: "/logos/investika.png" },
  { name: "J&T", logo: "/logos/jt.png" },
  { name: "Allianz", logo: "/logos/allianz.png" },
  { name: "Direct", logo: "/logos/direct.png" },
  { name: "Kooperativa", logo: "/logos/kooperativa.png" },
  { name: "Generali", logo: "/logos/generali.png" },
  { name: "Uniqa", logo: "/logos/uniqa.png" },
  { name: "NN", logo: "/logos/nn.png" },
  { name: "MetLife", logo: "/logos/metlife.png" },
  { name: "AXA", logo: "/logos/axa.png" },
  { name: "ČPP", logo: "/logos/cpp.png" },
  { name: "RE/MAX", logo: "/logos/remax.png" },
  { name: "Century 21", logo: "/logos/century21.png" },
  { name: "Neotax", logo: "/logos/neotax.png" },
];

const PartnersSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const animationRef = useRef<number>();
  const isPaused = useRef(false);

  // Triple the partners for seamless infinite scroll
  const tripled = [...partners, ...partners, ...partners];

  // Auto-scroll animation
  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isPaused.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    el.scrollLeft += 0.5;

    // Reset scroll position seamlessly when reaching the second set
    const singleWidth = el.scrollWidth / 3;
    if (el.scrollLeft >= singleWidth * 2) {
      el.scrollLeft -= singleWidth;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Start at the first set
    el.scrollLeft = el.scrollWidth / 3;

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  // Touch & mouse drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isPaused.current = true;
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
    scrollRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - startX;
    scrollRef.current.scrollLeft = scrollLeft - dx;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    scrollRef.current?.releasePointerCapture(e.pointerId);
    // Resume auto-scroll after 2 seconds
    setTimeout(() => { isPaused.current = false; }, 2000);
  };

  return (
    <section className="py-12 md:py-16 bg-background overflow-hidden" ref={sectionRef}>
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-accent tracking-wider uppercase mb-2">
            Spolupracuji s
          </p>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            Partneři napříč trhem
          </h2>
        </motion.div>
      </div>

      {/* Scrollable carousel */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div
          ref={scrollRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="flex overflow-x-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {tripled.map((partner, i) => (
            <div
              key={`${partner.name}-${i}`}
              className="flex-shrink-0 mx-2 md:mx-3"
            >
              <div className="glass-card p-3 md:px-5 md:py-4 flex items-center gap-2 md:gap-3 min-w-[120px] md:min-w-[160px] h-12 md:h-14">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-6 h-6 md:w-7 md:h-7 object-contain flex-shrink-0"
                  loading="lazy"
                  draggable={false}
                />
                <span className="text-xs md:text-sm font-medium text-foreground whitespace-nowrap">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
