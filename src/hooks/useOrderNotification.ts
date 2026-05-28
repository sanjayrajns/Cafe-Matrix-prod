import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const playNotificationSound = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

    // Emergency alarm: loud, rapid alternating siren at MAXIMUM volume
    const playSirenCycle = (startTime: number) => {
      const highFreq = 1800;
      const lowFreq = 800;
      const cycleDuration = 0.12;

      for (let i = 0; i < 12; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        // Alternate between high and low frequencies for siren effect
        osc.frequency.value = i % 2 === 0 ? highFreq : lowFreq;
        osc.type = "square"; // Harsh, attention-grabbing waveform

        const tStart = startTime + i * cycleDuration;
        // Maximum volume
        gain.gain.setValueAtTime(1.0, tStart);
        gain.gain.setValueAtTime(1.0, tStart + cycleDuration * 0.8);
        gain.gain.exponentialRampToValueAtTime(0.3, tStart + cycleDuration);

        osc.start(tStart);
        osc.stop(tStart + cycleDuration);
      }
    };

    const now = audioCtx.currentTime;

    // Play 3 bursts of siren for urgency
    playSirenCycle(now);
    playSirenCycle(now + 1.6);
    playSirenCycle(now + 3.2);

    // Close audio context after alarm finishes
    setTimeout(() => audioCtx.close(), 5500);
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
              title: "🚨 New Order!",
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
