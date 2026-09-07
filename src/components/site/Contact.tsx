import { ArrowRight, Instagram, Mail } from "lucide-react";
import { Magnetic, Reveal, TiltCard } from "./primitives";

export function Contact() {
  return (
    <section id="contact" className="relative px-5 pb-16 sm:px-8">
      <div className="relative mx-auto max-w-5xl">
        <Reveal variant="scale">
          <TiltCard cursor="view" className="rounded-[2.5rem]" max={4} lift={8}>
            <div className="glass-panel relative overflow-hidden rounded-[2.5rem] px-7 py-20 text-center sm:px-14 sm:py-28">
              <span
                aria-hidden
                className="bg-gradient-brand absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full opacity-45 blur-[90px]"
              />
              <p className="eyebrow relative">Let's begin</p>
              <h2 className="relative mx-auto mt-5 max-w-3xl text-[clamp(2.2rem,5.6vw,4.2rem)] leading-[1.04]">
                Have a celebration coming up?
              </h2>
              <p className="text-muted-foreground relative mx-auto mt-6 max-w-lg leading-relaxed">
                Tell me the date, the mood and the guest count — I'll come back with a first
                concept within 48 hours.
              </p>

              <div className="relative mt-11 flex flex-wrap items-center justify-center gap-4">
                <Magnetic
                  href="mailto:hello@aafrin.design"
                  radius={190}
                  className="bg-gradient-brand text-foreground group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm tracking-[0.12em] uppercase shadow-[0_20px_50px_-22px_oklch(0.63_0.1_12_/_0.8)]"
                >
                  <span className="grid">
                    <span className="transition-transform duration-500 ease-[var(--ease-silk)] group-hover:-translate-y-[160%]">
                      Start a Project
                    </span>
                    <span className="absolute translate-y-[160%] transition-transform duration-500 ease-[var(--ease-silk)] group-hover:translate-y-0">
                      Let's Create
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                </Magnetic>

                <Magnetic
                  href="mailto:hello@aafrin.design"
                  radius={160}
                  className="glass-soft text-foreground inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm tracking-[0.12em] uppercase transition-transform duration-300 hover:scale-[1.03]"
                >
                  <Mail className="h-4 w-4" />
                  hello@aafrin.design
                </Magnetic>
              </div>

              <a
                href="https://www.instagram.com/zauqode?stkn=ZnBzZWZ3eXZ4bTVp&utm_source=qr"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground relative mt-10 flex items-center justify-center gap-2 text-[0.72rem] tracking-[0.18em] uppercase hover:text-foreground transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
                @zauqode
              </a>
            </div>
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="relative px-5 pb-10 sm:px-8">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 border-t pt-8 text-[0.72rem] tracking-[0.14em] uppercase sm:flex-row">
        <span className="font-display text-foreground text-base tracking-tight normal-case">
          Aafrin<span className="text-primary">.</span>
        </span>
        <span>Invitation & stationery design</span>
        <span>© {new Date().getFullYear()} Aafrin Aaysha</span>
      </div>
    </footer>
  );
}
