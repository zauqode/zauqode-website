import { ArrowRight } from "lucide-react";
import { Magnetic, Reveal, TiltCard } from "./primitives";

const services = [
  {
    title: "Invitation Design",
    copy: "Bespoke suites from save-the-date to thank-you card, in paper, foil and digital formats.",
    tags: ["Wedding", "Birthday", "Engagement", "Baby Shower", "Events"],
  },
  {
    title: "Event Stationery",
    copy: "Menus, signage, seating charts and favour tags that carry one calm visual language.",
    tags: ["Menus", "Signage", "Seating", "Favours", "Programs"],
  },
  {
    title: "Delicate Branding",
    copy: "Monograms, palettes and typographic systems for studios, boutiques and celebrations.",
    tags: ["Logo", "Monogram", "Palette", "Type", "Guidelines"],
  },
];

export function Services() {
  return (
    <section id="services" className="relative px-5 py-28 sm:px-8 sm:py-36">
      <div
        aria-hidden
        className="bg-champagne pointer-events-none absolute top-10 -left-32 h-96 w-96 rounded-full opacity-40 blur-[110px]"
      />
      <div className="relative mx-auto max-w-6xl">
        <Reveal variant="blur">
          <p className="eyebrow">What I do</p>
          <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.08]">
            Three ways we can work together
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.title} variant="rise" delay={i * 0.14} className={i === 1 ? "md:mt-10" : i === 2 ? "md:mt-4" : ""}>
              <TiltCard cursor="card" className="h-full rounded-[1.75rem]">
                <div className="glass-panel group/card relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-7 transition-[box-shadow,border-color,background] duration-500 hover:border-[oklch(1_0_0/0.85)] hover:shadow-[var(--shadow-float)]">
                  <span
                    aria-hidden
                    className="bg-gradient-brand absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-25 blur-3xl transition-opacity duration-500 group-hover/card:opacity-60"
                  />
                  <span className="font-display text-muted-foreground/70 relative text-sm">
                    0{i + 1}
                  </span>
                  <h3 className="relative mt-5 text-2xl transition-transform duration-500 group-hover/card:-translate-y-0.5">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground relative mt-3 text-sm leading-relaxed">
                    {s.copy}
                  </p>

                  <div className="relative grid grid-rows-[0fr] transition-[grid-template-rows] duration-600 ease-[var(--ease-silk)] group-hover/card:grid-rows-[1fr]">
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground pt-5 text-[0.7rem] tracking-[0.16em] uppercase opacity-0 transition-opacity duration-500 group-hover/card:opacity-100">
                        {s.tags.join(" · ")}
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-7 pt-5">
                    <Magnetic
                      href="#contact"
                      radius={150}
                      className="text-foreground group/btn inline-flex items-center gap-2 text-[0.75rem] tracking-[0.18em] uppercase"
                    >
                      Explore
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </Magnetic>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
