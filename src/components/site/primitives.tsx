import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type TargetAndTransition,
} from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealVariant = "rise" | "mask" | "left" | "right" | "scale" | "blur";

const variants: Record<RevealVariant, { from: TargetAndTransition; to: TargetAndTransition }> = {

  rise: { from: { opacity: 0, y: 44 }, to: { opacity: 1, y: 0 } },
  blur: { from: { opacity: 0, y: 26, filter: "blur(14px)" }, to: { opacity: 1, y: 0, filter: "blur(0px)" } },
  mask: {
    from: { opacity: 1, clipPath: "inset(0 0 100% 0 round 1.5rem)" },
    to: { opacity: 1, clipPath: "inset(0 0 0% 0 round 1.5rem)" },
  },
  left: { from: { opacity: 0, x: -56 }, to: { opacity: 1, x: 0 } },
  right: { from: { opacity: 0, x: 56 }, to: { opacity: 1, x: 0 } },
  scale: { from: { opacity: 0, scale: 0.95 }, to: { opacity: 1, scale: 1 } },
};

export function Reveal({
  children,
  variant = "rise",
  delay = 0,
  duration = 0.9,
  className,
  as = "div",
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  as?: "div" | "span" | "li" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px -12% 0px" });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  const Tag = as === "div" ? motion.div : as === "span" ? motion.span : as === "li" ? motion.li : motion.section;

  return (
    <Tag
      ref={ref as never}
      className={className}
      initial={variants[variant].from}
      animate={inView ? variants[variant].to : variants[variant].from}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}


/** 3D tilt-on-hover glass surface with a travelling light reflection. */
export function TiltCard({
  children,
  className,
  max = 6,
  lift = 10,
  cursor,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  lift?: number;
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const spring = { stiffness: 170, damping: 18, mass: 0.4 };
  const rx = useSpring(useMotionValue(0), spring);
  const ry = useSpring(useMotionValue(0), spring);
  const gx = useSpring(useMotionValue(50), spring);
  const gy = useSpring(useMotionValue(50), spring);
  const z = useSpring(useMotionValue(0), spring);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
    z.set(lift);
  };

  const reset = () => {
    rx.set(0);
    ry.set(0);
    gx.set(50);
    gy.set(50);
    z.set(0);
  };

  const glare = useTransform(
    [gx, gy],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, oklch(1 0 0 / 0.5), oklch(1 0 0 / 0) 55%)`,
  );

  return (
    <div className="[perspective:1200px]" data-cursor={cursor}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={{ rotateX: rx, rotateY: ry, y: useTransform(z, (v) => -v), transformStyle: "preserve-3d" }}
        className={cn("group relative", className)}
      >
        {children}
        <motion.span
          aria-hidden
          style={{ backgroundImage: glare }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </motion.div>
    </div>
  );
}

/** Button/link that leans toward the cursor when it comes close. */
export function Magnetic({
  children,
  className,
  strength = 0.28,
  radius = 120,
  href,
  cursor = "button",
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
  href?: string;
  cursor?: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const spring = { stiffness: 260, damping: 20, mass: 0.4 };
  const x = useSpring(useMotionValue(0), spring);
  const y = useSpring(useMotionValue(0), spring);
  const s = useSpring(useMotionValue(1), spring);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const dist = Math.hypot(dx, dy);
    if (dist > radius) return;
    x.set(dx * strength);
    y.set(dy * strength);
    s.set(1.04);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    s.set(1);
  };

  return (
    <motion.a
      ref={ref}
      href={href ?? "#contact"}
      data-cursor={cursor}
      onMouseMove={onMove}
      onMouseLeave={reset}
      {...(reduced ? {} : { whileTap: { scale: 0.97 } })}
      style={{ x, y, scale: s }}
      className={className}
    >
      {children}
    </motion.a>
  );
}
