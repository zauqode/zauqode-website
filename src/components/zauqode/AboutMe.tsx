import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { CheckCircle2, ShoppingBag, Truck, Building2, Store, HeartHandshake, Sparkles, Zap, Smartphone } from "lucide-react";

const WHATSAPP_RAW = "918946077234";

// Animated counter stat
function StatCounter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  const started = useRef(false);

  if (isInView && !started.current) {
    started.current = true;
    let start = 0;
    const duration = 1600;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  return (
    <div ref={ref} className="text-center p-2.5 sm:p-4 rounded-2xl bg-white/40 border border-[#0D9488]/10 shadow-xs flex flex-col justify-center min-w-0">
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="font-numeric font-bold text-[clamp(1.5rem,4.5vw,2.75rem)] text-[#0D9488] tracking-tight leading-none"
      >
        {count}{suffix}
      </motion.p>
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#3D6060] mt-1.5 leading-tight">{label}</p>
    </div>
  );
}

const industries = [
  { name: "Retail & E-Commerce", icon: ShoppingBag },
  { name: "Wholesale & Distributors", icon: Truck },
  { name: "Dealers & Showrooms", icon: Store },
  { name: "Real Estate & Builders", icon: Building2 },
  { name: "Corporate & Professional Services", icon: Building2 },
  { name: "Digital Invitations & Events", icon: Sparkles },
  { name: "Healthcare & Clinics", icon: HeartHandshake },
  { name: "Personal Brands & Portfolios", icon: Zap },
];

const keyPoints = [
  {
    title: "Engineered to Convert",
    desc: "Every website is structured to turn casual visitors into paying customers with frictionless direct inquiry actions and clear value messaging.",
    icon: Zap,
  },
  {
    title: "100% Bespoke Craft",
    desc: "Zauqode builds custom digital identities from scratch — no generic cookie-cutter templates, just distinctive taste and tailored precision.",
    icon: Sparkles,
  },
  {
    title: "Mobile-First & Responsive",
    desc: "Flawlessly adapted across smartphones, tablets, and desktops with intuitive touch navigation and modern layout precision.",
    icon: Smartphone,
  },
  {
    title: "Swift 7–14 Day Delivery",
    desc: "Direct partnership with no agency bureaucracy or endless meetings. Your project moves with momentum and crystal-clear milestones.",
    icon: CheckCircle2,
  },
];

export function AboutMe() {
  return (
    <section id="about" className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 max-w-7xl mx-auto text-[#0D2626] overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">About Zauqode</span>
        <h2 className="font-editorial text-[clamp(1.85rem,5vw,3.5rem)] text-[#0D2626] mt-2 leading-tight">
          Websites crafted for businesses
          <br />
          <span className="italic text-[#0D9488]">that mean business.</span>
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#3D6060] leading-relaxed max-w-2xl mx-auto">
          <strong>Zauqode</strong> is a specialized digital studio dedicated exclusively to building websites. 
          No multitasking multiple unrelated services — just deep, intentional focus on making your website look world-class and perform effortlessly.
        </p>
      </motion.div>

      {/* Industries Covered Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-10 sm:mb-12 p-4 sm:p-8 rounded-3xl liquid-glass-card border border-[#0D9488]/15"
      >
        <div className="text-center mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#0D9488]">
            Industries Zauqode Builds For
          </p>
          <p className="text-xs text-[#3D6060] mt-1">
            Tailored digital solutions across retail, trade, commercial, and personal sectors
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white/60 border border-[#0D9488]/10 text-[#0D2626] shadow-2xs hover:border-[#0D9488]/30 hover:bg-white transition-all duration-200 min-w-0"
              >
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold leading-snug break-words">{ind.name}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* 4 Client-Attracting Value Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-12">
        {keyPoints.map((point, idx) => {
          const Icon = point.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3 }}
              className="p-5 sm:p-6 rounded-2xl liquid-glass-card border border-[#0D9488]/15 hover:border-[#0D9488]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0D9488]/15 text-[#0D9488] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#0D2626] mb-2">{point.title}</h3>
                <p className="text-xs text-[#3D6060] leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Animated stats counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-3 gap-2.5 sm:gap-6 max-w-2xl mx-auto mb-8 sm:mb-10"
      >
        <StatCounter value={5} suffix="+" label="Websites Delivered" />
        <StatCounter value={100} suffix="%" label="Client Satisfaction" />
        <StatCounter value={7} suffix=" days" label="Avg. Turnaround" />
      </motion.div>

      {/* Direct CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <a
          href={`https://wa.me/${WHATSAPP_RAW}?text=Hi%20Zauqode,%20I'd%20like%20to%20discuss%20a%20website%20for%20my%20business`}
          target="_blank"
          rel="noreferrer"
          aria-label="Discuss your project on WhatsApp"
          className="inline-flex items-center justify-center gap-2.5 liquid-glass-dark px-8 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[46px] w-full sm:w-auto"
        >
          <svg className="w-4 h-4 fill-current flex-shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Discuss Your Project
        </a>
      </motion.div>
    </section>
  );
}
