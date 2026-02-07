import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play two-tone notification
    const playTone = (freq: number, startTime: number, duration: number) => {
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    };

    const now = audioCtx.currentTime;
    playTone(880, now, 0.15);
    playTone(1100, now + 0.18, 0.15);
    playTone(1320, now + 0.36, 0.25);
  } catch (e) {
    console.error("Could not play notification sound:", e);
  }
};

export const useOrderNotification = (onNewOrder: () => void) => {
  const { toast } = useToast();
  const isEnabledRef = useRef(true);

  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          if (isEnabledRef.current) {
            playNotificationSound();
            toast({
              title: "🔔 New Order!",
              description: `New order from ${(payload.new as any).customer_name}`,
            });
          }
          onNewOrder();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNewOrder, toast]);

  return { setEnabled, playNotificationSound };
};
