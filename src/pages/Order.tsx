import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { orderCategories } from "@/data/orderMenuData";

const Order = () => {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="font-display text-2xl text-foreground">
                Matrix<span className="text-accent">.</span> Order
              </h1>
            </div>
            <Button
              variant="hero"
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent text-accent-foreground h-6 w-6 p-0 flex items-center justify-center">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className={`container mx-auto px-4 py-8 ${totalItems > 0 ? 'pb-32' : ''}`}>
        {/* Category Grid */}
        <div className="mb-8">
          <h2 className="font-display text-2xl text-foreground mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {orderCategories.map((category) => (
              <motion.div
                key={category.id}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={`/order/${category.id}`}
                  className="block relative rounded-2xl overflow-hidden h-40 transition-all hover:shadow-lg group"
                >
                  <img
                    src={category.image}
                    alt={category.label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="font-medium text-foreground text-sm">{category.label}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Cart Summary */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border"
        >
          <div className="container mx-auto flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm">{totalItems} items</p>
              <p className="text-foreground font-semibold text-lg">₹{totalPrice}</p>
            </div>
            <Button variant="hero" size="lg" onClick={() => navigate("/cart")}>
              View Cart
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Order;
