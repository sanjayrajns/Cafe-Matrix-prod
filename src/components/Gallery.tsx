import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import pizzaImg from "@/assets/pizza.png";
import mojitoImg from "@/assets/mojito.png";
import potatoImg from "@/assets/potato-spiral.png";
import ambienceImg from "@/assets/ambience.jpg";
import vibeInteriorImg from "@/assets/vibe-interior.png";
import pizzaCornImg from "@/assets/gallery-pizza-corn.png";

const galleryItems = [
  { src: pizzaImg, alt: "Signature Pizza", span: "col-span-2 row-span-2" },
  { src: mojitoImg, alt: "Fresh Mojito", span: "col-span-1 row-span-1" },
  { src: vibeInteriorImg, alt: "Our Vibe", span: "col-span-1 row-span-2" },
  { src: potatoImg, alt: "Spiral Potato", span: "col-span-1 row-span-1" },
  { src: pizzaCornImg, alt: "Cheese Corn Pizza", span: "col-span-1 row-span-1" },
];

const ParallaxImage = ({ src, alt, span, index }: { src: string; alt: string; span: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-30 * (index % 2 === 0 ? 1 : -1), 30 * (index % 2 === 0 ? 1 : -1)]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: 0.1 * index, duration: 0.6 }}
      className={`relative overflow-hidden group ${span}`}
    >
      <motion.div className="w-full h-full" style={{ y, scale }}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-all duration-500 flex items-end">
        <p className="text-primary-foreground p-6 font-display text-xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {alt}
        </p>
      </div>
    </motion.div>
  );
};

const Gallery = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="gallery" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium">
            Gallery
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4">
            Visual <span className="italic">Feast</span>
          </h2>
        </motion.div>

        {/* Masonry Grid with Parallax */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryItems.map((item, index) => (
            <ParallaxImage key={item.alt} {...item} index={index} />
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div className="mt-24 overflow-hidden py-6 bg-primary">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-12 whitespace-nowrap"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-primary-foreground/80 font-display text-2xl md:text-4xl font-medium flex items-center gap-12">
              <span>Pizza</span>
              <span className="text-accent">✦</span>
              <span>Mojito</span>
              <span className="text-accent">✦</span>
              <span>Coffee</span>
              <span className="text-accent">✦</span>
              <span>Desserts</span>
              <span className="text-accent">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
