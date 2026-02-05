import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, UtensilsCrossed, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type OrderType = "delivery" | "dine_in";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    tableNumber: "",
    specialInstructions: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_type: orderType,
          customer_name: formData.name,
          phone: formData.phone,
          email: formData.email || null,
          address: orderType === "delivery" ? formData.address : null,
          table_number: orderType === "dine_in" ? parseInt(formData.tableNumber) : null,
          special_instructions: formData.specialInstructions || null,
          total: totalPrice,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Submit to Formspree for email notification
      const formspreeData = {
        order_type: orderType,
        customer_name: formData.name,
        phone: formData.phone,
        email: formData.email || "Not provided",
        address: orderType === "delivery" ? formData.address : "N/A",
        table_number: orderType === "dine_in" ? formData.tableNumber : "N/A",
        special_instructions: formData.specialInstructions || "None",
        total: `₹${totalPrice}`,
        items: items.map(item => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`).join("\n"),
      };

      await fetch("https://formspree.io/f/myzwaopp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formspreeData),
      });

      setOrderSuccess(true);
      clearCart();
      
      toast({ title: "Order placed successfully!" });
    } catch (error) {
      console.error("Order error:", error);
      toast({ title: "Failed to place order", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-display text-3xl text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            {orderType === "delivery"
              ? "Your order is being prepared and will be delivered soon."
              : `Your order is being prepared and will be served at Table ${formData.tableNumber}.`}
          </p>
          <div className="space-y-3">
            <Button variant="hero" className="w-full" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/order")}>
              Order More
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate("/order");
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="font-display text-2xl text-foreground">Checkout</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Order Type Selection */}
        <div className="mb-8">
          <h2 className="font-display text-lg text-foreground mb-4">
            How would you like to order?
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setOrderType("delivery")}
              className={`p-6 rounded-xl border-2 transition-all ${
                orderType === "delivery"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground"
              }`}
            >
              <Truck
                className={`w-8 h-8 mx-auto mb-2 ${
                  orderType === "delivery" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <p className={`font-medium ${
                orderType === "delivery" ? "text-primary" : "text-foreground"
              }`}>
                Delivery
              </p>
            </button>
            <button
              onClick={() => setOrderType("dine_in")}
              className={`p-6 rounded-xl border-2 transition-all ${
                orderType === "dine_in"
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground"
              }`}
            >
              <UtensilsCrossed
                className={`w-8 h-8 mx-auto mb-2 ${
                  orderType === "dine_in" ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <p className={`font-medium ${
                orderType === "dine_in" ? "text-primary" : "text-foreground"
              }`}>
                Dine In
              </p>
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card rounded-xl p-4 mb-6 shadow-soft">
          <h3 className="font-medium text-foreground mb-3">Order Summary</h3>
          <div className="space-y-2 text-sm max-h-40 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-foreground">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-3 pt-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-primary">₹{totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-card rounded-xl p-6 shadow-soft space-y-4">
            <h3 className="font-display text-lg text-foreground">
              {orderType === "delivery" ? "Delivery Details" : "Dine-In Details"}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email (optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
              />
            </div>

            {orderType === "delivery" ? (
              <div className="space-y-2">
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your full delivery address"
                  required
                  rows={3}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number *</Label>
                <Input
                  id="tableNumber"
                  name="tableNumber"
                  type="number"
                  min="1"
                  value={formData.tableNumber}
                  onChange={handleInputChange}
                  placeholder="Enter table number"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="specialInstructions">Special Instructions (optional)</Label>
              <Textarea
                id="specialInstructions"
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any special requests or dietary requirements"
                rows={2}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : `Place Order • ₹${totalPrice}`}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
