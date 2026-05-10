import { motion } from "framer-motion";
import { Pizza, Milk, GlassWater, Cake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const offers = [
  {
    title: "Buy 1 Medium Pizza",
    reward: "Get 1 Mini Pizza FREE",
    icon: <Pizza className="w-6 h-6 text-slate-800" />,
  },
  {
    title: "Buy 1 Large Pizza",
    reward: "Get 1 Regular Pizza FREE",
    icon: <Pizza className="w-6 h-6 text-slate-800" />,
  },
  {
    title: "Buy 2 Milkshakes",
    reward: "Get 1 FREE",
    icon: <Milk className="w-6 h-6 text-slate-800" />,
  },
  {
    title: "Buy 2 Mojitos",
    reward: "Get 1 FREE",
    icon: <GlassWater className="w-6 h-6 text-slate-800" />,
  },
  {
    title: "Buy 2 Pastry Cakes",
    reward: "Get 1 FREE",
    icon: <Cake className="w-6 h-6 text-slate-800" />,
  },
];

const SummerSpecialSection = () => {
  return (
    <section className="relative py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 mb-4 block"
          >
            Limited Time Offers
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-5xl font-medium text-slate-900 mb-6"
          >
            Summer Specials
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-600 font-light max-w-2xl mx-auto"
          >
            Enhance your dining experience with our exclusive seasonal rewards. Valid until May 21st, 2026.
          </motion.p>
        </div>

        <div className="border-t border-slate-200">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col sm:flex-row items-start sm:items-center justify-between py-8 border-b border-slate-200 hover:bg-slate-50 transition-colors px-4 -mx-4 rounded-lg"
            >
              <div className="flex items-center gap-6 mb-4 sm:mb-0">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {offer.icon}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-slate-900 mb-1">
                    {offer.title}
                  </h3>
                  <p className="text-slate-500 font-light">
                    {offer.reward}
                  </p>
                </div>
              </div>
              
              <Link to="/order" className="w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  className="w-full sm:w-auto text-slate-900 hover:text-black hover:bg-slate-200/50 group-hover:translate-x-2 transition-all"
                >
                  Claim Offer <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Link to="/order">
            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 rounded-none px-12 py-6 text-sm tracking-[0.1em] uppercase">
              Explore Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default SummerSpecialSection;
