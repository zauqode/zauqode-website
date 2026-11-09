import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, X, ChevronLeft, ChevronRight, Globe, MessageCircle } from "lucide-react";
import zaraMockup from "../../assets/zara-mockup.png";
import weddingMockup from "../../assets/wedding-mockup.jpg";
import thriveMockup from "../../assets/thrive-mockup.png";
import portfolioMockup from "../../assets/portfolio-mockup.jpg";
import bizMockup from "../../assets/biz-mockup.jpg";

const WHATSAPP_RAW = "918946077234";

export interface Project {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  deliverables: string[];
  image: string;
  liveUrl?: string;
  overview: string;
}

const projects: Project[] = [
  {
    id: "zara-celebration",
    number: "01",
    title: "Zara Celebration",
    subtitle: "Digital Wedding Experience & Event Portal",
    category: "Wedding Website Design",
    year: "2026",
    description:
      "A bespoke celebration portal designed for an intimate wedding weekend, featuring ambient audio, multi-event schedules, and frictionless Google Sheets RSVP tracking.",
    deliverables: [
      "Custom Digital Wedding Portal",
      "Multi-Day Event Itinerary (Mehendi, Sangeet, Nikkah, Reception)",
      "Ambient Music Integration with Native Player Controls",
      "Live RSVP Submission Synced to Google Sheets",
      "Interactive Google Maps Navigation Pins",
    ],
    image: zaraMockup,
    liveUrl: "https://zara-invitation-website.vercel.app/",
    overview:
      "The client requested a sophisticated digital invitation space that would honor traditional celebration milestones while offering guests a contemporary, fluid mobile experience. We crafted an editorial layout enriched with curated typography, romantic background audio, and instant RSVP sync.",
  },
  {
    id: "botanique-suite",
    number: "02",
    title: "Botanique Wedding Suite",
    subtitle: "Animated Invitation Suite & Matching Print Stationery",
    category: "Wedding Invitation Design",
    year: "2026",
    description:
      "An editorial invitation suite pairing delicate gold foil botanical elements with an animated mobile invitation designed for WhatsApp and social sharing.",
    deliverables: [
      "Mobile-First Animated Digital Invitation",
      "Delicate Typography & Gold Foil Detailing",
      "1-Click WhatsApp Sharing Format with Custom Preview",
      "Print-Ready 300 DPI Physical Stationery Suite",
    ],
    image: weddingMockup,
    liveUrl: undefined,
    overview:
      "Designed for modern couples seeking zero postage waste without sacrificing tactile elegance. The animated digital invitation reveals with smooth motion, accompanied by high-resolution print files for elder family members.",
  },
  {
    id: "thrive-properties",
    number: "03",
    title: "Thrive Properties",
    subtitle: "Luxury Real Estate & Spatial Design Portal",
    category: "UI/UX Design & Development",
    year: "2026",
    description:
      "A minimalist property showcase for an upscale architecture firm, balancing generous whitespace with high-resolution photography and direct buyer inquiry pathways.",
    deliverables: [
      "Minimalist Editorial Typography Hierarchy",
      "Curated Property Showcase Modules",
      "High-Performance Image Loading",
      "Sub-second Response & Mobile Fluidity",
    ],
    image: thriveMockup,
    liveUrl: "https://thriveproperties.vercel.app/",
    overview:
      "Thrive required an editorial identity that separated their architectural offerings from generic broker platforms. We focused on spatial rhythm, restrained type, and frictionless contact routes.",
  },
  {
    id: "studio-portfolio",
    number: "04",
    title: "Creative Director Portfolio",
    subtitle: "Editorial Online Archive for Independent Consultants",
    category: "Brand Identity & UI/UX",
    year: "2026",
    description:
      "A refined digital authority platform engineered for a creative director, highlighting case studies, client commissions, and design philosophy.",
    deliverables: [
      "Custom Typography Hierarchy in Cormorant & Manrope",
      "Fluid Proof-of-Work Case Study Architecture",
      "Direct Commission Booking System",
    ],
    image: portfolioMockup,
    liveUrl: undefined,
    overview:
      "A digital presence designed to position proof of work as an art catalog. Generous negative space and subtle micro-interactions establish authority effortlessly.",
  },
  {
    id: "meridian-commercial",
    number: "05",
    title: "Meridian Commercial",
    subtitle: "Corporate Showroom & Wholesale Digital Catalog",
    category: "Business Website Development",
    year: "2026",
    description:
      "A modern corporate platform replacing cluttered industrial conventions with clarity, high-trust typography, and direct WhatsApp procurement inquiries.",
    deliverables: [
      "Clean B2B Product Showcase",
      "Direct-to-WhatsApp Quotation Engine",
      "Enterprise Credibility & SEO Foundation",
    ],
    image: bizMockup,
    liveUrl: undefined,
    overview:
      "Developed for a wholesale enterprise to establish immediate credibility with international buyers. Straightforward product specifications and instantaneous inquiry triggers.",
  },
];

