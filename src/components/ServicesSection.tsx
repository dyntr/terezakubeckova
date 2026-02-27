import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Home, TrendingUp, Shield, Building2, FileText, Briefcase, Scale, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const services = [
  { icon: Home, title: "Hypotéky a úvěry", desc: "Vlastní bydlení, investiční nemovitosti, refinancování, spotřebitelské a podnikatelské úvěry za nejlepších podmínek na trhu." },
  { icon: TrendingUp, title: "Spoření a investice", desc: "Dlouhodobé zhodnocení, DIP, penzijní spoření a pravidelné investování." },
  { icon: Shield, title: "Pojištění", desc: "Ochrana majetku, zabezpečení příjmu, zaměstnanecké a podnikatelské pojištění." },
  { icon: Building2, title: "Realitní poradenství", desc: "Spolupráce s realitními makléři, pomoc při koupi a financování nemovitostí." },
  { icon: FileText, title: "Finanční analýza", desc: "Komplexní zmapování Vaší situace a osobní finanční plán šitý na míru." },
  { icon: Briefcase, title: "Majetkové poradenství", desc: "Ochrana a strategické rozvíjení majetku prostřednictvím pečlivě vybraných řešení napříč bankovním, pojistným i investičním trhem." },
  { icon: Scale, title: "Právní a daňová spolupráce", desc: "Spolupráce s daňovými poradci a právníky pro komplexní řešení." },
];

const ServiceCard = ({ service, i, isInView }: { service: typeof services[0]; i: number; isInView: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={isInView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.5, delay: i * 0.08 }}
    className="glass-card p-6 md:p-8 hover-lift group cursor-default h-full"
  >
    <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl gold-gradient flex items-center justify-center mb-4 md:mb-5 group-hover:scale-110 transition-transform">
      <service.icon size={20} className="text-accent-foreground" />
    </div>
    <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-2">
      {service.title}
    </h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{service.desc}</p>
  </motion.div>
);

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <section id="services" className="section-padding bg-secondary" ref={ref}>
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">Služby</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Komplexní finanční péče
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Postarám se o Vaše finance od A do Z. Nezávisle vybírám z celého trhu, 
            abych Vám vždy přinesla to nejlepší řešení.
          </p>
        </motion.div>

        {/* Desktop: grid */}
        <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ServiceCard key={service.title} service={service} i={i} isInView={isInView} />
          ))}
        </div>

        {/* Mobile: carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:hidden relative"
        >
          <button
            onClick={scrollPrev}
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center text-foreground hover:text-accent transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center text-foreground hover:text-accent transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {services.map((service, i) => (
                <div key={service.title} className="flex-[0_0_85%] min-w-0 pl-3 first:pl-0">
                  <ServiceCard service={service} i={0} isInView={isInView} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-5">
            {services.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "bg-accent w-5"
                    : "bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
