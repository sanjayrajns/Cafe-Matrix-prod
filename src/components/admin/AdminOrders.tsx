import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Truck, UtensilsCrossed, Check, X, Clock, Trash2, MapPin, ChefHat, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format, isToday, isYesterday } from "date-fns";
import { useOrderNotification } from "@/hooks/useOrderNotification";
import { playToastSound } from "@/hooks/useToastSound";

interface OrderItem {
  id: string;
  item_name: string;
  category: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_type: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  table_number: number | null;
  status: string;
  total: number;
  special_instructions: string | null;
  created_at: string;
  order_items?: OrderItem[];
}

// Get initials from customer name for avatar
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Generate a consistent color from a name string
const getAvatarColor = (name: string): string => {
  const colors = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-amber-600",
    "from-pink-500 to-rose-600",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-green-600",
    "from-red-500 to-orange-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get the date label for an order
const getDateLabel = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d");
};

// Group orders by date label
const groupOrdersByDate = (orders: Order[]): { label: string; orders: Order[] }[] => {
  const groups: Map<string, Order[]> = new Map();

  for (const order of orders) {
    const label = getDateLabel(order.created_at);
    if (!groups.has(label)) {
      groups.set(label, []);
    }
    groups.get(label)!.push(order);
  }

  return Array.from(groups.entries()).map(([label, orders]) => ({
    label,
    orders,
  }));
};

const AdminOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notificationEnabled, setNotificationEnabled] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return;
    }

    // Fetch order items for each order
    const ordersWithItems = await Promise.all(
      (data || []).map(async (order) => {
        const { data: items } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", order.id);
        return { ...order, order_items: items || [] };
      })
    );

    setOrders(ordersWithItems);
  }, []);

  const { setEnabled } = useOrderNotification(fetchOrders);

  useEffect(() => {
    setEnabled(notificationEnabled);
  }, [notificationEnabled, setEnabled]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update status", variant: "destructive" });
      playToastSound();
      return;
    }

    toast({ title: `Order ${status}` });
    playToastSound();
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    const { error } = await supabase.from("orders").delete().eq("id", id);

    if (error) {
      toast({ title: "Failed to delete order", variant: "destructive" });
      playToastSound();
      return;
    }

    toast({ title: "Order deleted" });
    playToastSound();
    fetchOrders();
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-primary/20 text-primary">Confirmed</Badge>;
      case "preparing":
        return <Badge className="bg-accent/20 text-accent">Preparing</Badge>;
      case "completed":
        return <Badge className="bg-primary/30 text-primary">Completed</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/20 text-destructive">Cancelled</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
    }
  };

  const deliveryOrders = useMemo(() => orders.filter((o) => o.order_type === "delivery"), [orders]);
  const dineInOrders = useMemo(() => orders.filter((o) => o.order_type === "dine_in"), [orders]);

  const groupedDeliveryOrders = useMemo(() => groupOrdersByDate(deliveryOrders), [deliveryOrders]);
  const groupedDineInOrders = useMemo(() => groupOrdersByDate(dineInOrders), [dineInOrders]);

  const renderOrderCard = (order: Order) => {
    const isPending = order.status === "pending";
    const isComplete = order.status === "complete";
    const initials = getInitials(order.customer_name);
    const avatarColor = getAvatarColor(order.customer_name);

    return (
      <motion.div
        key={order.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl shadow-soft overflow-hidden border ${
          isPending
            ? "bg-accent/10 border-accent/30 ring-1 ring-accent/20"
            : isComplete
            ? "bg-foreground/90 border-foreground/50 text-background"
            : "bg-card border-border"
        }`}
      >
        <div className="p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            {/* Customer avatar + info */}
            <div className="flex items-start gap-3 flex-1">
              {/* Avatar */}
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center flex-shrink-0 shadow-md`}
              >
                <span className="text-white font-bold text-sm leading-none">
                  {initials}
                </span>
              </div>

              {/* Order details */}
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-medium text-foreground text-lg">
                    {order.customer_name}
                  </h3>
                  {getStatusBadge(order.status)}
                  {order.order_type === "dine_in" && order.table_number && (
                    <Badge variant="outline">Table {order.table_number}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {format(new Date(order.created_at), "MMM d, h:mm a")}
                  </span>
                  <span className="font-semibold text-primary">₹{order.total}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {order.phone}
                  {order.email && ` • ${order.email}`}
                </div>
                {order.order_type === "delivery" && order.address && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {order.address}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {order.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-primary"
                  onClick={() => updateOrderStatus(order.id, "confirmed")}
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              {order.status === "confirmed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-foreground"
                  onClick={() => updateOrderStatus(order.id, "preparing")}
                >
                  <ChefHat className="w-4 h-4 text-foreground" />
                </Button>
              )}
              {order.status === "preparing" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-primary"
                  onClick={() => updateOrderStatus(order.id, "completed")}
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              {order.status !== "cancelled" && order.status !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive"
                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the order for <strong>{order.customer_name}</strong>? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => deleteOrder(order.id)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

        </div>

        {/* Order Items - Always visible */}
        {order.order_items && order.order_items.length > 0 && (
          <div className="border-t border-border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Order Items:</p>
            <div className="space-y-2">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-foreground">
                    {item.quantity}x {item.item_name}
                  </span>
                  <span className="text-muted-foreground">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            {order.special_instructions && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Notes:</span> {order.special_instructions}
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  const renderDateGroup = (group: { label: string; orders: Order[] }) => (
    <div key={group.label} className="space-y-3">
      {/* Date label header */}
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide uppercase ${
          group.label === "Today"
            ? "bg-primary/15 text-primary border border-primary/20"
            : group.label === "Yesterday"
            ? "bg-accent/15 text-accent border border-accent/20"
            : "bg-muted text-muted-foreground border border-border"
        }`}>
          {group.label}
        </div>
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          {group.orders.length} order{group.orders.length !== 1 ? "s" : ""}
        </span>
      </div>
      {/* Orders under this date */}
      <div className="space-y-4">
        {group.orders.map(renderOrderCard)}
      </div>
    </div>
  );

  const renderEmptyState = (type: string) => (
    <div className="bg-card rounded-xl p-8 text-center">
      {type === "delivery" ? (
        <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      ) : (
        <UtensilsCrossed className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
      )}
      <p className="text-muted-foreground">
        No {type === "delivery" ? "delivery" : "dine-in"} orders yet
      </p>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-display text-2xl text-foreground">Orders</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={notificationEnabled ? "outline" : "ghost"}
            size="sm"
            onClick={() => setNotificationEnabled(!notificationEnabled)}
            title={notificationEnabled ? "Mute notifications" : "Unmute notifications"}
          >
            {notificationEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dine_in" className="space-y-4">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          {/* Dine-In tab FIRST (left side) */}
          <TabsTrigger value="dine_in" className="flex items-center gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            Dine-In
            {dineInOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {dineInOrders.length}
              </Badge>
            )}
          </TabsTrigger>
          {/* Delivery tab SECOND (right side) */}
          <TabsTrigger value="delivery" className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery
            {deliveryOrders.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                {deliveryOrders.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Dine-In content FIRST */}
        <TabsContent value="dine_in" className="space-y-6">
          {dineInOrders.length === 0
            ? renderEmptyState("dine_in")
            : groupedDineInOrders.map(renderDateGroup)}
        </TabsContent>

        {/* Delivery content SECOND */}
        <TabsContent value="delivery" className="space-y-6">
          {deliveryOrders.length === 0
            ? renderEmptyState("delivery")
            : groupedDeliveryOrders.map(renderDateGroup)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrders;
