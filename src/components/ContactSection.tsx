import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail, Phone, MapPin, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Vyplňte jméno").max(100),
  email: z.string().trim().email("Zadejte platný e-mail").max(255),
  phone: z.string().trim().min(9, "Zadejte platné číslo").max(20),
  subject: z.string().min(1, "Vyberte téma"),
  message: z.string().trim().min(1, "Napište zprávu").max(2000),
  gdpr: z.literal(true, { errorMap: () => ({ message: "Musíte souhlasit se zpracováním údajů" }) }),
});

const subjects = [
  "Hypotéka / úvěr",
  "Spoření a investice",
  "Pojištění",
  "Realitní poradenství",
  "Finanční analýza",
  "Jiné",
];

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", gdpr: false as boolean });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  const WEB3FORMS_KEY = "288ee3af-59f1-422a-8dc0-918c2e503d6b";
  // Replace with your deployed Google Apps Script URL:
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwV8LDbT3ne_Je8IYkpGxvh2MDeRmsFmEP1LcdxGbuLOku22ezjRvlu2I3wOxRyqe29/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSending(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    };

    try {
      // Fire both requests in parallel
      const promises: Promise<Response>[] = [
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...payload }),
        }),
      ];

      if (GOOGLE_SHEET_URL) {
        promises.push(
          fetch(GOOGLE_SHEET_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        );
      }

      const [web3Res] = await Promise.allSettled(promises);

      if (web3Res.status === "fulfilled" && web3Res.value.ok) {
        toast.success("Poptávka odeslána! Ozvu se Vám co nejdříve.");
        setForm({ name: "", email: "", phone: "", subject: "", message: "", gdpr: false });
      } else {
        toast.error("Něco se pokazilo. Zkuste to prosím znovu.");
      }
    } catch {
      toast.error("Chyba při odesílání. Zkuste to prosím znovu.");
    } finally {
      setSending(false);
    }
  };

  const update = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const inputClass = "w-full bg-background border border-border rounded-lg px-4 py-3 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-shadow";

  return (
    <section id="contact" className="section-padding bg-secondary" ref={ref}>
      <div className="container-narrow mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-12 bg-accent" />
            <span className="text-sm font-medium text-accent tracking-wider uppercase">Kontakt</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Pojďme se potkat
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Vyplňte formulář a já se Vám ozvu. Úvodní 15minutová konzultace je nezávazná a zdarma.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3 glass-card p-5 sm:p-8 space-y-4 sm:space-y-5"
          >
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Jméno a příjmení</label>
                <input
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                  placeholder="Jan Novák"
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="jan@email.cz"
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Telefon</label>
                <input
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+420 xxx xxx xxx"
                  inputMode="tel"
                />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Téma</label>
                <div className="relative">
                  <select
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                  >
                    <option value="">Vyberte téma…</option>
                    {subjects.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                {errors.subject && <p className="text-destructive text-xs mt-1">{errors.subject}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Zpráva</label>
              <textarea
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Popište, s čím Vám mohu pomoci..."
              />
              {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
            </div>
            {/* GDPR consent */}
            <label className="flex items-start gap-3 cursor-pointer group/gdpr">
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={form.gdpr}
                  onChange={(e) => update("gdpr", e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center group-hover/gdpr:border-accent/60 ${form.gdpr ? 'bg-accent border-accent' : 'border-border bg-background'}`}>
                  {form.gdpr && (
                    <svg className="w-3 h-3 text-accent-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground leading-relaxed">
                Souhlasím se{" "}
                <Link to="/gdpr" className="text-accent hover:underline font-medium" target="_blank">
                  zpracováním osobních údajů
                </Link>
                {" "}za účelem vyřízení poptávky.
              </span>
            </label>
            {errors.gdpr && <p className="text-destructive text-xs -mt-2">{errors.gdpr}</p>}
            <div className="relative w-full rounded-xl p-[2px] overflow-hidden group/cta">
              {/* Rotating white border beam */}
              <div className="absolute inset-[-2px] rounded-xl animate-[spin-border_2.5s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 55%, rgba(255,255,255,0.9) 70%, white 75%, rgba(255,255,255,0.9) 80%, transparent 95%, transparent 100%)' }} />
              {/* Glow layer */}
              <div className="absolute inset-[-4px] rounded-xl animate-[spin-border_2.5s_linear_infinite] blur-md opacity-60" style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 55%, rgba(255,255,255,0.7) 70%, white 75%, rgba(255,255,255,0.7) 80%, transparent 95%, transparent 100%)' }} />
              <button
                type="submit"
                disabled={sending}
                className="relative w-full gold-gradient cta-glow text-accent-foreground py-4 sm:py-5 rounded-[10px] font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all duration-300 group-hover/cta:shadow-[0_0_40px_hsl(38_65%_52%/0.5)] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                ) : (
                  <Send size={20} className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
                )}
                {sending ? "Odesílám…" : "Odeslat poptávku"}
                <span className="absolute inset-0 rounded-[10px] bg-white/0 group-hover/cta:bg-white/10 transition-colors duration-300" />
              </button>
            </div>
          </motion.form>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-4 sm:space-y-6"
          >
            {/* Nezávazná konzultace CTA */}
            <div className="glass-card p-6 sm:p-8 text-center hover-lift">
              <div className="w-14 h-14 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4">
                <Phone size={24} className="text-accent-foreground" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                15min konzultace zdarma
              </h3>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Rychlá 15minutová nezávazná schůzka – osobně nebo online. Zavolejte nebo napište.
              </p>
              <a
                href="tel:+420775303314"
                className="inline-flex items-center justify-center gap-2 navy-gradient text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity w-full active:scale-[0.98]"
              >
                <Phone size={16} />
                775 303 314
              </a>
            </div>

            <div className="glass-card p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">E-mail</p>
                  <a href="mailto:tereza.kubeckova@4fin.cz" className="text-sm text-muted-foreground hover:text-accent transition-colors break-all">
                    tereza.kubeckova@4fin.cz
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Telefon</p>
                  <a href="tel:+420775303314" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    775 303 314
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Kancelář</p>
                  <p className="text-sm text-muted-foreground">Ke Štvanici 656/3</p>
                  <p className="text-sm text-muted-foreground">186 00 Karlín</p>
                </div>
              </div>
            </div>

            {/* Google Maps embed */}
            <div className="glass-card overflow-hidden hover-lift group rounded-2xl">
              <div className="relative h-52 overflow-hidden rounded-t-2xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2560.4!2d14.4356!3d50.0933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470b94bedd606baf%3A0x9bf9bd5a35a6268b!2sKe%20%C5%A0tvanici%20656%2F3%2C%20186%2000%20Karl%C3%ADn!5e0!3m2!1scs!2scz!4v1709000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa kanceláře – Ke Štvanici 656/3, Karlín"
                  className="hue-rotate-[190deg] saturate-[0.6] brightness-[1.05] contrast-[1.1] group-hover:saturate-[0.8] transition-all duration-700 scale-[1.02]"
                />
                <div className="absolute inset-0 bg-[hsl(215_45%_22%/0.1)] pointer-events-none" />
              </div>
              <a
                href="https://www.google.com/maps/place/Ke+%C5%A0tvanici+656%2F3,+186+00+Karl%C3%ADn/@50.0931631,14.4352051,17.2z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                <span>Otevřít v Google Maps</span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>

            <p className="text-xs text-muted-foreground text-center">IČO: 08711631</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
