import { motion } from "motion/react";
import { Compass, Palette, Code2, SlidersHorizontal, Rocket } from "lucide-react";

const steps = [
  {
    num: "01",
    name: "DISCOVER",
    desc: "Understanding your idea, goals, target audience, and distinct visual vision.",
    icon: Compass,
  },
  {
    num: "02",
    name: "DESIGN",
    desc: "Creating the bespoke visual direction, editorial typography, and liquid layout.",
    icon: Palette,
  },
  {
    num: "03",
    name: "BUILD",
    desc: "Transforming design into a responsive, 60fps interactive web experience.",
    icon: Code2,
  },
  {
    num: "04",
    name: "REFINE",
    desc: "Polishing micro-interactions, motion easing curves, and cross-device precision.",
    icon: SlidersHorizontal,
  },
  {
    num: "05",
    name: "LAUNCH",
    desc: "Taking your website live, optimized for performance and lasting impression.",
    icon: Rocket,
  },
];

export function ProcessTimeline() {
  return (
    <section id="process" className="relative py-24 sm:py-36 px-6 max-w-7xl mx-auto overflow-hidden text-[#FDFBF7]">
      {/* Background Soft Teal Blob for Blur Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center space-y-4 mb-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
          METHODOLOGY
        </span>
        <h2 className="font-editorial text-4xl sm:text-6xl text-[#FDFBF7]">
          From idea to experience<span className="text-[#2DD4BF]">.</span>
        </h2>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#94A3B8]">
          A structured 5-step process tailored to turn your vision into a fluid digital product.
        </p>
      </div>

      {/* Horizontal Process Grid Container */}
      <div className="relative">
        {/* Desktop Horizontal Connector Line */}
        <div className="hidden lg:block absolute top-14 left-[10%] right-[10%] h-0.5 bg-[#2DD4BF]/20 z-0" />

        {/* 5-Step Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-4 relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -4 }}
                className="group glass-card p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between items-center text-center space-y-4 relative"
              >
                {/* Step Badge & Icon */}
                <div className="relative flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#136262] border border-[#2DD4BF]/40 flex items-center justify-center text-white shadow-inner group-hover:bg-[#2DD4BF] group-hover:text-[#050505] transition-all duration-300 transform group-hover:scale-110">
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>
                  <span className="absolute -top-2 -right-3 font-mono text-xs font-extrabold text-[#2DD4BF] bg-[#050505] px-2 py-0.5 rounded-full border border-[#2DD4BF]/40 shadow-md">
                    {step.num}
                  </span>
                </div>

                {/* Step Title & Description */}
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-[#FDFBF7] tracking-wider uppercase group-hover:text-[#2DD4BF] transition-colors">
                    {step.name}
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {/* Bottom Step Indicator Dot */}
                <div className="w-2 h-2 rounded-full bg-[#2DD4BF]/30 group-hover:bg-[#2DD4BF] group-hover:scale-125 transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
