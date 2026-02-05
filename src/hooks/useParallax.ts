import { useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, RefObject } from "react";

interface ParallaxConfig {
  offset?: [string, string];
  speed?: number;
}

export const useParallax = (config: ParallaxConfig = {}): {
  ref: RefObject<HTMLDivElement>;
  y: MotionValue<string>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
} => {
  const { offset = ["start end", "end start"], speed = 0.5 } = config;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [`-${speed * 100}px`, `${speed * 100}px`]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return { ref, y, opacity, scale };
};

export const useHeroParallax = (): {
  scrollY: MotionValue<number>;
  backgroundY: MotionValue<string>;
  contentY: MotionValue<string>;
  opacity: MotionValue<number>;
} => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], ["0%", "30%"]);
  const contentY = useTransform(scrollY, [0, 500], ["0%", "20%"]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return { scrollY, backgroundY, contentY, opacity };
};
