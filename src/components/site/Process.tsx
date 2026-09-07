import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { Reveal } from "./primitives";

const steps = [
  {
    title: "Discovery",
    copy: "We talk about the celebration, the guests and the feeling you want in their hands.",
  },
  {
    title: "Concept",
    copy: "Two directions with palette, paper and typography — presented as a calm visual story.",
  },
  {
    title: "Refinement",
    copy: "We polish wording, spacing and detail until every line sits exactly where it should.",
  },
  {
    title: "Delivery",
    copy: "Print-ready files, foil separations and digital versions for messaging and socials.",
  },
];

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const height = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 90,
    damping: 24,
  });

  return (
    <section id="process" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div
        aria-hidden
        className="bg-lilac pointer-events-none absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full opacity-35 blur-[120px]"
      />
      <div className="relative mx-auto max-w-5xl">
        <Reveal variant="blur">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.08]">
            A slow, considered process
          </h2>
        </Reveal>

        <div ref={ref} className="relative mt-16 pl-10 sm:pl-16">
          <div
            aria-hidden
            className="bg-border/70 absolute top-2 bottom-2 left-[9px] w-px sm:left-[15px]"
          />
          <motion.div
            aria-hidden
            style={{ height }}
            className="bg-gradient-brand absolute top-2 left-[8px] w-[3px] rounded-full sm:left-[14px]"
          />

          <ol className="space-y-12 sm:space-y-16">
            {steps.map((s, i) => (
              <Reveal as="li" key={s.title} variant="left" delay={i * 0.08}>
                <div className="group relative">
                  <span
                    aria-hidden
                    className="glass-panel absolute top-1.5 -left-10 flex h-5 w-5 items-center justify-center rounded-full transition-transform duration-500 group-hover:scale-125 sm:-left-16 sm:h-7 sm:w-7"
                  >
                    <span className="bg-gradient-brand h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5" />
                  </span>
                  <p className="font-display text-muted-foreground/70 text-sm">
                    Step 0{i + 1}
                  </p>
                  <h3 className="mt-2 text-2xl transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed">
                    {s.copy}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
