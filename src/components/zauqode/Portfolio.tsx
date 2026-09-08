import { motion } from "motion/react";

import thriveMockup from "../../assets/thrive-mockup.jpg";

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  client: string;
  year: string;
  link?: string;
}

const projects: Project[] = [
  {
    id: "thrive-properties",
    title: "Thrive Properties",
    category: "Real Estate Website",
    image: thriveMockup,
    client: "Real Estate Business",
    year: "2026",
    link: "https://thriveproperties.vercel.app/",
  },
];

export function Portfolio() {
  return (
    <section id="work" className="relative bg-[#050505] py-24 sm:py-32 overflow-hidden text-[#FDFBF7]">
      {/* Background Soft Teal Blobs for Liquid Glass Blur */}
      <div className="absolute top-1/4 -right-24 w-[500px] h-[500px] bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-24 w-[500px] h-[500px] bg-[#2DD4BF]/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="px-6 max-w-7xl mx-auto mb-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#2DD4BF]/20 pb-8 text-center md:text-left items-center md:items-start">
          <div className="w-full">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2DD4BF]">
              SELECTED PORTFOLIO
            </span>
            <h2 className="font-editorial text-4xl sm:text-6xl text-[#FDFBF7] mt-2">
              Selected work<span className="text-[#2DD4BF]">.</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Grid */}
      <div className="w-full px-6 max-w-7xl mx-auto flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {projects.map((proj) => (
            <motion.div
              key={proj.id}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card overflow-hidden group shadow-xl hover:shadow-2xl flex flex-col justify-between transition-all duration-300 w-full md:w-[420px] shrink-0"
            >
              {/* Project Cover Image */}
              <div className="relative aspect-[16/11] overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-500" />
                

              </div>

              {/* Card Details */}
              <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1">
                    <span>{proj.client}</span>
                    <span className="font-mono font-bold text-[#2DD4BF]">{proj.year}</span>
                  </div>
                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#FDFBF7] group-hover:text-[#2DD4BF] transition-colors">
                    {proj.title}
                  </h3>
                </div>

                <a
                  href={proj.link || "#contact"}
                  target={proj.link?.startsWith("http") ? "_blank" : undefined}
                  rel={proj.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-cursor="button"
                  className="pt-3.5 border-t border-[#2DD4BF]/20 flex items-center justify-between group/btn w-full"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[#2DD4BF] group-hover/btn:text-white transition-colors">
                    View Full Website
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#136262] border border-[#2DD4BF]/40 text-white flex items-center justify-center text-xs font-bold group-hover/btn:bg-[#2DD4BF] group-hover/btn:text-[#050505] transition-all duration-300">
                    →
                  </span>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
