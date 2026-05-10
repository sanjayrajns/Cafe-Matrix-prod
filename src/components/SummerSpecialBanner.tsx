import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, X, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SummerSpecialBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  // Use the specific end date
  const targetDate = new Date("2026-05-21T23:59:59").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          secs: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="relative bg-white border-b border-slate-200 z-[60]"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex flex-col items-start sm:items-center sm:flex-row gap-1 sm:gap-4">
                  <h3 className="font-display text-sm font-semibold text-slate-900 tracking-wider uppercase">
                    Summer Specials – Limited Time Offers
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1.5 font-medium tracking-wide">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {timeLeft.days}D {timeLeft.hours}H {timeLeft.mins}M LEFT
                    </span>
                    <span className="hidden md:inline text-slate-300 mx-1">|</span>
                    <span className="hidden md:inline">VALID UNTIL: 21ST MAY 2026</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full sm:w-auto gap-4">
                <Link
                  to="/order"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1 text-slate-900 hover:text-black hover:underline text-xs font-bold uppercase tracking-wider transition-all"
                >
                  Order Now
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
                  aria-label="Close banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SummerSpecialBanner;
