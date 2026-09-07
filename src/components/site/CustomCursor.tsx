import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

type Mode = "default" | "button" | "view" | "card";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.25 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.25 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest?.("[data-cursor]");
      const next = el?.getAttribute("data-cursor") as Mode | null;
      setMode(next ?? "default");
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 76 : mode === "button" ? 44 : mode === "card" ? 34 : 10;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
    >
      <motion.div
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="glass-soft -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            mode === "default"
              ? "var(--gradient-brand)"
              : "oklch(1 0 0 / 0.18)",
          boxShadow: mode === "card" ? "0 0 26px oklch(0.85 0.055 12 / 0.7)" : undefined,
        }}
      >
        {mode === "view" && (
          <span className="flex h-full w-full items-center justify-center text-[0.6rem] tracking-[0.24em] text-foreground uppercase">
            View
          </span>
        )}
      </motion.div>
    </motion.div>
  );
}
