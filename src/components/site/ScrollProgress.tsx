import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: width }}
      className="bg-gradient-brand fixed inset-x-0 top-0 z-[70] h-[2px] origin-left"
    />
  );
}
