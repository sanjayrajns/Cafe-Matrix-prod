import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Check, X, Clock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { playToastSound } from "@/hooks/useToastSound";

interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  party_size: number;
  dietary_notes: string | null;
  occasion: string | null;
  seating_preference: string | null;
  special_requests: string | null;
  status: string;
  created_at: string;
}

const AdminReservations = () => {
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true })
      .order("time", { ascending: true });

    if (error) {
      console.error("Error fetching reservations:", error);
      return;
    }

    setReservations(data || []);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const updateReservationStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to update", variant: "destructive" });
      playToastSound();
      return;
    }

    toast({ title: `Reservation ${status}` });
    playToastSound();
    fetchReservations();
  };

  const deleteReservation = async (id: string) => {
    const { error } = await supabase
      .from("reservations")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
      playToastSound();
      return;
    }

    toast({ title: "Reservation deleted" });
    playToastSound();
    fetchReservations();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-primary/20 text-primary">Confirmed</Badge>;
      case "cancelled":
        return <Badge className="bg-destructive/20 text-destructive">Cancelled</Badge>;
      default:
        return <Badge className="bg-accent/20 text-accent">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Reservations</h2>
        <Button variant="outline" size="sm" onClick={fetchReservations}>
          Refresh
        </Button>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-card rounded-xl p-8 text-center">
          <CalendarDays className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No reservations yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reservations.map((res) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-card rounded-xl p-6 shadow-soft"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-foreground text-lg">{res.name}</h3>
                    {getStatusBadge(res.status)}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {format(new Date(res.date), "MMM d, yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {res.time}
                    </span>
                    <span>{res.party_size} guests</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {res.email} • {res.phone}
                  </div>
                  {(res.occasion || res.seating_preference || res.dietary_notes || res.special_requests) && (
                    <div className="pt-2 space-y-1 text-sm">
                      {res.occasion && <p><span className="font-medium">Occasion:</span> {res.occasion}</p>}
                      {res.seating_preference && <p><span className="font-medium">Seating:</span> {res.seating_preference}</p>}
                      {res.dietary_notes && <p><span className="font-medium">Dietary:</span> {res.dietary_notes}</p>}
                      {res.special_requests && <p><span className="font-medium">Requests:</span> {res.special_requests}</p>}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {res.status !== "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-primary"
                      onClick={() => updateReservationStatus(res.id, "confirmed")}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  {res.status !== "cancelled" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive"
                      onClick={() => updateReservationStatus(res.id, "cancelled")}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-muted-foreground"
                    onClick={() => deleteReservation(res.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
