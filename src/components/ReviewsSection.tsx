import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

const reviews = [
  {
    name: "Martin K.",
    text: "Tereza mi pomohla s refinancováním hypotéky a ušetřila mi tisíce měsíčně. Profesionální přístup a vždy na telefonu.",
    rating: 5,
    service: "Hypotéka",
  },
  {
    name: "Petra S.",
    text: "Konečně mám přehled o svých financích. Tereza připravila skvělý finanční plán a vše mi srozumitelně vysvětlila.",
    rating: 5,
    service: "Finanční analýza",
  },
  {
    name: "Jan D.",
    text: "Díky Tereze jsem začal investovat a spořit na důchod. Za 2 roky spolupráce jsem více než spokojený.",
    rating: 5,
    service: "Investice",
  },
  {
    name: "Lucie M.",
    text: "Tereza nám pomohla s koupí prvního bytu – od hypotéky přes pojištění až po právní záležitosti. Vše na jednom místě!",
    rating: 5,
    service: "Reality & hypotéka",
  },
  {
    name: "Tomáš R.",
    text: "Empatický a lidský přístup. Tereza se vždy zajímá o celkovou situaci, ne jen o čísla. Doporučuji všem!",
    rating: 5,
    service: "Majetkové poradenství",
  },
  {
    name: "Kateřina V.",
    text: "Po rozvodu mi Tereza pomohla zorientovat se ve financích a pojištění. Byla mi obrovskou oporou.",
    rating: 5,
    service: "Finanční plán",
  },
];

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    skipSnaps: false,
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
    <section id="reviews" className="section-padding bg-secondary" ref={ref}>
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">Reference</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Co říkají moji klienti
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">Přes 100 spokojených klientů, kteří mě doporučují dál.</p>
        </motion.div>

        {/* Mobile: Embla carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:hidden relative"
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review, i) => (
                <div key={i} className="flex-[0_0_85%] min-w-0 pl-3 first:pl-0">
                  <div className="glass-card p-6 relative h-full">
                    <Quote size={24} className="text-accent/20 absolute top-3 right-3" />
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(review.rating)].map((_, j) => (
                        <Star key={j} size={12} className="fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground mb-4 leading-relaxed italic">"{review.text}"</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-foreground">{review.name}</span>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{review.service}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile nav */}
          <div className="flex justify-center items-center gap-3 mt-5">
            <button onClick={scrollPrev} className="p-1.5 rounded-lg border border-border hover:border-accent text-muted-foreground hover:text-foreground transition-all">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? "bg-accent w-5" : "bg-border"
                  }`}
                />
              ))}
            </div>
            <button onClick={scrollNext} className="p-1.5 rounded-lg border border-border hover:border-accent text-muted-foreground hover:text-foreground transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 relative"
            >
              <Quote size={32} className="text-accent/20 absolute top-4 right-4" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, j) => (
                  <Star key={j} size={14} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground mb-6 leading-relaxed italic">"{review.text}"</p>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">{review.name}</span>
                <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">{review.service}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
