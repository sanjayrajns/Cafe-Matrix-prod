import { motion } from "framer-motion";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Menu", href: "#menu" },
  { label: "About", href: "#about" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
];

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/cafe__matrix?igsh=MTZld29ydWoweTN6Ng==", label: "Instagram" },
  { icon: Facebook, href: "https://www.facebook.com/share/18BF1R2CxA/", label: "Facebook" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="font-display text-3xl font-semibold mb-4">
              Café Matrix<span className="text-accent">.</span>
            </h2>
            <p className="text-primary-foreground/60 leading-relaxed max-w-sm">
              Artisanal vegetarian cuisine in a cozy, welcoming atmosphere. 
              Every dish tells a story.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-widest mb-6 text-primary-foreground/40">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-medium text-sm uppercase tracking-widest mb-6 text-primary-foreground/40">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/60 hover:bg-accent hover:border-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/40">
            © 2027 Matrix Cafe. All rights reserved.
          </p>
          <p className="text-sm text-primary-foreground/40">
            Built by{" "}
            <a
              href="https://sajeevnetworksolutions.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 transition-colors underline"
            >
              Sajeev Network Solutions
            </a>{" "}
            with ❤️ in Sira 📍
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
