import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Coffee, Leaf, Heart, Users } from "lucide-react";
import aboutInteriorImg from "@/assets/about-interior.png";

const highlights = [
  { icon: Coffee, label: "Great Coffee & Food", description: "Specialty brews daily" },
  { icon: Leaf, label: "100% Vegetarian", description: "Plant-based goodness" },
  { icon: Heart, label: "Made with Love", description: "Fresh ingredients" },
  { icon: Users, label: "Family Friendly", description: "Space for everyone" },
];

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={aboutInteriorImg}
                alt="Matrix Cafe Interior"
                className="w-full h-full object-cover"
              />
              {/* Overlay accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            {/* Floating Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute -bottom-8 -right-8 bg-accent text-accent-foreground p-8 shadow-dramatic"
            >
              <p className="font-display text-4xl font-semibold">3+</p>
              <p className="text-sm uppercase tracking-wider">Years of Joy</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium">
              Our Story
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4 mb-6 leading-tight">
              A Haven for
              <br />
              <span className="italic">Food Lovers</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Nestled in the heart of Sira, Matrix is more than a café—it's a sanctuary 
              where fresh, vegetarian cuisine meets warm hospitality. From our signature 
              cheese corn pizza to refreshing mojitos, every dish is crafted with passion 
              and the finest ingredients.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-6">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 bg-secondary rounded-lg">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.label}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
