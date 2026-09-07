import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

export function LiquidCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hoverState, setHoverState] = useState<"default" | "button" | "project">("default");
  const [projectText, setProjectText] = useState("VIEW PROJECT →");

  const mouseX = useSpring(0, { damping: 28, stiffness: 220 });
  const mouseY = useSpring(0, { damping: 28, stiffness: 220 });

  useEffect(() => {
    // Only enable on fine pointer desktop devices
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("[data-cursor]");
      if (interactive) {
        const type = interactive.getAttribute("data-cursor");
        if (type === "project") {
          setHoverState("project");
          const customText = interactive.getAttribute("data-cursor-text");
          if (customText) setProjectText(customText);
        } else {
          setHoverState("button");
        }
      } else {
        setHoverState("default");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{
        x: mouseX,
        y: mouseY,
      }}
      className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2 mix-blend-normal"
    >
      {/* Primary Dot */}
      <motion.div
        animate={{
          scale: hoverState === "default" ? 1 : 0,
          opacity: hoverState === "default" ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="h-3 w-3 rounded-full bg-[#0F6B6B] shadow-[0_0_10px_rgba(15,107,107,0.5)]"
      />

      {/* Button Hover Glass Expand Circle */}
      <motion.div
        animate={{
          scale: hoverState === "button" ? 1 : 0,
          opacity: hoverState === "button" ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D9B36C]/60 bg-[#BFE5D5]/20 backdrop-blur-md shadow-lg"
      />

      {/* Project Hover Glass Badge */}
      <motion.div
        animate={{
          scale: hoverState === "project" ? 1 : 0,
          opacity: hoverState === "project" ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-24 w-24 items-center justify-center rounded-full border border-[#D9B36C]/70 bg-[#0F6B6B]/90 p-2 text-center backdrop-blur-xl shadow-2xl"
      >
        <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#FDFBF7] leading-tight">
          {projectText}
        </span>
      </motion.div>
    </motion.div>
  );
}
