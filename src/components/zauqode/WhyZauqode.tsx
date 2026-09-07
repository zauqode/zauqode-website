import { motion } from "motion/react";

const pillars = [
  {
    title: "Thoughtful, not templated.",
    description: "No mass-produced framework skins. Every layout is specifically conceived around your brand's unique character.",
  },
  {
    title: "Beautiful, but functional.",
    description: "Stunning visual aesthetics backed by clean code structure, fast load times, and seamless mobile responsiveness.",
  },
  {
    title: "Premium, without unnecessary complexity.",
    description: "Refined liquid interactions that elevate user delight without adding overwhelming clutter or slow page bloat.",
  },
  {
    title: "Designed around your vision.",
    description: "Collaborative, personalized focus ensuring your ideas are transformed into digital art you are proud to present.",
  },
];

export function WhyZauqode() {
  return (
    <section className="py-24 sm:py-36 px-6 max-w-5xl mx-auto text-[#FDFBF7]">
      <div className="text-center space-y-4 mb-20">
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
          THE ZAUQODE DIFFERENCE
        </span>
        <h2 className="font-editorial text-4xl sm:text-6xl text-[#FDFBF7]">
          Why Zauqode<span className="text-[#2DD4BF]">?</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {pillars.map((pillar, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.15 }}
            className="space-y-4 border-l-2 border-[#2DD4BF]/30 pl-6 hover:border-[#2DD4BF] transition-colors duration-500"
          >
            <h3 className="font-editorial text-2xl sm:text-3xl text-[#FDFBF7]">
              {pillar.title}
            </h3>
            <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
              {pillar.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
