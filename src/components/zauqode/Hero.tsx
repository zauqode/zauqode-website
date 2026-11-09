import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[88vh] flex flex-col justify-center pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto w-full select-none"
    >
      {/* Top Section Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-2.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B]" />
        <span className="text-xs sm:text-sm text-[#0E8F91] font-medium tracking-wider">
          Creative Studio
        </span>
      </motion.div>

      {/* Main Composition: Headline & Right-Side Discipline List */}
      <div className="my-auto py-10 sm:py-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative">
        {/* Left Column: Oversized Headline with Script Overlap */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-editorial text-[clamp(3.1rem,8.4vw,6.5rem)] leading-[0.98] text-[#0E4847] tracking-tight"
          >
            <span className="block">Designing</span>
            <span className="block">stories with</span>
            <span className="block relative -mt-2 sm:-mt-4 lg:-mt-5">
              <span className="font-script text-[clamp(3.8rem,10.5vw,7.8rem)] text-[#C9A66B] font-normal leading-none inline-block pl-2 sm:pl-4 transform -rotate-1">
                purpose.
              </span>
            </span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg lg:text-xl text-[#0E4847]/80 font-sans leading-relaxed max-w-xl font-light"
          >
            A creative space where ideas, emotions and details find their perfect form.
          </motion.p>

          {/* CTA Action */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pt-2 sm:pt-4"
          >
            <a
              href="#craft"
              className="editorial-link group text-sm sm:text-base font-medium"
            >
              <span>Explore what I craft</span>
              <ArrowUpRight className="w-4 h-4 text-[#0E8F91] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>

        {/* Right Column: Disciplines */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 flex items-center lg:justify-end"
        >
          <div className="flex items-center gap-5 sm:gap-6">
            <div className="w-[1px] h-32 sm:h-36 bg-[#C9A66B]/50" />

            <div className="flex flex-col space-y-3 sm:space-y-4 text-xs sm:text-sm font-sans text-[#0E4847]/85 font-normal tracking-wide">
              <span className="hover:text-[#0E8F91] transition-colors">Brand</span>
              <span className="hover:text-[#0E8F91] transition-colors">Web</span>
              <span className="hover:text-[#0E8F91] transition-colors">Invitation</span>
              <span className="hover:text-[#0E8F91] transition-colors">Experience</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
