import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { orderCategories, getItemsByCategory, MenuItem } from "@/data/orderMenuData";

const SizeSelector = ({
  item,
  onAdd,
}: {
  item: MenuItem;
  onAdd: (sizeLabel: string, price: number) => void;
}) => {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {item.sizes!.map((size) => (
        <button
          key={size.label}
          onClick={() => onAdd(size.label, size.price)}
          className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:border-primary hover:bg-primary/5 transition-colors text-xs"
        >
          <span className="text-muted-foreground">{size.label}</span>
          <span className="font-mono font-bold text-foreground">₹{size.price}</span>
        </button>
      ))}
    </div>
  );
};

const OrderCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { items: cartItems, addItem, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const categoryItems = getItemsByCategory(categoryId || "");
  const currentCategory = orderCategories.find((c) => c.id === categoryId);

  const getItemQuantity = (itemId: string) => {
    // For items with sizes, aggregate all size variants
    const matching = cartItems.filter((i) => i.id.startsWith(itemId + "-size-") || i.id === itemId);
    return matching.reduce((sum, i) => sum + i.quantity, 0);
  };

  const getCartItemsForBase = (itemId: string) => {
    return cartItems.filter((i) => i.id.startsWith(itemId + "-size-") || i.id === itemId);
  };

  if (!currentCategory) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Category not found</h1>
          <Button variant="hero" onClick={() => navigate("/order")}>
            Back to Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/order">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="font-display text-2xl text-foreground">
                {currentCategory.label}
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
        {/* Category Header */}
        <div className="relative rounded-2xl overflow-hidden mb-6 h-48">
          <img
            src={currentCategory.image}
            alt={currentCategory.label}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="font-display text-3xl text-foreground">
              {currentCategory.label}
            </h2>
            <p className="text-muted-foreground">{categoryItems.length} items</p>
          </div>
        </div>

        {/* Menu Items Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={categoryId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {categoryItems.map((item) => {
              const hasSizes = item.sizes && item.sizes.length > 0;
              const totalQty = getItemQuantity(item.id);
              const sizeCartItems = getCartItemsForBase(item.id);

              return (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-medium text-foreground">
                        {item.name}
                      </h3>
                      {hasSizes ? (
                        <p className="text-primary font-semibold whitespace-nowrap text-xs">
                          From ₹{item.sizes![0].price}
                        </p>
                      ) : (
                        <p className="text-primary font-semibold whitespace-nowrap">₹{item.price}</p>
                      )}
                    </div>

                    {/* Size cart items display */}
                    {hasSizes && sizeCartItems.length > 0 && (
                      <div className="mb-2 space-y-1">
                        {sizeCartItems.map((ci) => (
                          <div key={ci.id} className="flex items-center justify-between text-xs bg-primary/5 rounded-lg px-2 py-1">
                            <span className="text-muted-foreground">{ci.name}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQuantity(ci.id, ci.quantity - 1)}
                                className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30"
                              >
                                <Minus className="w-3 h-3 text-primary" />
                              </button>
                              <span className="w-4 text-center font-medium text-foreground">{ci.quantity}</span>
                              <button
                                onClick={() => updateQuantity(ci.id, ci.quantity + 1)}
                                className="w-5 h-5 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90"
                              >
                                <Plus className="w-3 h-3 text-primary-foreground" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-end">
                      {hasSizes ? (
                        <div>
                          {expandedItem === item.id ? (
                            <SizeSelector
                              item={item}
                              onAdd={(sizeLabel, price) => {
                                addItem({
                                  id: `${item.id}-size-${sizeLabel.toLowerCase()}`,
                                  name: `${item.name} (${sizeLabel})`,
                                  category: item.category,
                                  price,
                                  image: item.image,
                                });
                                setExpandedItem(null);
                              }}
                            />
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setExpandedItem(item.id)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              {totalQty > 0 ? `Add More (${totalQty})` : "Add"}
                            </Button>
                          )}
                        </div>
                      ) : (
                        <>
                          {totalQty > 0 ? (
                            <div className="flex items-center gap-2 bg-primary/10 rounded-full px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.id, totalQty - 1)}
                                className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center hover:bg-primary/30 transition-colors"
                              >
                                <Minus className="w-4 h-4 text-primary" />
                              </button>
                              <span className="w-6 text-center font-medium text-foreground">
                                {totalQty}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, totalQty + 1)}
                                className="w-7 h-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors"
                              >
                                <Plus className="w-4 h-4 text-primary-foreground" />
                              </button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addItem({
                                  id: item.id,
                                  name: item.name,
                                  category: item.category,
                                  price: item.price,
                                  image: item.image,
                                })
                              }
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
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

export default OrderCategory;
