import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, Heart, UserCheck, ChevronDown, Check } from "lucide-react";

interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  portfolioFilter: string;
  icon: typeof Briefcase;
}

const services: ServiceItem[] = [
  {
    id: "01",
    name: "Business Websites",
    category: "Commercial & Enterprise",
    description:
      "Modern, conversion-oriented websites engineered to establish instant trust, outpace competitors, and convert high-intent visitors into loyal clients.",
    features: [
      "Custom Design & Strategy",
      "Mobile-First & Responsive",
      "Fast Delivery (7–14 Days)",
      "SEO & Speed Optimized",
    ],
    portfolioFilter: "#work",
    icon: Briefcase,
  },
  {
    id: "02",
    name: "Digital Invitations",
    category: "Bespoke Celebrations",
    description:
      "Interactive digital invitations for weddings, birthdays, baby showers, and milestones. Featuring live RSVP management, interactive Google Maps, and bespoke audio.",
    features: [
      "Live RSVP & Guest Tracking",
      "Interactive Map Directions",
      "Bespoke Music & Motion",
      "Instant Digital Sharing",
    ],
    portfolioFilter: "#work",
    icon: Heart,
  },
  {
    id: "03",
    name: "Portfolio & Personal Brands",
    category: "Creative Identity",
    description:
      "Distinctive digital portfolios crafted for founders, freelancers, and artists to showcase proof of work, personality, and creative stature with editorial polish.",
    features: [
      "Editorial Typography System",
      "Smooth 60fps Micro-Interactions",
      "Project Case Studies & Proof",
      "Direct Inquiry Integration",
    ],
    portfolioFilter: "#work",
    icon: UserCheck,
  },
];

export function Services() {
  // First row is expanded by default (accordion behavior)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleRow = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="services" className="relative py-24 sm:py-36 px-6 max-w-5xl mx-auto text-[#0D2626]">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-14 text-center sm:text-left"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">
          Primary Services
        </span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-2 border-b border-[#0D9488]/15 pb-8">
          <h2 className="font-editorial text-4xl sm:text-6xl text-[#0D2626]">
            What I create<span className="text-[#0D9488]">.</span>
          </h2>
        </div>
      </motion.div>

      {/* Accordion List — 3 Horizontal Rows, No Images */}
      <div className="border-t border-[#0D9488]/15 divide-y divide-[#0D9488]/15">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isExpanded = expandedIndex === index;

          return (
            <div
              key={service.id}
              onClick={() => toggleRow(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleRow(index);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              className={`group transition-colors duration-200 cursor-pointer select-none rounded-xl ${
                isExpanded ? "bg-[#0D9488]/[0.04]" : "hover:bg-[#0D9488]/[0.02]"
              }`}
            >
              {/* Collapsed Row Header: roughly 70-80px height, min 48px tap target */}
              <div className="min-h-[72px] sm:min-h-[80px] py-4 sm:py-5 px-3 sm:px-6 flex items-center justify-between gap-4">
                {/* Left: Icon & Service Name */}
                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isExpanded
                        ? "bg-[#0D9488] text-white shadow-[0_4px_16px_rgba(13,148,136,0.3)] scale-105"
                        : "bg-[#0D9488]/10 text-[#0D9488] group-hover:bg-[#0D9488]/15"
                    }`}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                  </div>

                  {/* Index + Service Name */}
                  <div className="flex items-baseline gap-3 min-w-0">
                    <span className="text-[11px] sm:text-xs font-mono font-bold text-[#0D9488]/60 flex-shrink-0">
                      {service.id}
                    </span>
                    <h3
                      className={`font-editorial text-xl sm:text-3xl lg:text-4xl truncate transition-all duration-300 ${
                        isExpanded
                          ? "text-[#0D9488] translate-x-1"
                          : "text-[#0D2626] group-hover:text-[#0D9488]"
                      }`}
                    >
                      {service.name}
                    </h3>
                  </div>
                </div>

                {/* Right: Small Arrow / Chevron Icon (rotates 180deg) */}
                <div className="flex-shrink-0 pl-2">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isExpanded
                        ? "border-[#0D9488] text-[#0D9488] bg-white shadow-xs"
                        : "border-[#0D9488]/20 text-[#3D6060] group-hover:border-[#0D9488]/50 group-hover:text-[#0D9488]"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-350 ease-in-out ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Smooth Expandable Body using CSS grid-template-rows */}
              <div
                className={`grid transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="pt-1 pb-6 sm:pb-8 px-3 sm:px-6 pl-14 sm:pl-22 pr-4 sm:pr-8 space-y-5">
                    {/* 1-2 line plain-language description */}
                    <p className="text-sm sm:text-base text-[#3D6060] leading-relaxed max-w-2xl">
                      {service.description}
                    </p>

                    {/* 3-4 feature bullet points with checkmarks */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-2xl pt-1">
                      {service.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-[#0D2626]">
                          <span className="w-4 h-4 rounded-full bg-[#0D9488]/15 text-[#0D9488] flex items-center justify-center flex-shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Link to relevant portfolio filter */}
                    <div className="pt-2">
                      <a
                        href={service.portfolioFilter}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#0D9488] hover:text-[#0F6B6B] transition-all duration-200 group/link"
                      >
                        <span>See examples</span>
                        <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