export function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Close modal on Escape key or arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProject) return;
      if (e.key === "Escape") {
        setSelectedProject(null);
      } else if (e.key === "ArrowRight") {
        const idx = projects.findIndex((p) => p.id === selectedProject.id);
        setSelectedProject(projects[(idx + 1) % projects.length]);
      } else if (e.key === "ArrowLeft") {
        const idx = projects.findIndex((p) => p.id === selectedProject.id);
        setSelectedProject(projects[(idx - 1 + projects.length) % projects.length]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [selectedProject]);

  return (
    <section id="work" className="py-24 sm:py-32 lg:py-40 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto">
      {/* Section Header (No Line) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-12 sm:pb-16">
        <div>
          <span className="text-xs text-[#0E8F91] font-medium tracking-wide block mb-2">
            My Works
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#0E4847] leading-tight">
            A collection of meaningful{" "}
            <span className="italic font-normal text-[#0E8F91]">creations.</span>
          </h2>
        </div>

        <div className="space-y-4 max-w-md">
          <p className="text-sm sm:text-base text-[#0E4847]/70 font-sans font-light">
            A glimpse of the stories I've had the joy to design.
          </p>
          <div>
            <a href="#contact" className="editorial-link">
              <span>View selected works</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Asymmetric Editorial Portfolio Grid */}
      <div className="mt-16 sm:mt-24 space-y-24 sm:space-y-36">
        {/* Project 01: Full-Width Asymmetric Hero Feature */}
        {projects[0] && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center group cursor-pointer"
            onClick={() => setSelectedProject(projects[0])}
          >
            <div className="lg:col-span-8 order-2 lg:order-1">
              <div className="project-frame rounded-2xl overflow-hidden border border-[#0E4847]/10 aspect-[16/10] bg-[#EFECE3]">
                <img
                  src={projects[0].image}
                  alt={projects[0].title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-4 order-1 lg:order-2 space-y-5">
              <div className="flex items-center justify-between text-xs text-[#0E8F91] font-medium">
                <span>№ {projects[0].number}</span>
                <span>{projects[0].year}</span>
              </div>

              <div>
                <span className="text-xs text-[#C9A66B] font-medium block mb-1">
                  {projects[0].category}
                </span>
                <h3 className="font-editorial text-3xl sm:text-4xl text-[#0E4847] group-hover:text-[#0E8F91] transition-colors">
                  {projects[0].title}
                </h3>
              </div>

              <p className="text-sm text-[#0E4847]/75 font-sans leading-relaxed font-light">
                {projects[0].description}
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  className="editorial-link"
                >
                  <span>View Project Detail</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.article>
        )}

        {/* Project 02 & 03: Asymmetric Staggered Pair */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Project 02: Botanique Suite (7 Cols) */}
          {projects[1] && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 group cursor-pointer"
              onClick={() => setSelectedProject(projects[1])}
            >
              <div className="project-frame rounded-2xl overflow-hidden border border-[#0E4847]/10 aspect-[4/3] bg-[#EFECE3]">
                <img
                  src={projects[1].image}
                  alt={projects[1].title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#0E8F91] font-medium">
                  <span>№ {projects[1].number}</span>
                  <span>{projects[1].category}</span>
                </div>

                <h3 className="font-editorial text-3xl sm:text-4xl text-[#0E4847] group-hover:text-[#0E8F91] transition-colors">
                  {projects[1].title}
                </h3>

                <p className="text-sm text-[#0E4847]/75 font-sans leading-relaxed font-light max-w-xl">
                  {projects[1].description}
                </p>

                <div className="pt-2">
                  <button type="button" className="editorial-link">
                    <span>View Project Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          )}

          {/* Project 03: Thrive Properties (5 Cols, Offset down for asymmetric balance) */}
          {projects[2] && (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 lg:pt-20 space-y-6 group cursor-pointer"
              onClick={() => setSelectedProject(projects[2])}
            >
              <div className="project-frame rounded-2xl overflow-hidden border border-[#0E4847]/10 aspect-[16/10] bg-[#EFECE3]">
                <img
                  src={projects[2].image}
                  alt={projects[2].title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#0E8F91] font-medium">
                  <span>№ {projects[2].number}</span>
                  <span>{projects[2].category}</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl text-[#0E4847] group-hover:text-[#0E8F91] transition-colors">
                  {projects[2].title}
                </h3>

                <p className="text-sm text-[#0E4847]/75 font-sans leading-relaxed font-light">
                  {projects[2].description}
                </p>

                <div className="pt-2">
                  <button type="button" className="editorial-link">
                    <span>View Project Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          )}
        </div>

        {/* Project 04 & 05: Asymmetric Pair */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Project 04: Studio Portfolio (5 Cols) */}
          {projects[3] && (
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-6 group cursor-pointer"
              onClick={() => setSelectedProject(projects[3])}
            >
              <div className="project-frame rounded-2xl overflow-hidden border border-[#0E4847]/10 aspect-[4/3] bg-[#EFECE3]">
                <img
                  src={projects[3].image}
                  alt={projects[3].title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#0E8F91] font-medium">
                  <span>№ {projects[3].number}</span>
                  <span>{projects[3].category}</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl text-[#0E4847] group-hover:text-[#0E8F91] transition-colors">
                  {projects[3].title}
                </h3>

                <p className="text-sm text-[#0E4847]/75 font-sans leading-relaxed font-light">
                  {projects[3].description}
                </p>

                <div className="pt-2">
                  <button type="button" className="editorial-link">
                    <span>View Project Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          )}

          {/* Project 05: Meridian Commercial (7 Cols, offset) */}
          {projects[4] && (
            <motion.article
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 lg:pt-14 space-y-6 group cursor-pointer"
              onClick={() => setSelectedProject(projects[4])}
            >
              <div className="project-frame rounded-2xl overflow-hidden border border-[#0E4847]/10 aspect-[16/10] bg-[#EFECE3]">
                <img
                  src={projects[4].image}
                  alt={projects[4].title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#0E8F91] font-medium">
                  <span>№ {projects[4].number}</span>
                  <span>{projects[4].category}</span>
                </div>

                <h3 className="font-editorial text-3xl sm:text-4xl text-[#0E4847] group-hover:text-[#0E8F91] transition-colors">
                  {projects[4].title}
                </h3>

                <p className="text-sm text-[#0E4847]/75 font-sans leading-relaxed font-light max-w-xl">
                  {projects[4].description}
                </p>

                <div className="pt-2">
                  <button type="button" className="editorial-link">
                    <span>View Project Detail</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </div>

      {/* Project Detail Gallery Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0E4847]/60 backdrop-blur-md p-4 sm:p-6 lg:p-10"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F7F5EF] text-[#0E4847] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#0E4847]/15 p-6 sm:p-10 relative flex flex-col justify-between"
            >
              {/* Modal Top Header Bar */}
              <div className="flex items-center justify-between pb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-[#0E8F91] font-medium">
                    № {selectedProject.number}
                  </span>
                  <span className="text-xs text-[#0E4847]/40">&bull;</span>
                  <span className="text-xs text-[#C9A66B] font-medium">
                    {selectedProject.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Prev / Next controls */}
                  <button
                    type="button"
                    onClick={() => {
                      const idx = projects.findIndex((p) => p.id === selectedProject.id);
                      setSelectedProject(projects[(idx - 1 + projects.length) % projects.length]);
                    }}
                    className="w-9 h-9 rounded-full border border-[#0E4847]/20 flex items-center justify-center hover:bg-[#0E4847]/5 transition-colors cursor-pointer"
                    aria-label="Previous Project"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#0E4847]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const idx = projects.findIndex((p) => p.id === selectedProject.id);
                      setSelectedProject(projects[(idx + 1) % projects.length]);
                    }}
                    className="w-9 h-9 rounded-full border border-[#0E4847]/20 flex items-center justify-center hover:bg-[#0E4847]/5 transition-colors cursor-pointer"
                    aria-label="Next Project"
                  >
                    <ChevronRight className="w-4 h-4 text-[#0E4847]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    className="w-9 h-9 rounded-full bg-[#0E4847] text-[#F7F5EF] flex items-center justify-center hover:bg-[#0E8F91] transition-colors ml-2 cursor-pointer"
                    aria-label="Close Project Detail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body Content */}
              <div className="py-8 space-y-8">
                <div>
                  <h3 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#0E4847] leading-tight">
                    {selectedProject.title}
                  </h3>
                  <p className="font-sans text-sm sm:text-base text-[#0E8F91] mt-1 font-medium">
                    {selectedProject.subtitle}
                  </p>
                </div>

                {/* High-Resolution Project Showcase Image */}
                <div className="rounded-2xl overflow-hidden border border-[#0E4847]/10 bg-[#EFECE3] shadow-sm">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-auto object-cover max-h-[500px]"
                  />
                </div>

                {/* Project Narrative Overview */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-xs text-[#0E4847] font-semibold">
                      Overview &amp; Design Rationale
                    </h4>
                    <p className="text-sm sm:text-base text-[#0E4847]/80 font-sans leading-relaxed font-light">
                      {selectedProject.overview}
                    </p>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <h4 className="text-xs text-[#0E4847] font-semibold">
                      Key Deliverables
                    </h4>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#0E4847]/75 font-sans">
                      {selectedProject.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A66B] mt-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-6 hairline-t flex flex-wrap items-center justify-between gap-4">
                {selectedProject.liveUrl ? (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Launch Live Website</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-[#0E4847]/60 italic font-editorial text-base">
                    Archived Studio Case Study &bull; {selectedProject.year}
                  </span>
                )}

                <a
                  href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(
                    `Hi Zauqode, I'm inquiring about design work similar to "${selectedProject.title}".`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  <MessageCircle className="w-4 h-4 text-[#0E8F91]" />
                  <span>Inquire Similar Project</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
