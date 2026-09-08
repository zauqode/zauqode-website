import { useState } from "react";
import { motion } from "motion/react";
import bizMockup from "../../assets/biz-mockup.jpg";
import weddingMockup from "../../assets/wedding-mockup.jpg";
import portfolioMockup from "../../assets/portfolio-mockup.jpg";

const services = [
  {
    id: "01",
    title: "BUSINESS WEBSITES",
    subtitle: "Strategy & Identity",
    description: "Modern, strategic websites designed to help businesses build trust, stand out, and create a stronger digital presence.",
    mockup: bizMockup,
    tag: "Commercial",
  },
  {
    id: "02",
    title: "DIGITAL INVITATIONS FOR ALL OCCASIONS & EVENTS",
    subtitle: "Bespoke Celebrations",
    description: "Beautiful digital invitations and websites created to celebrate weddings, birthdays, baby showers, engagements, and all special occasions.",
    mockup: weddingMockup,
    tag: "Romantic & Celebration",
  },
  {
    id: "03",
    title: "PORTFOLIO WEBSITES",
    subtitle: "Creative Identity",
    description: "Distinctive digital portfolios designed to showcase your work, personality, and creative identity.",
    mockup: portfolioMockup,
    tag: "Avant-Garde",
  },
];

export function Services() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-24 sm:py-36 px-6 max-w-7xl mx-auto text-[#FDFBF7]">
      {/* Background Soft Teal Blob for Liquid Glass Blur Effect */}
      <div className="absolute top-1/3 -left-24 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 -right-24 w-96 h-96 bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4 border-b border-[#2DD4BF]/20 pb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
            PRIMARY SERVICES
          </span>
          <h2 className="font-editorial text-4xl sm:text-6xl text-[#FDFBF7] mt-2">
            What I create<span className="text-[#2DD4BF]">.</span>
          </h2>
        </div>
      </div>

      {/* Horizontal Cards Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {services.map((service, idx) => {
          return (
            <motion.div
              key={service.id}
              onMouseEnter={() => setActiveIdx(idx)}
              onMouseLeave={() => setActiveIdx(null)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{ y: -4 }}
              className="glass-card p-6 sm:p-7 flex flex-col justify-between group shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="space-y-6">
                {/* Top Image Mockup Frame */}
                <div className="relative rounded-2xl overflow-hidden border border-[#2DD4BF]/30 shadow-md aspect-[4/3]">
                  <img
                    src={service.mockup}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                </div>

                {/* Card Title & Content */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#2DD4BF]">
                    {service.subtitle}
                  </span>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#FDFBF7] group-hover:text-[#2DD4BF] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>

              {/* Bottom Action Link */}
              <div className="pt-6 mt-6 border-t border-[#2DD4BF]/20">
                <a
                  href="#contact"
                  data-cursor="button"
                  className="inline-flex items-center justify-between w-full text-xs font-bold uppercase tracking-widest text-[#2DD4BF] group-hover:text-white transition-colors"
                >
                  <span>Explore Service</span>
                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
