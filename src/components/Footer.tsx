import { Instagram, Linkedin, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import TKLogo from "./TKLogo";

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/tereza__kubeckova/", label: "Instagram" },
  { icon: Linkedin, href: "https://cz.linkedin.com/in/tereza-kube%C4%8Dkov%C3%A1-973107327", label: "LinkedIn" },
  { icon: Facebook, href: "https://www.facebook.com/teresa.kubeckova", label: "Facebook" },
  { icon: Twitter, href: "https://x.com/terezakubeckova", label: "X (Twitter)" },
];

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container-narrow mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="flex items-center gap-3">
          <TKLogo className="w-10 h-10 text-gold" />
          <div>
            <h3 className="font-heading text-xl font-semibold mb-1">
              Tereza <span className="text-gold">Kubečková</span>
            </h3>
            <p className="text-sm text-primary-foreground/70">
              Nezávislá finanční a majetková poradkyně
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/10 hover:border-gold transition-all"
              aria-label={s.label}
            >
              <s.icon size={18} />
            </a>
          ))}
        </div>

        <div className="text-sm text-primary-foreground/60 md:text-right space-y-1">
          <p>© {new Date().getFullYear()} Ing. Tereza Kubečková</p>
          <div className="flex gap-3 md:justify-end flex-wrap">
            <Link to="/gdpr" className="hover:text-primary-foreground transition-colors">GDPR</Link>
            <span>·</span>
            <Link to="/cookies" className="hover:text-primary-foreground transition-colors">Cookies</Link>
            <span>·</span>
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                window.dispatchEvent(new Event("cookie-consent-change"));
              }}
              className="hover:text-primary-foreground transition-colors"
            >
              Nastavení cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
