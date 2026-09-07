import { motion, type MotionValue, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { Magnetic } from "./primitives";
import wedding from "@/assets/work-wedding.jpg";
import baby from "@/assets/work-baby.jpg";
import traditional from "@/assets/work-traditional.jpg";

const previews = [
  { src: wedding, alt: "Blush and gold wedding invitation suite", cls: "left-[2%] top-[8%] w-36 sm:w-44", depth: 34, tilt: "-7deg", delay: 1.05 },
  { src: traditional, alt: "Traditional Indian wedding invitation with gold foil", cls: "right-[3%] top-[16%] w-40 sm:w-52", depth: 56, tilt: "6deg", delay: 1.2 },
  { src: baby, alt: "Lilac baby shower invitation suite", cls: "right-[16%] bottom-[4%] w-32 sm:w-40", depth: 22, tilt: "4deg", delay: 1.35 },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const my = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const blobY = useTransform(scrollYProgress, [0, 1], [0, 160]);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  const b1x = useTransform(mx, (v) => v * 70);
  const b1y = useTransform(my, (v) => v * 70);
  const b2x = useTransform(mx, (v) => v * -110);
  const b2y = useTransform(my, (v) => v * -110);
  const b3x = useTransform(mx, (v) => v * 45);
  const b3y = useTransform(my, (v) => v * 45);

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-32 pb-20 sm:px-8"
    >
      {/* liquid glass blobs */}
      <motion.div aria-hidden style={{ x: b1x, y: blobY }} className="pointer-events-none absolute -top-24 -left-24 h-[36rem] w-[36rem]">
        <motion.div style={{ y: b1y }} className="bg-blush h-full w-full rounded-full opacity-55 blur-[110px] [animation:blob-drift_18s_ease-in-out_infinite]" />
      </motion.div>
      <motion.div aria-hidden style={{ x: b2x, y: b2y }} className="pointer-events-none absolute top-[12%] right-[-10%] h-[34rem] w-[34rem]">
        <div className="bg-lilac h-full w-full rounded-full opacity-50 blur-[120px] [animation:blob-drift_24s_ease-in-out_infinite_reverse]" />
      </motion.div>
      <motion.div aria-hidden style={{ x: b3x, y: b3y }} className="pointer-events-none absolute bottom-[-12%] left-[22%] h-[30rem] w-[30rem]">
        <div className="bg-champagne h-full w-full rounded-full opacity-60 blur-[100px] [animation:blob-drift_21s_ease-in-out_infinite]" />
      </motion.div>

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div style={{ y: textY }}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease }}
            className="glass-soft eyebrow inline-flex items-center gap-2 rounded-full px-4 py-2"
          >
            <span className="bg-primary h-1.5 w-1.5 rounded-full" />
            Freelance Invitation Designer
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 34, filter: "blur(16px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.1, delay: 0.35, ease }}
            className="mt-7 text-[clamp(2.8rem,7vw,5.2rem)] leading-[1.02]"
          >
            Invitations that feel <em className="text-gradient-brand not-italic">handheld</em> and
            unforgettable.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6, ease }}
            className="text-muted-foreground mt-6 max-w-lg text-[1.02rem] leading-relaxed"
          >
            I design bespoke invitation suites, event stationery and delicate brand identities —
            crafted in soft paper tones, gold detail and quiet typography.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic
              href="#contact"
              className="bg-gradient-brand text-foreground group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm tracking-[0.1em] uppercase shadow-[0_18px_44px_-20px_oklch(0.63_0.1_12_/_0.75)]"
            >
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Magnetic>
            <Magnetic
              href="#work"
              className="glass-soft text-foreground group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm tracking-[0.1em] uppercase"
            >
              View Portfolio
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Magnetic>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-muted-foreground mt-12 flex gap-10 text-sm"
          >
            {[
              ["120+", "Suites designed"],
              ["6 yrs", "Freelance craft"],
              ["48 h", "First concept"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-display text-foreground text-2xl">{n}</dt>
                <dd className="mt-1 text-[0.72rem] tracking-[0.16em] uppercase">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>

        {/* floating previews */}
        <div className="relative h-[26rem] sm:h-[32rem] lg:h-[36rem] [perspective:1200px]">
          {previews.map((p) => (
            <PreviewCard key={p.alt} preview={p} mx={mx} my={my} />
          ))}
          <div aria-hidden className="glass-soft absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 [animation:float-soft_12s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}

function PreviewCard({
  preview: p,
  mx,
  my,
}: {
  preview: (typeof previews)[number];
  mx: MotionValue<number>;
  my: MotionValue<number>;
}) {
  const px = useTransform(mx, (v) => v * p.depth);
  const py = useTransform(my, (v) => v * p.depth * 0.7);
  const rY = useTransform(mx, (v) => v * 14);
  const rX = useTransform(my, (v) => -v * 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: p.delay, ease }}
      style={{ x: px, y: py, rotateX: rX, rotateY: rY, transformStyle: "preserve-3d" }}
      className={`absolute ${p.cls}`}
      data-cursor="card"
    >
      <div
        style={{ ["--tilt" as string]: p.tilt }}
        className="glass-panel relative overflow-hidden rounded-3xl p-2 [animation:float-soft_9s_ease-in-out_infinite] motion-reduce:[animation:none]"
      >
        <img
          src={p.src}
          alt={p.alt}
          width={912}
          height={1200}
          className="h-full w-full rounded-2xl object-cover"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(115deg,oklch(1_0_0/0.55)_0%,oklch(1_0_0/0)_45%)] opacity-70"
        />
      </div>
    </motion.div>
  );
}
