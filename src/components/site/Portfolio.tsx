import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { Reveal } from "./primitives";
import wedding from "@/assets/work-wedding.jpg";
import baby from "@/assets/work-baby.jpg";
import birthday from "@/assets/work-birthday.jpg";
import engagement from "@/assets/work-engagement.jpg";
import event from "@/assets/work-event.jpg";
import traditional from "@/assets/work-traditional.jpg";

const projects = [
  { title: "Olivia & Hayden", category: "Wedding Invitation", src: wedding, span: "lg:col-span-7" },
  { title: "Ananya & Vikram", category: "Traditional Suite", src: traditional, span: "lg:col-span-5" },
  { title: "Aisha & Rohan", category: "Engagement Suite", src: engagement, span: "lg:col-span-5" },
  { title: "Little Cloud", category: "Baby Shower", src: baby, span: "lg:col-span-7" },
  { title: "Olivia Turns Ten", category: "Birthday Design", src: birthday, span: "lg:col-span-6" },
  { title: "Annual Dinner", category: "Event Stationery", src: event, span: "lg:col-span-6" },
];

function ProjectCard({ p, index }: { p: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const spring = { stiffness: 180, damping: 20, mass: 0.4 };
  const ix = useSpring(useMotionValue(0), spring);
  const iy = useSpring(useMotionValue(0), spring);
  const rx = useSpring(useMotionValue(0), spring);
  const ry = useSpring(useMotionValue(0), spring);

  const onMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ix.set(px * -22);
    iy.set(py * -22);
    ry.set(px * 8);
    rx.set(py * -6);
  };

  const reset = () => {
    ix.set(0);
    iy.set(0);
    rx.set(0);
    ry.set(0);
  };

  return (
    <Reveal variant="mask" delay={index * 0.1} className={p.span}>
      <div className="[perspective:1200px]" data-cursor="view">
        <motion.div
          ref={ref}
          onMouseMove={onMove}
          onMouseLeave={reset}
          style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
          className="glass-panel group relative overflow-hidden rounded-[1.75rem] p-2 transition-shadow duration-500 hover:shadow-[var(--shadow-float)]"
        >
          <div className="relative overflow-hidden rounded-[1.4rem]">
            <motion.img
              src={p.src}
              alt={`${p.category} — ${p.title}`}
              width={912}
              height={1200}
              loading="lazy"
              style={{ x: ix, y: iy }}
              className="aspect-[4/5] w-full scale-[1.06] object-cover transition-transform duration-[900ms] ease-[var(--ease-silk)] group-hover:scale-[1.14]"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,oklch(0.28_0.03_330/0.42),oklch(1_0_0/0)_58%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="glass-soft absolute inset-x-3 bottom-3 translate-y-4 rounded-2xl px-5 py-4 opacity-0 transition-all duration-600 ease-[var(--ease-silk)] group-hover:translate-y-0 group-hover:opacity-100">
              <p className="eyebrow">{p.category}</p>
              <div className="mt-1 flex items-center justify-between gap-4">
                <h3 className="font-display text-xl">{p.title}</h3>
                <span className="inline-flex items-center gap-1 text-[0.7rem] tracking-[0.18em] uppercase">
                  View <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="mt-4 flex items-baseline justify-between px-1">
        <h3 className="font-display text-lg">{p.title}</h3>
        <p className="text-muted-foreground text-[0.68rem] tracking-[0.18em] uppercase">
          {p.category}
        </p>
      </div>
    </Reveal>
  );
}

export function Portfolio() {
  return (
    <section id="work" className="relative px-5 py-24 sm:px-8 sm:py-32">
      <div
        aria-hidden
        className="bg-lilac pointer-events-none absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full opacity-35 blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal variant="blur" className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.08]">
              A portfolio of quiet celebration
            </h2>
          </div>
          <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
            Every suite begins with the couple, the family or the moment — then the paper, palette
            and type follow.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-x-6 gap-y-14 lg:grid-cols-12">
          {projects.map((p, i) => (
            <ProjectCard key={p.title} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
