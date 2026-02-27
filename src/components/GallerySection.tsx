import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const stories = [
  {
    src: "/gallery/story-pritel.webp",
    alt: "S přítelem",
    text: "S mužem, bez kterého by to nešlo. Protože když je člověk spokojený doma, může dobývat svět venku.",
  },
  {
    src: "/gallery/story-sef.webp",
    alt: "Se šéfem na galavečeru",
    text: "Za mým profesním růstem stojí i tento člověk, který mi trpělivě předává zkušenosti a naučil mě, že tahle práce není o produktech, ale o lidech.",
  },
  {
    src: "/gallery/story-jelinek.webp",
    alt: "S Marianem Jelínkem",
    text: "Inspirativní setkání s Marianem Jelínkem, který učí vítěze přemýšlet jinak. Protože mentální síla často rozhoduje víc než okolnosti.",
  },
  {
    src: "/gallery/story-podium-rada.webp",
    alt: "V řadě na pódiu – ocenění top obchodníků",
    text: "Rok, kdy se práce změnila v mistrovství. Ne díky štěstí, ale díky systematické práci, odvaze růst a ochotě nést odpovědnost.",
  },
  {
    src: "/gallery/story-povyseni.webp",
    alt: "Na podiu – 1. místo za celý rok",
    text: "Povýšení. A 1. místo za celý rok. Ne protože jsem měla štěstí. Ale protože jsem se rozhodla nevzdat.",
  },
  {
    src: "/gallery/gallery-diplomas.webp",
    alt: "Diplomy a certifikáty",
    text: "Každý diplom je důkaz, že vzdělávání nekončí školou. Neustále se vzdělávám, abych Vám mohla nabídnout to nejlepší.",
  },
  {
    src: "/gallery/gallery-stage.webp",
    alt: "Na podiu – 2. místo",
    text: "Druhé místo na pódiu. Každé ocenění je pro mě motivací jít dál a být ještě lepší pro své klienty.",
  },
  {
    src: "/gallery/story-vietnam.webp",
    alt: "Vietnam – odměna pro top obchodníky",
    text: "Vietnam. Odměna pro top obchodníky ve firmě. Práce, která dává smysl, přináší i takové momenty.",
  },
  {
    src: "/gallery/gallery-office.webp",
    alt: "Začátky v Generali",
    text: "Začátky v pojišťovnictví. Tady jsem složila první zkoušky a zjistila, že finance jsou moje cesta.",
  },
  {
    src: "/gallery/story-balicky.webp",
    alt: "Se sítkou na hlavě v hale",
    text: "Svět se otočil vzhůru nohama. Přišla jsem o práci. A tak jsem šla balit balíčky do haly. Protože jsem se nikdy nechtěla zastavit.",
  },
  {
    src: "/gallery/story-promoce.webp",
    alt: "Promoce s mámou",
    text: "Promoce. Za každým diplomem stojí máma. Za podporu, za víru, za tiché modlitby i hlasité povzbuzení.",
  },
  {
    src: "/gallery/story-chio.webp",
    alt: "Reklama na Chio",
    text: "Spokojenost někdy chutná takhle. Reklama na Chio – protože i práce může být trochu zábava.",
  },
  {
    src: "/gallery/story-bar.webp",
    alt: "S pípou za barem",
    text: "Když je potřeba, postavím se za bar i před něj. I poctivě natočené pivo je trochu umění.",
  },
  {
    src: "/gallery/story-catering.webp",
    alt: "Tři holky na akci",
    text: "Každý začátek má svůj příběh. Ten můj voněl po kávě, poctivé práci a cateringových akcích do noci.",
  },
  {
    src: "/gallery/story-celebrity.webp",
    alt: "Setkání s Rytmusem",
    text: "Jakmile jsem ho uviděla, mozek vypnul a nohy běžely. Chudák se snad i lekl. Ale fotku mám!",
  },
  {
    src: "/gallery/story-pohlreich.webp",
    alt: "S panem Pohlreichem",
    text: "Pan Pohlreich byl vždycky můj oblíbenec. Když přišla nabídka být mu k ruce při vaření, neváhala jsem ani minutu.",
  },
  {
    src: "/gallery/story-kolecko.webp",
    alt: "Jako malá s kolečkem",
    text: "Tehdy jsem jen tlačila kolečko a hrála si na velkou. Vůbec jsem netušila, že si jednou budeme stavět vlastní domov.",
  },
];

const GallerySection = () => {
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
      if (e.key === "ArrowLeft") setLightbox((prev) => (prev! - 1 + stories.length) % stories.length);
      if (e.key === "ArrowRight") setLightbox((prev) => (prev! + 1) % stories.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightbox]);

  const navigateLightbox = (dir: 1 | -1) => {
    if (lightbox === null) return;
    setLightbox((lightbox + dir + stories.length) % stories.length);
  };

  return (
    <section id="gallery" className="section-padding bg-background" ref={ref}>
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">
              Můj příběh
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
            Cesta, která mě formovala
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <button
            onClick={scrollPrev}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center text-foreground hover:text-accent transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 rounded-full bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center text-foreground hover:text-accent transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {stories.map((story, i) => (
                <div
                  key={i}
                  className="flex-[0_0_80%] sm:flex-[0_0_45%] lg:flex-[0_0_32%] min-w-0 pl-4 first:pl-0"
                >
                  <div
                    className="group relative rounded-2xl overflow-hidden bg-card border border-border/50 shadow-sm hover-lift cursor-pointer h-full"
                    onClick={() => setLightbox(i)}
                  >
                    <div className="overflow-hidden aspect-[3/4]">
                      <img
                        src={story.src}
                        alt={story.alt}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic line-clamp-3">
                        „{story.text}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-5">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === selectedIndex
                    ? "bg-accent w-5"
                    : "bg-border hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 md:top-6 md:right-6 text-primary-foreground hover:text-accent transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <X size={28} />
          </button>
          <button
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-accent transition-colors"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 text-primary-foreground hover:text-accent transition-colors"
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
          >
            <ChevronRight size={32} />
          </button>
          <div
            className="max-w-2xl w-full flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={stories[lightbox].src}
              alt={stories[lightbox].alt}
              className="max-h-[65vh] w-auto object-contain rounded-lg"
            />
            <p className="text-primary-foreground/90 text-center text-sm italic max-w-md leading-relaxed px-4">
              „{stories[lightbox].text}"
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default GallerySection;
