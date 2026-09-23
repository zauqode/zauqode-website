import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, Globe, Mail, Palette, Sparkles, ArrowUpRight } from "lucide-react";

const WHATSAPP_RAW = "918946077234";

const plans = [
  {
    id: "starter",
    name: "Starter",
    badge: "Essential",
    desc: "Get your first website online. Perfect for startups, portfolios, and local service businesses.",
    originalPrice: "₹11,999",
    price: "₹7,999",
    period: "/project",
    subtext: "Delivery in 5–7 days • Transparent fixed pricing",
    features: [
      "High-converting landing page",
      "Clean, mobile-responsive layout",
      "Instant inquiry & lead capture setup",
      "Contact form integration",
      "Basic on-page SEO setup",
      "2 rounds of revisions included",
      "Full deployment assistance",
    ],
    cta: "Choose Starter",
    highlight: false,
  },
  {
    id: "business",
    name: "Business",
    badge: "Most Comprehensive",
    desc: "Complete multi-page digital presence engineered for growing brands and higher conversion.",
    originalPrice: "₹21,999",
    price: "₹14,999",
    period: "/project",
    subtext: "Delivery in 10–12 days • Priority sprint focus",
    features: [
      "Up to 5 custom-designed pages",
      "Premium UI/UX bespoke craft",
      "Instant lead capture integration",
      "Advanced SEO & metadata indexing",
      "Smooth modern micro-animations",
      "3 rounds of revisions included",
      "Full deployment assistance",
    ],
    cta: "Choose Business",
    highlight: true,
  },
  {
    id: "custom",
    name: "Custom",
    badge: "Full Bespoke",
    desc: "Dedicated power for unique requirements, bespoke architectures, or high-touch projects.",
    originalPrice: "Custom Scope",
    price: "Let's Talk",
    period: "tailored quote",
    subtext: "Scoped timeline • Direct studio partnership",
    features: [
      "Unlimited custom pages & sections",
      "Complete bespoke design system",
      "Custom interactive digital experiences",
      "E-commerce / booking integrations",
      "Ongoing paid maintenance option",
      "Flexible revisions structured to scope",
      "Direct consultation & handover",
    ],
    cta: "Discuss Your Vision",
    highlight: false,
  },
];

const weddingServices = [
  {
    id: "wedding-websites",
    name: "Wedding Websites",
    badge: "FULL DIGITAL EXPERIENCE",
    icon: Globe,
    desc: "Bespoke celebration spaces crafted to narrate your love story, guide your guests, and showcase every moment in style.",
    scopeBadge: "Tailored to Your Scope",
    waMessage: "Hi Zauqode, I'd like to discuss a custom Wedding Website.",
  },
  {
    id: "digital-invitations",
    name: "Digital Wedding Invitations",
    badge: "ANIMATED & MOBILE-FIRST",
    icon: Mail,
    desc: "Interactive, modern digital invitations designed for effortless WhatsApp & social sharing with reveal animations and audio. For invitation printing also, designs are delivered in printable format.",
    scopeBadge: "Flexible & Shareable",
    waMessage: "Hi Zauqode, I'd like to discuss Digital Wedding Invitations.",
  },
];

