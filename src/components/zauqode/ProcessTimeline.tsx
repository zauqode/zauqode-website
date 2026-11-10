import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { Compass, Palette, Smartphone, SlidersHorizontal, Send, Sparkles } from "lucide-react";

const steps = [
  {
    num: "01",
    name: "Vision & Traditions",
    desc: "Share your date, celebration events, color palette, venue locations, and favorite romantic soundtrack.",
    icon: Compass,
  },
  {
    num: "02",
    name: "Couture Design",
    desc: "I handcraft editorial typography, gold foil accents, and interactive unsealing motion tailored to your aesthetic.",
    icon: Palette,
  },
  {
    num: "03",
    name: "Interactive Preview",
    desc: "Experience your invitation privately on your smartphone — test the music, check venue maps, and verify wording.",
    icon: Smartphone,
  },
  {
    num: "04",
    name: "RSVP Sync & Polish",
    desc: "I fine-tune any adjustments and connect the live RSVP tracking directly to your private Google Sheet.",
    icon: SlidersHorizontal,
  },
  {
    num: "05",
    name: "1-Tap Guest Launch",
    desc: "Share effortlessly across WhatsApp and social media with a gorgeous preview card and watch RSVPs arrive in real time.",
    icon: Send,
  },
];

export function ProcessTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 75%", "center 45%"],
  });

  const lineScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (hoveredIdx === null) {
      const computed = Math.min(4, Math.max(0, Math.floor(progress * 5)));
      setActiveIdx(computed);
    }
  });

  const currentIdx = hoveredIdx !== null ? hoveredIdx : activeIdx;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto text-[#0D2626] overflow-hidden"
    >
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-[#0D9488]/30 bg-white/70 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0D9488] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>The Atelier Journey</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-editorial text-[clamp(2.1rem,5vw,3.75rem)] text-[#0D2626] leading-tight"
        >
          From vision to celebration,
          <br />
          <span className="italic font-heading text-[#0D9488]">effortless in 5 graceful steps.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-[#3D6060] max-w-xl mx-auto mt-4 leading-relaxed"
        >
          No stress or endless back-and-forth. A seamless collaborative experience from first consultation to your guests' enthusiastic replies.
        </motion.p>
      </div>

      {/* Process Desktop Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-6 relative">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = idx === currentIdx;

          return (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer border ${
                isActive
                  ? "liquid-glass-card border-[#0D9488]/40 shadow-xl bg-white/90 scale-105"
                  : "bg-white/60 border-white/60 hover:bg-white/80 shadow-xs"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-numeric text-2xl font-bold tracking-tight transition-colors ${
                      isActive ? "text-[#0D9488]" : "text-[#3D6060]/50"
                    }`}
                  >
                    {step.num}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isActive ? "bg-[#0D9488] text-white" : "bg-[#0D9488]/10 text-[#0D9488]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-editorial text-lg text-[#0D2626] font-normal tracking-wide">
                  {step.name}
                </h3>
                <p className="text-xs text-[#3D6060] leading-relaxed mt-2">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#0D9488]/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488]">
                  Phase {step.num}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
