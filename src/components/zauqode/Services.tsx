import { motion } from "motion/react";
import { Sparkles, Globe, Palette, Layout, Code2, ArrowUpRight } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  icon: typeof Sparkles;
}

const services: ServiceItem[] = [
  {
    id: "01",
    name: "Wedding Creations",
    description: "Bespoke digital suites & stationery.",
    icon: Sparkles,
  },
  {
    id: "02",
    name: "Digital Experiences",
    description: "Interactive celebration websites.",
    icon: Globe,
  },
  {
    id: "03",
    name: "Brand Identity",
    description: "Enduring editorial visual systems.",
    icon: Palette,
  },
  {
    id: "04",
    name: "UI/UX Design",
    description: "Human-centered digital interfaces.",
    icon: Layout,
  },
  {
    id: "05",
    name: "Web Development",
    description: "Modern, responsive performance.",
    icon: Code2,
  },
];

export function Services() {
  return (
    <section
      id="craft"
      className="w-full bg-[#E8F0E9] py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Large Handwritten Heading "I Craft" */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs text-[#0E8F91] font-medium tracking-wider block mb-1">
              Capabilities
            </span>
            <h2 className="font-script text-5xl sm:text-6xl lg:text-7xl text-[#0E4847] leading-none">
              I Craft
            </h2>
          </motion.div>
        </div>

        {/* Right: Five Evenly Spaced Service Items */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="pt-2 sm:pt-0 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-white/70 border border-[#0E4847]/10 flex items-center justify-center text-[#0E8F91] group-hover:bg-[#0E4847] group-hover:text-[#F7F5EF] transition-all duration-300 mb-4 transform group-hover:-translate-y-1">
                    <Icon className="w-4 h-4 stroke-[1.6]" />
                  </div>

                  <h3 className="font-editorial text-xl sm:text-2xl text-[#0E4847] group-hover:text-[#0E8F91] transition-colors leading-snug">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#0E4847]/70 font-sans mt-2 leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 pt-2 flex items-center gap-1 text-xs text-[#0E8F91] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