function CheckmarkItem({
  text,
  dark = false,
  gold = false,
  delay,
}: {
  text: string;
  dark?: boolean;
  gold?: boolean;
  delay: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  let badgeBg = "bg-[#0D9488]/15 text-[#0D9488]";
  if (gold) {
    badgeBg = "bg-[#C5A880]/20 text-[#8F6A28]";
  } else if (dark) {
    badgeBg = "bg-[#2DD4BF]/20 text-[#2DD4BF]";
  }

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, x: -8 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 text-xs sm:text-sm ${
        dark ? "text-white/85" : "text-[#3D6060]"
      }`}
    >
      <span
        className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${badgeBg}`}
      >
        <Check className="w-2.5 h-2.5 stroke-[3]" />
      </span>
      <span className="leading-snug">{text}</span>
    </motion.li>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-8 sm:py-10 lg:py-12 px-4 sm:px-6 max-w-7xl mx-auto text-[#0D2626] overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#C5A880]/8 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#0D9488]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Website Pricing Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-12"
      >
        <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#0D9488]">Investment</span>
        <h2 className="font-editorial text-[clamp(1.85rem,5vw,3.5rem)] text-[#0D2626] mt-1 mb-2">
          Simple, honest pricing<span className="text-[#0D9488]">.</span>
        </h2>
        <p className="text-[#3D6060] text-sm sm:text-base max-w-md mx-auto">
          Transparent pricing with no hidden fees. Every project is a partnership.
        </p>
      </motion.div>

      {/* 3-Tier Website Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-lg lg:max-w-none mx-auto">
        {plans.map((plan, idx) => {
          const isDark = plan.highlight;

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col"
            >
              <div
                className={`flex flex-col flex-1 p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
                  isDark
                    ? "bg-gradient-to-b from-[#0F2F2F] to-[#0A1F1F] text-white border border-[#0D9488]/40 shadow-2xl shadow-teal-950/30 ring-1 ring-[#0D9488]/30"
                    : "bg-white/80 backdrop-blur-xl border border-[#0D9488]/15 text-[#0D2626] shadow-lg shadow-teal-950/5 hover:border-[#0D9488]/35 hover:shadow-xl"
                }`}
              >
                {/* Header: Title & Pill Tag */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className={`text-2xl sm:text-3xl font-bold font-editorial ${isDark ? "text-white" : "text-[#0D2626]"}`}>
                    {plan.name}
                  </h3>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 rounded-full shrink-0 text-center ${
                      isDark
                        ? "bg-[#2DD4BF]/20 text-[#2DD4BF] border border-[#2DD4BF]/30"
                        : "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>

                {/* Tagline Description */}
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 min-h-[38px] ${isDark ? "text-white/75" : "text-[#3D6060]"}`}>
                  {plan.desc}
                </p>

                {/* Pricing Block */}
                <div className="mb-6">
                  {plan.originalPrice && (
                    <div className={`text-xs line-through mb-1 ${isDark ? "text-white/40" : "text-[#3D6060]/60"}`}>
                      {plan.originalPrice}
                    </div>
                  )}
                  <div className="flex flex-wrap items-baseline gap-1.5">
                    <span className={`text-3xl sm:text-4xl font-bold tracking-tight font-numeric ${isDark ? "text-white" : "text-[#0D2626]"}`}>
                      {plan.price}
                    </span>
                    <span className={`text-xs lowercase ${isDark ? "text-white/60" : "text-[#3D6060]/75"}`}>
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* Primary CTA Button */}
                <a
                  href={`https://wa.me/${WHATSAPP_RAW}?text=Hi%20Zauqode,%20I'd%20like%20to%20get%20started%20with%20the%20${plan.name}%20plan.`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full text-center py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 min-h-[46px] flex items-center justify-center shadow-sm ${
                    isDark
                      ? "bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-lg shadow-[#0D9488]/30 hover:scale-[1.01]"
                      : "border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </a>

                {/* Subtext under button */}
                <p className={`text-[11px] text-center mt-3 mb-6 ${isDark ? "text-white/60" : "text-[#3D6060]/70"}`}>
                  {plan.subtext}
                </p>

                {/* Divider */}
                <div className={`h-px mb-6 ${isDark ? "bg-white/10" : "bg-[#0D9488]/15"}`} />

                {/* Feature Checklist */}
                <ul className="space-y-3.5 flex-1">
                  {plan.features.map((feature, fIdx) => (
                    <CheckmarkItem key={feature} text={feature} dark={isDark} delay={fIdx * 0.05} />
                  ))}
                </ul>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Note below all 3 website cards */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-[12px] sm:text-xs text-[#3D6060]/75 max-w-xl mx-auto mt-7 sm:mt-8 leading-relaxed font-sans"
      >
        Prices exclude domain, hosting &amp; database charges. Extra revisions beyond included rounds are available with additional charges. Every package includes a free consultation call to understand your vision before we begin.
      </motion.p>

      {/* Elegant Wedding Transition Divider */}
      <div className="relative my-14 sm:my-20 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C5A880]/35 to-transparent" />
        </div>
        <div className="relative bg-[#f5fdf9] px-5 py-1.5 flex items-center gap-2.5 rounded-full border border-[#C5A880]/20 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#B38E5D]" />
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#9E7A36]">
            Bespoke Celebration Craft
          </span>
          <Sparkles className="w-3.5 h-3.5 text-[#B38E5D]" />
        </div>
      </div>

      {/* WEDDING DESIGN SERVICES SECTION */}
      <div id="wedding-services" className="relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A880]/12 border border-[#C5A880]/30 text-[#9E7A36] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#B38E5D]" />
            WEDDING DESIGN SERVICES
          </div>
          <h2 className="font-editorial text-[clamp(1.85rem,5vw,3.5rem)] text-[#0D2626] mt-1 mb-3">
            Your wedding, your way<span className="text-[#B38E5D]">.</span>
          </h2>
          <p className="text-[#3D6060] text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            From beautiful digital invitations to personalized wedding websites, we create everything around your wedding theme, preferences, and story.
          </p>
        </motion.div>

        {/* 2 Elegant Service Cards (No Fixed Prices) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
          {weddingServices.map((service, sIdx) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: sIdx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col group"
              >
                <div className="flex flex-col flex-1 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/95 via-white/85 to-[#FAF8F5]/90 backdrop-blur-xl border border-[#C5A880]/25 text-[#0D2626] shadow-lg shadow-amber-950/5 hover:border-[#C5A880]/50 hover:shadow-2xl hover:shadow-amber-950/10 transition-all duration-300">
                  {/* Service Card Top: Icon & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0D9488]/15 via-[#C5A880]/20 to-[#0D9488]/10 border border-[#C5A880]/30 flex items-center justify-center text-[#0F6B6B] group-hover:scale-105 group-hover:border-[#C5A880]/60 transition-transform duration-300">
                      <Icon className="w-5 h-5 text-[#0F6B6B]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C5A880]/15 text-[#8F6A28] border border-[#C5A880]/25 whitespace-nowrap">
                      {service.badge}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-[#0D2626] mb-2">
                    {service.name}
                  </h3>

                  {/* Tagline Description */}
                  <p className="text-xs sm:text-sm text-[#3D6060] leading-relaxed mb-6 md:min-h-[72px] min-h-[56px]">
                    {service.desc}
                  </p>

                  {/* Tailored Scope indicator tag (NO numbers) */}
                  <div className="mb-6 p-3 rounded-xl bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#8F6A28] uppercase tracking-wide">
                      Pricing Structure
                    </span>
                    <span className="text-xs font-medium text-[#0F6B6B] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#0D9488]/15">
                      Tailored Quote
                    </span>
                  </div>

                  {/* Card Direct WhatsApp Action */}
                  <a
                    href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(service.waMessage)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full text-center py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white transition-all duration-300 min-h-[46px] flex items-center justify-center shadow-sm"
                  >
                    Inquire About This Service
                  </a>

                  {/* Subtext under button */}
                  <p className="text-[11px] text-center mt-3 text-[#8F6A28]/85 font-medium">
                    ✦ {service.scopeBadge}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

