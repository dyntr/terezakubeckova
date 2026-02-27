import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const CtaBanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-12 md:py-16 bg-background" ref={ref}>
      <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="navy-gradient rounded-2xl p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Subtle decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground mb-3 relative z-10">
            Chcete mít přehled o svých financích?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto text-sm sm:text-base relative z-10">
            Domluvte si 15minutovou nezávaznou konzultaci zdarma. Společně najdeme to nejlepší řešení pro Vaši situaci.
          </p>
          <button
            onClick={scrollToContact}
            className="gold-gradient cta-glow text-accent-foreground px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 transition-all inline-flex items-center gap-2 active:scale-[0.98] relative z-10"
          >
            Domluvit 15min konzultaci zdarma
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaBanner;
