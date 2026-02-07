import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { categories, menuItems, categoryImages } from "@/data/menuData";

const Menu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("pizza");

  return (
    <section id="menu" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-accent text-sm uppercase tracking-[0.3em] font-medium">
            Our Menu
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-foreground mt-4">
            Crafted with <span className="italic">Passion</span>
          </h2>
        </motion.div>

        {/* Category Tabs - Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Menu Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Menu Items */}
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="grid gap-3"
          >
            {menuItems[activeCategory]?.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.3 }}
                className={`flex items-center justify-between p-4 bg-card shadow-soft hover:shadow-medium transition-all group ${
                  item.featured ? "border-l-4 border-accent" : "border border-border"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-foreground truncate">{item.name}</h3>
                    {item.featured && (
                      <span className="text-[10px] uppercase tracking-wider bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <span className="font-mono text-lg text-foreground font-bold whitespace-nowrap tracking-tight">
                    ₹{item.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Featured Image */}
          <motion.div
            key={`img-${activeCategory}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative hidden lg:block"
          >
            <div className="sticky top-32 aspect-square overflow-hidden rounded-2xl shadow-dramatic">
              <img
                src={categoryImages[activeCategory]}
                alt={activeCategory}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="font-display text-3xl text-white">
                  {categories.find((c) => c.id === activeCategory)?.label}
                </h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Order Now CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-12"
        >
          <Link to="/order">
            <Button variant="hero" size="xl">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Order Now
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Menu;
