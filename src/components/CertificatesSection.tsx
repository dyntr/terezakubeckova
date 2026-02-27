import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Award, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const certificates = [
  {
    title: "Spotřebitelský úvěr",
    subtitle: "Úvěr jiný než na bydlení a na bydlení",
    authority: "Vysoká škola finanční a správní",
    date: "7. 10. 2021",
    number: "č. 2694",
    image: "/certificates/uvery.jpg",
    pdf: "/certificates/uvery.pdf",
  },
  {
    title: "Životní a neživotní pojištění",
    subtitle: "Distribuce životního a neživotního občanského pojištění",
    authority: "Acredité s.r.o.",
    date: "24. 7. 2020",
    number: "č. E20200724090109",
    image: "/certificates/zivot-nezivot.jpg",
    pdf: "/certificates/zivot-nezivot.pdf",
  },
  {
    title: "Investiční služby",
    subtitle: "Jednání se zákazníkem – investiční nástroje",
    authority: "Vysoká škola finanční a správní",
    date: "4. 3. 2021",
    number: "č. 1824",
    image: "/certificates/investice.jpg",
    pdf: "/certificates/investice.pdf",
  },
  {
    title: "Doplňkové penzijní spoření",
    subtitle: "Distribuce produktů penzijního spoření",
    authority: "Vysoká škola finanční a správní",
    date: "8. 9. 2022",
    number: "č. 5083",
    image: "/certificates/dps.jpg",
    pdf: "/certificates/dps.pdf",
  },
  {
    title: "Neživotní pojištění – podnikatelé",
    subtitle: "Distribuce neživotního pojištění podnikatelské činnosti",
    authority: "Vysoká škola finanční a správní",
    date: "21. 1. 2022",
    number: "č. 4348",
    image: "/certificates/nezivot-podnikatele.jpg",
    pdf: "/certificates/nezivot-podnikatele.pdf",
  },
  {
    title: "Velká pojistná rizika",
    subtitle: "Distribuce pojištění velkých pojistných rizik",
    authority: "Vysoká škola finanční a správní",
    date: "2. 6. 2022",
    number: "č. 4684",
    image: "/certificates/velka-pojistna-rizika.jpg",
    pdf: "/certificates/velka-pojistna-rizika.pdf",
  },
];

const CertificatesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [lightbox, setLightbox] = useState<number | null>(null);
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

  // Escape key handler for lightbox
  useEffect(() => {
    if (lightbox === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  return (
    <>
      <section id="certificates" className="section-padding bg-secondary" ref={ref}>
        <div className="container-narrow mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-12 bg-accent" />
              <span className="text-sm font-medium text-accent tracking-wider uppercase">
                Certifikace
              </span>
              <div className="h-px w-12 bg-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Odborné zkoušky ČNB
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Všechny potřebné certifikace pro komplexní finanční poradenství.
            </p>
          </motion.div>

          {/* Desktop: grid, Mobile: carousel */}
          <div className="hidden md:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert, i) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card overflow-hidden hover-lift group cursor-pointer"
                onClick={() => setLightbox(i)}
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <Award size={20} className="text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-1">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2">{cert.subtitle}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{cert.date}</span>
                        <span>·</span>
                        <span>{cert.number}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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

            <div className="overflow-hidden rounded-xl" ref={emblaRef}>
              <div className="flex">
                {certificates.map((cert, i) => (
                  <div key={cert.title} className="flex-[0_0_85%] min-w-0 pl-3 first:pl-0">
                    <div
                      className="glass-card overflow-hidden cursor-pointer"
                      onClick={() => setLightbox(i)}
                    >
                      <div className="relative h-40 bg-muted overflow-hidden">
                        <img
                          src={cert.image}
                          alt={cert.title}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start gap-2">
                          <Award size={16} className="text-accent flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-heading font-semibold text-sm text-foreground mb-0.5">
                              {cert.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{cert.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-1.5 mt-4">
              {certificates.map((_, i) => (
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

      {/* Lightbox */}
      {lightbox !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-foreground/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative max-w-3xl w-full bg-card rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-heading font-semibold text-foreground">
                {certificates[lightbox].title}
              </h3>
              <div className="flex items-center gap-2">
                <a
                  href={certificates[lightbox].pdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-accent hover:opacity-80 transition-opacity"
                >
                  <ExternalLink size={14} />
                  Otevřít PDF
                </a>
                <button
                  onClick={() => setLightbox(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-2">
              <img
                src={certificates[lightbox].image}
                alt={certificates[lightbox].title}
                className="w-full rounded-lg"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default CertificatesSection;
