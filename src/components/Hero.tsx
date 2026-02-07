import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroParallax } from "@/hooks/useParallax";
import heroBg from "@/assets/hero-bg-new.png";

const Hero = () => {
  const { backgroundY, contentY, opacity } = useHeroParallax();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Image */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <img
          src={heroBg}
          alt="Artisanal vegetarian dishes"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/50 to-foreground/80" />
      </motion.div>

      {/* Parallax Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 text-center"
        style={{ y: contentY, opacity }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block px-4 py-2 mb-8 text-xs uppercase tracking-[0.3em] text-primary-foreground/80 border border-primary-foreground/20 rounded-full backdrop-blur-sm"
          >
            100% Vegetarian • Since 2023
          </motion.span>

          {/* Main Title */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-primary-foreground font-medium leading-[0.95] tracking-tight mb-6">
            Where Every
            <br />
            <span className="italic font-normal">Bite Tells</span>
            <br />
            <span className="text-accent">a Story</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mx-auto mb-10 font-light leading-relaxed"
          >
            Artisanal pizzas, handcrafted beverages & cozy ambience 
            in the heart of Sira
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button variant="accent" size="xl" asChild>
              <a href="/order">Order Now</a>
            </Button>
            <Button variant="glass" size="xl" asChild>
              <a href="/reservations">On Spot</a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity }}
      >
        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-primary-foreground/50 hover:text-primary-foreground transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ArrowDown className="w-4 h-4" />
        </motion.a>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-20 right-10 w-64 h-64 rounded-full border border-primary-foreground/20"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ delay: 0.7, duration: 1 }}
        className="absolute bottom-40 left-10 w-96 h-96 rounded-full border border-primary-foreground/20"
      />
    </section>
  );
};

export default Hero;
