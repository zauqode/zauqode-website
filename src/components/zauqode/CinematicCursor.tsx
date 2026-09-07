import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

export function CinematicCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lag physics spring
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  useEffect(() => {
    // Enable only for fine desktop pointer & when reduced motion is not requested
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reducedMotion) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [data-cursor], .glass-card");
      setHovered(Boolean(interactive));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{
        x: springX,
        y: springY,
      }}
      className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
    >
      {/* Inner Dot */}
      <motion.div
        animate={{
          scale: hovered ? 0.4 : 1,
          opacity: hovered ? 0.6 : 1,
        }}
        transition={{ duration: 0.2 }}
        className="w-2.5 h-2.5 rounded-full bg-[#0F6B6B] shadow-[0_0_10px_rgba(15,107,107,0.5)]"
      />

      {/* Expanding Soft Glass Ring */}
      <motion.div
        animate={{
          scale: hovered ? 1 : 0,
          opacity: hovered ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#D9B36C]/60 bg-[#BFE5D5]/20 backdrop-blur-md shadow-lg"
      />
    </motion.div>
  );
}
