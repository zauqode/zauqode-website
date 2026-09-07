import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal, TiltCard } from "./primitives";
import portrait from "@/assets/about-portrait.jpg";

const skills = [
  "Layout & typography",
  "Foil & print specs",
  "Palette building",
  "Illustration accents",
  "Digital invitations",
  "Brand systems",
];

export function About() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const textY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section id="about" ref={ref} className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div
        aria-hidden
        className="bg-champagne pointer-events-none absolute bottom-0 -left-40 h-[28rem] w-[28rem] rounded-full opacity-45 blur-[130px]"
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div style={{ y: imgY }}>
          <Reveal variant="scale">
            <TiltCard cursor="card" className="rounded-[2rem]" max={7} lift={12}>
              <div className="glass-panel relative overflow-hidden rounded-[2rem] p-2.5">
                <img
                  src={portrait}
                  alt="Aafrin Aaysha, freelance invitation designer, at her studio desk"
                  width={912}
                  height={1140}
                  loading="lazy"
                  className="h-full w-full rounded-[1.6rem] object-cover"
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-[2rem] bg-[linear-gradient(120deg,oklch(1_0_0/0.45)_0%,oklch(1_0_0/0)_50%)]"
                />
              </div>
            </TiltCard>
          </Reveal>
        </motion.div>

        <motion.div style={{ y: textY }}>
          <Reveal variant="blur">
            <p className="eyebrow">About me</p>
            <h2 className="mt-4 text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.08]">
              Hi, I'm Aafrin — I design the first thing your guests touch
            </h2>
          </Reveal>

          <Reveal variant="rise" delay={0.12}>
            <p className="text-muted-foreground mt-6 max-w-xl leading-relaxed">
              For six years I've worked with couples, families and small studios to shape
              invitations that feel personal rather than templated. I care about paper weight,
              the way a monogram breathes, and the pause before someone opens an envelope.
            </p>
            <p className="text-muted-foreground mt-4 max-w-xl leading-relaxed">
              Every project starts with a conversation and ends with something you'll want to
              keep in a drawer for years.
            </p>
          </Reveal>

          <div className="mt-9 flex flex-wrap gap-2.5">
            {skills.map((s, i) => (
              <Reveal key={s} variant="scale" delay={0.2 + i * 0.06}>
                <span
                  data-cursor="button"
                  className="glass-soft text-muted-foreground hover:text-foreground inline-block rounded-full px-4 py-2 text-[0.72rem] tracking-[0.14em] uppercase transition-all duration-300 hover:scale-105"
                >
                  {s}
                </span>
              </Reveal>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
