import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  UtensilsCrossed, 
  ShoppingBag, 
  Truck, 
  Car, 
  Package,
  Smartphone
} from "lucide-react";

const services = [
  { icon: UtensilsCrossed, label: "Dine-in", description: "Enjoy our cozy ambience" },
  { icon: ShoppingBag, label: "Takeaway", description: "Fresh food on the go" },
  { icon: Truck, label: "Delivery", description: "Right to your doorstep" },
  { icon: Smartphone, label: "No-Contact", description: "Safe & contactless" },
  { icon: Car, label: "Drive-through", description: "Quick & convenient" },
  { icon: Package, label: "Kerbside", description: "We bring it to you" },
];

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground">
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
            Service Options
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mt-4">
            However You <span className="italic">Like It</span>
          </h2>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {services.map((service, index) => (
            <motion.div
              key={service.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-foreground/10 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <service.icon className="w-7 h-7 text-primary-foreground group-hover:text-accent-foreground" />
              </div>
              <h3 className="font-display text-lg mb-1">{service.label}</h3>
              <p className="text-sm text-primary-foreground/60">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
