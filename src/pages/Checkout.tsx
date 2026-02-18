import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Truck, UtensilsCrossed, CheckCircle, MessageCircle, Package, Tag, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type OrderType = "delivery" | "dine_in";

// Configure your WhatsApp number here (include country code without + sign)
const WHATSAPP_NUMBER = "918431356962";

// Formspree endpoint
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mgolwldp";

// Per-item parcel charges by category
const PARCEL_RATES: Record<string, number> = {
  pizza: 10,
  burger: 5,
};
const DEFAULT_PARCEL_RATE = 10;

// Available coupons
const COUPONS = [
  { code: "SAVE10", minOrder: 200, discount: 10, label: "10% off on orders above ₹200" },
  { code: "SAVE20", minOrder: 500, discount: 20, label: "20% off on orders above ₹500" },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [needsParcel, setNeedsParcel] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[0] | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    tableNumber: "",
    specialInstructions: "",
  });

  // Calculate per-item parcel charges
  const calculateParcelCharges = () => {
    return items.reduce((total, item) => {
      const rate = PARCEL_RATES[item.category.toLowerCase()] ?? DEFAULT_PARCEL_RATE;
      return total + rate * item.quantity;
    }, 0);
  };

  // Parcel charge applies automatically for delivery, optionally for dine-in
  const parcelApplies = orderType === "delivery" || (orderType === "dine_in" && needsParcel);
  const parcelAmount = parcelApplies ? calculateParcelCharges() : 0;
  const subtotalWithParcel = totalPrice + parcelAmount;
  const couponEligible = orderType === "dine_in";
  const discountAmount = (couponEligible && appliedCoupon) ? Math.round(subtotalWithParcel * appliedCoupon.discount / 100) : 0;
  const grandTotal = subtotalWithParcel - discountAmount;

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    const coupon = COUPONS.find((c) => c.code === code);
    if (!coupon) {
      toast({ title: "Invalid coupon code", variant: "destructive" });
      return;
    }
    if (totalPrice < coupon.minOrder) {
      toast({ title: `Minimum order of ₹${coupon.minOrder} required for this coupon`, variant: "destructive" });
      return;
    }
    setAppliedCoupon(coupon);
    toast({ title: `Coupon ${coupon.code} applied! ${coupon.discount}% off` });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateWhatsAppMessage = () => {
    const itemsList = items
      .map((item) => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`)
      .join("\n");

    const parcelInfo = parcelApplies ? `\n*Parcel Charges:* ₹${parcelAmount}` : "";
    const discountInfo = appliedCoupon ? `\n*Discount (${appliedCoupon.code} - ${appliedCoupon.discount}%):* -₹${discountAmount}` : "";

    const orderDetails = `
🍕 *NEW ORDER*
━━━━━━━━━━━━━━━

*Order Type:* ${orderType === "delivery" ? "🚚 Delivery" : "🍽️ Dine-In"}${orderType === "dine_in" && needsParcel ? " (Parcel)" : ""}

*Customer Details:*
• Name: ${formData.name}
• Phone: ${formData.phone}
${formData.email ? `• Email: ${formData.email}` : ""}
${orderType === "delivery" ? `• Address: ${formData.address}` : `• Table No: ${formData.tableNumber}`}

*Order Items:*
${itemsList}

━━━━━━━━━━━━━━━
*Subtotal: ₹${totalPrice}*${parcelInfo}${discountInfo}
*Total: ₹${grandTotal}*
━━━━━━━━━━━━━━━

${formData.specialInstructions ? `*Special Instructions:* ${formData.specialInstructions}` : ""}
    `.trim();

    return orderDetails;
  };

  const openWhatsApp = () => {
    const message = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (items.length === 0) {
      toast({ title: "Cart is empty", variant: "destructive" });
      return;
    }

    // Validate required fields
    if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
      toast({ title: "Please fill in required fields", variant: "destructive" });
      return;
    }

    if (orderType === "delivery" && !formData.address.trim()) {
      toast({ title: "Please enter delivery address", variant: "destructive" });
      return;
    }

    if (orderType === "dine_in" && !formData.tableNumber.trim()) {
      toast({ title: "Please enter table number", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_type: orderType,
          customer_name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || null,
          address: orderType === "delivery" ? formData.address.trim() : null,
          table_number: orderType === "dine_in" ? parseInt(formData.tableNumber) : null,
          special_instructions: formData.specialInstructions.trim() || null,
          total: grandTotal,
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

      // Send to Formspree
      await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Order",
          orderType: orderType === "delivery" ? "Delivery" : `Dine-In${needsParcel ? " (Parcel)" : ""}`,
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim() || "Not provided",
          address: orderType === "delivery" ? formData.address.trim() : "N/A",
          tableNumber: orderType === "dine_in" ? formData.tableNumber : "N/A",
          items: items.map((item) => `${item.quantity}x ${item.name} - ₹${item.price * item.quantity}`).join(", "),
          parcelCharges: parcelApplies ? `₹${parcelAmount}` : "None",
          coupon: appliedCoupon ? `${appliedCoupon.code} (${appliedCoupon.discount}% = -₹${discountAmount})` : "None",
          total: `₹${grandTotal}`,
          specialInstructions: formData.specialInstructions.trim() || "None",
        }),
      });

      // Open WhatsApp with order details
      openWhatsApp();

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
          <p className="text-sm text-muted-foreground mb-6">
            A WhatsApp message has been opened with your order details. Please send it to confirm your order with the restaurant.
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
        <div className="mb-8 bg-card rounded-xl p-6 shadow-soft border border-border">
          <h2 className="font-display text-lg text-foreground mb-4">
            How would you like to order?
          </h2>
          <div className="grid grid-cols-2 gap-4">
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
            <button
              onClick={() => { setOrderType("delivery"); setNeedsParcel(false); setAppliedCoupon(null); setCouponCode(""); }}
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
          </div>
        </div>

        {/* Parcel Toggle for Dine-In */}
        {orderType === "dine_in" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className="bg-card rounded-xl p-4 shadow-soft border border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground text-sm">Need Parcel?</p>
                  <p className="text-xs text-muted-foreground">Per-item parcel charges will apply</p>
                </div>
              </div>
              <Switch
                checked={needsParcel}
                onCheckedChange={setNeedsParcel}
              />
            </div>
          </motion.div>
        )}

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
          <div className="border-t border-border mt-3 pt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{totalPrice}</span>
            </div>
            {parcelApplies && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Parcel Charges
                </span>
                <span className="text-foreground">₹{parcelAmount}</span>
              </div>
            )}
            {appliedCoupon && (
              <div className="flex justify-between text-sm text-green-600">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  Discount ({appliedCoupon.discount}%)
                </span>
                <span>-₹{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t border-border pt-2">
              <span>Total</span>
              <span className="text-primary">₹{grandTotal}</span>
            </div>
          </div>

          {/* Coupon Section - Dine In only */}
          {orderType === "dine_in" && (
            <div className="border-t border-border mt-3 pt-3">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{appliedCoupon.code} applied</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="text-sm"
                      maxLength={20}
                    />
                    <Button type="button" variant="outline" size="sm" onClick={handleApplyCoupon} className="shrink-0">
                      Apply
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {COUPONS.map((c) => (
                      <p key={c.code} className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{c.code}</span> — {c.label}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Parcel info for delivery */}
        {orderType === "delivery" && (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-3 mb-4 flex items-center gap-3">
            <Package className="w-5 h-5 text-accent flex-shrink-0" />
            <p className="text-xs text-foreground">
              Per-item parcel charges are applied for delivery orders (Pizza ₹10, Burger ₹5, Others ₹10).
            </p>
          </div>
        )}

        {/* WhatsApp Notice */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            Your order will be sent for quick confirmation.
          </p>
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
                  maxLength={100}
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
                  maxLength={15}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                maxLength={255}
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
                  maxLength={500}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number *</Label>
                <Select
                  value={formData.tableNumber}
                  onValueChange={(value) => setFormData({ ...formData, tableNumber: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        Table {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                maxLength={500}
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
            <MessageCircle className="w-5 h-5 mr-2" />
            {isSubmitting ? "Processing..." : `Order • ₹${grandTotal}`}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
