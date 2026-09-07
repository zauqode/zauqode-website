import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [stuck, setStuck] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setStuck(v > 40));

  return (
    <div className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-4 sm:pt-6">
      <motion.nav
        animate={{
          width: stuck ? "min(100%, 46rem)" : "min(100%, 72rem)",
          paddingTop: stuck ? 8 : 14,
          paddingBottom: stuck ? 8 : 14,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex items-center justify-between gap-6 rounded-full px-5 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-700 sm:px-7",
          stuck
            ? "glass-panel"
            : "border border-transparent bg-transparent shadow-none backdrop-blur-none",
        )}
      >
        <a
          href="#top"
          data-cursor="button"
          className="font-display text-lg leading-none tracking-tight sm:text-xl"
        >
          Aafrin<span className="text-primary">.</span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-cursor="button"
              className="text-muted-foreground hover:text-foreground text-[0.8rem] tracking-[0.14em] uppercase transition-colors duration-300"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          data-cursor="button"
          className="glass-soft text-foreground hover:shadow-[0_10px_30px_-12px_oklch(0.63_0.1_12_/_0.5)] rounded-full px-4 py-2 text-[0.75rem] tracking-[0.16em] uppercase transition-all duration-300 hover:scale-[1.03]"
        >
          Let's talk
        </a>
      </motion.nav>
    </div>
  );
}
