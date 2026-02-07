import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShoppingBag, IndianRupee, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, startOfWeek, startOfMonth, format } from "date-fns";

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  completedOrders: number;
}

type Period = "today" | "week" | "month" | "all";

const AdminAnalytics = () => {
  const [period, setPeriod] = useState<Period>("today");
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    avgOrderValue: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("orders").select("*");

      const now = new Date();
      if (period === "today") {
        query = query.gte("created_at", startOfDay(now).toISOString());
      } else if (period === "week") {
        query = query.gte("created_at", startOfWeek(now, { weekStartsOn: 1 }).toISOString());
      } else if (period === "month") {
        query = query.gte("created_at", startOfMonth(now).toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      const orders = data || [];
      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const completedOrders = orders.filter((o) => o.status === "completed").length;

      setStats({
        totalOrders: orders.length,
        totalRevenue,
        avgOrderValue: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
        completedOrders,
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  const periods: { value: Period; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "all", label: "All Time" },
  ];

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      format: (v: number) => v.toString(),
    },
    {
      label: "Revenue",
      value: stats.totalRevenue,
      icon: IndianRupee,
      format: (v: number) => `₹${v.toLocaleString()}`,
    },
    {
      label: "Avg Order Value",
      value: stats.avgOrderValue,
      icon: TrendingUp,
      format: (v: number) => `₹${v}`,
    },
    {
      label: "Completed",
      value: stats.completedOrders,
      icon: Calendar,
      format: (v: number) => v.toString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="font-display text-2xl text-foreground">Analytics</h2>
        <div className="flex gap-2 flex-wrap">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                period === p.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-xl p-6 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary rounded-lg">
                <card.icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="font-mono text-2xl font-bold text-foreground">
              {isLoading ? "..." : card.format(card.value)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnalytics;
