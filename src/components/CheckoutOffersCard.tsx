import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { Gift, Pizza, Milk, GlassWater, Cake, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CheckoutOffersCard = () => {
  const { items, addItem } = useCart();
  const { toast } = useToast();

  const pizzaMediumCount = items.filter(i => i.category === 'pizza' && i.name.includes('(Medium)')).reduce((sum, i) => sum + i.quantity, 0);
  const pizzaLargeCount = items.filter(i => i.category === 'pizza' && i.name.includes('(Large)')).reduce((sum, i) => sum + i.quantity, 0);

  const milkshakeCount = items.filter(i => i.category === 'milkshakes').reduce((sum, i) => sum + i.quantity, 0);
  const mojitoCount = items.filter(i => i.category === 'mojitos').reduce((sum, i) => sum + i.quantity, 0);
  const pastryCount = items.filter(i => i.category === 'pastries').reduce((sum, i) => sum + i.quantity, 0);

  // Check if free items are already in cart
  const hasFreeMiniPizza = items.some(i => i.id === 'free-mini-pizza');
  const hasFreeRegularPizza = items.some(i => i.id === 'free-regular-pizza');
  const hasFreeMilkshake = items.some(i => i.id === 'free-milkshake');
  const hasFreeMojito = items.some(i => i.id === 'free-mojito');
  const hasFreePastry = items.some(i => i.id === 'free-pastry');

  // Auto-apply logic
  useEffect(() => {
    let appliedAny = false;

    if (pizzaMediumCount > 0 && !hasFreeMiniPizza) {
      addItem({ id: 'free-mini-pizza', name: 'FREE Mini Pizza', category: 'pizza', price: 0 });
      toast({ title: "🎉 Offer Auto-Applied!", description: "A FREE Mini Pizza was added to your cart." });
      appliedAny = true;
    }
    if (pizzaLargeCount > 0 && !hasFreeRegularPizza) {
      addItem({ id: 'free-regular-pizza', name: 'FREE Regular Pizza', category: 'pizza', price: 0 });
      if (!appliedAny) toast({ title: "🎉 Offer Auto-Applied!", description: "A FREE Regular Pizza was added to your cart." });
      appliedAny = true;
    }
    if (milkshakeCount >= 2 && !hasFreeMilkshake) {
      addItem({ id: 'free-milkshake', name: 'FREE Milkshake', category: 'milkshakes', price: 0 });
      if (!appliedAny) toast({ title: "🎉 Offer Auto-Applied!", description: "Buy 2 Get 1 FREE: Milkshake added to your cart." });
      appliedAny = true;
    }
    if (mojitoCount >= 2 && !hasFreeMojito) {
      addItem({ id: 'free-mojito', name: 'FREE Mojito', category: 'mojitos', price: 0 });
      if (!appliedAny) toast({ title: "🎉 Offer Auto-Applied!", description: "Buy 2 Get 1 FREE: Mojito added to your cart." });
      appliedAny = true;
    }
    if (pastryCount >= 2 && !hasFreePastry) {
      addItem({ id: 'free-pastry', name: 'FREE Pastry Cake', category: 'pastries', price: 0 });
      if (!appliedAny) toast({ title: "🎉 Offer Auto-Applied!", description: "Buy 2 Get 1 FREE: Pastry Cake added to your cart." });
    }
  }, [
    pizzaMediumCount, hasFreeMiniPizza,
    pizzaLargeCount, hasFreeRegularPizza,
    milkshakeCount, hasFreeMilkshake,
    mojitoCount, hasFreeMojito,
    pastryCount, hasFreePastry,
    addItem, toast
  ]);

  const offers = [];

  // Applied Offers Display
  if (hasFreeMiniPizza) {
    offers.push({
      id: 'mini-pizza',
      type: 'success',
      title: "Offer Applied: FREE Mini Pizza",
      subtitle: "Added with your Medium Pizza.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    });
  }

  if (hasFreeRegularPizza) {
    offers.push({
      id: 'regular-pizza',
      type: 'success',
      title: "Offer Applied: FREE Regular Pizza",
      subtitle: "Added with your Large Pizza.",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    });
  }

  // Upgrade logic
  if (pizzaMediumCount > 0 && pizzaLargeCount === 0) {
    offers.push({
      id: 'upgrade-pizza',
      type: 'info',
      title: "Upgrade to a Large Pizza to get a FREE Regular Pizza.",
      subtitle: "Current offer applied: FREE Mini Pizza.",
      icon: <Info className="w-5 h-5 text-blue-500" />,
    });
  }

  // B2G1 Logic
  const checkB2G1 = (count: number, hasFree: boolean, label: string, icon: any, id: string) => {
    if (hasFree) {
      offers.push({
        id: `free-${id}`,
        type: 'success',
        title: `Offer Applied: 1 FREE ${label}`,
        subtitle: `Buy 2 Get 1 FREE offer applied!`,
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });
    } else if (count === 1) {
      offers.push({
        id: `progress-${id}`,
        type: 'info',
        title: `Add 1 more ${label} to get 1 FREE.`,
        subtitle: "Buy 2 Get 1 FREE special!",
        icon: icon,
      });
    }
  };

  checkB2G1(milkshakeCount, hasFreeMilkshake, "Milkshake", <Milk className="w-5 h-5 text-pink-500" />, "milkshake");
  checkB2G1(mojitoCount, hasFreeMojito, "Mojito", <GlassWater className="w-5 h-5 text-teal-500" />, "mojito");
  checkB2G1(pastryCount, hasFreePastry, "Pastry Cake", <Cake className="w-5 h-5 text-amber-600" />, "pastry");

  if (offers.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <h2 className="font-display text-lg text-foreground flex items-center gap-2">
        <Gift className="w-5 h-5 text-primary" />
        Summer Special Offers
      </h2>
      <div className="grid gap-3">
        {offers.map((offer) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-xl border shadow-soft flex items-start gap-3 ${
              offer.type === 'success' 
                ? 'bg-green-500/5 border-green-200' 
                : 'bg-blue-500/5 border-blue-200'
            }`}
          >
            <div className="mt-1">{offer.icon}</div>
            <div className="flex-1">
              <p className={`font-medium text-sm ${offer.type === 'success' ? 'text-green-800' : 'text-blue-800'}`}>
                {offer.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {offer.subtitle}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutOffersCard;
