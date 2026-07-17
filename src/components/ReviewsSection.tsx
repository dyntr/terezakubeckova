import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Star, Quote, ChevronLeft, ChevronRight, ExternalLink, PenLine } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import GoogleGlyph from "./GoogleGlyph";
import { useGoogleReviews } from "@/hooks/useGoogleReviews";
import {
  GOOGLE_ALL_REVIEWS_URL,
  GOOGLE_WRITE_REVIEW_URL,
  initials,
  avatarColor,
  relativeCzech,
  type GoogleReview,
} from "@/data/reviews";

const AUTOPLAY_MS = 4500;

const Stars = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < rating ? "fill-[#fbbc04] text-[#fbbc04]" : "fill-muted text-muted"}
      />
    ))}
  </div>
);

const ReviewCard = ({ review }: { review: GoogleReview }) => (
  <div className="glass-card relative h-full p-6 sm:p-7">
    <GoogleGlyph className="w-5 h-5 absolute top-5 right-5 opacity-90" />

    <div className="flex items-center gap-3 mb-3">
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-full ${avatarColor(
          review.author,
        )} text-white flex items-center justify-center font-semibold text-sm`}
      >
        {initials(review.author)}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{review.author}</p>
        <p className="text-xs text-muted-foreground">{relativeCzech(review.date)}</p>
      </div>
    </div>

    <Stars rating={review.rating} />

    <div className="relative mt-3">
      <Quote size={18} className="text-accent/20 absolute -top-1 -left-1" />
      <p className="text-sm text-foreground leading-relaxed pl-5">{review.text}</p>
    </div>
  </div>
);

const ReviewsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { reviews, rating, count } = useGoogleReviews();

  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    stopAutoplay();
    if (!emblaApi) return;
    autoplayRef.current = setInterval(() => emblaApi.scrollNext(), AUTOPLAY_MS);
  }, [emblaApi, stopAutoplay]);

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
    startAutoplay();
  }, [emblaApi, startAutoplay]);
  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
    startAutoplay();
  }, [emblaApi, startAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    startAutoplay();
    return () => {
      emblaApi.off("select", onSelect);
      stopAutoplay();
    };
  }, [emblaApi, startAutoplay, stopAutoplay]);

  return (
    <section id="reviews" className="section-padding bg-secondary" ref={ref}>
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">Reference</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Co říkají moji klienti
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Skutečná hodnocení ověřená přímo na Google.
          </p>
        </motion.div>

        {/* Souhrnná karta hodnocení Google */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card max-w-2xl mx-auto p-6 sm:p-8 mb-8 md:mb-10"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="flex items-center gap-3">
              <GoogleGlyph className="w-8 h-8" />
              <span className="font-heading text-lg font-semibold text-foreground">Recenze na Google</span>
            </div>

            <div className="hidden sm:block w-px h-12 bg-border" />

            <div className="flex items-center gap-4">
              <span className="text-4xl font-heading font-bold text-foreground leading-none">
                {rating.toFixed(1).replace(".", ",")}
              </span>
              <div>
                <Stars rating={Math.round(rating)} size={18} />
                <p className="text-xs text-muted-foreground mt-1">
                  {count} {count === 1 ? "recenze" : count < 5 ? "recenze" : "recenzí"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <a
              href={GOOGLE_ALL_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent transition-all"
            >
              <ExternalLink size={16} />
              Zobrazit všechny recenze
            </a>
            <a
              href={GOOGLE_WRITE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 gold-gradient text-accent-foreground rounded-lg px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <PenLine size={16} />
              Napsat recenzi
            </a>
          </div>
        </motion.div>

        {/* Auto-rotující carousel recenzí (mobil 1, desktop 2 karty) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
          onMouseEnter={stopAutoplay}
          onMouseLeave={startAutoplay}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {reviews.map((review, i) => (
                <div
                  key={review.author + i}
                  className="flex-[0_0_88%] sm:flex-[0_0_60%] md:flex-[0_0_50%] min-w-0 pl-4 first:pl-0"
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>

          {reviews.length > 1 && (
            <div className="flex justify-center items-center gap-3 mt-6">
              <button
                onClick={scrollPrev}
                aria-label="Předchozí"
                className="p-1.5 rounded-lg border border-border hover:border-accent text-muted-foreground hover:text-foreground transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1.5">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      emblaApi?.scrollTo(i);
                      startAutoplay();
                    }}
                    aria-label={`Recenze ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === selectedIndex ? "bg-accent w-5" : "bg-border w-2"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={scrollNext}
                aria-label="Další"
                className="p-1.5 rounded-lg border border-border hover:border-accent text-muted-foreground hover:text-foreground transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
