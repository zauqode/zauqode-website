import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check, Sparkles, ArrowUpRight, Heart, Mail, Globe, MessageCircle, Briefcase } from "lucide-react";

const WHATSAPP_RAW = "918946077234";

const packages = [
  {
    id: "whatsapp-suite",
    name: "The WhatsApp Suite",
    badge: "MOBILE & SHAREABLE",
    desc: "Sleek animated mobile invitation suite designed for effortless sharing on WhatsApp and Instagram.",
    originalPrice: "₹7,999",
    price: "₹4,999",
    period: "/invitation",
    subtext: "Delivered in 3–5 days • One-time investment",
    features: [
      "Bespoke animated mobile invitation card",
      "WhatsApp shareable link with custom preview image",
      "Embedded background music / soundtrack",
      "Interactive 1-tap Google Maps venue direction",
      "Digital RSVP response capture",
      "2 rounds of wording & color revisions",
      "Hosted & active through your celebration",
    ],
    cta: "Inquire WhatsApp Suite",
    waMessage: "Hi Zauqode, I'd like to book the WhatsApp Animated Invitation Suite (₹4,999) for my celebration.",
    highlight: false,
  },
  {
    id: "signature-portal",
    name: "Signature Wedding Portal",
    badge: "MOST CHOSEN BY COUPLES",
    desc: "Complete luxury celebration website narrating your story, guiding guests, and managing RSVPs seamlessly.",
    originalPrice: "₹19,999",
    price: "₹12,999",
    period: "/celebration",
    subtext: "Delivered in 7–10 days • Priority sprint focus",
    features: [
      "Full multi-event website (Mehendi, Sangeet, Nikkah, Reception)",
      "Real-time guest RSVP sync directly to private Google Sheets",
      "Interactive Google Maps routing for each event venue",
      "Curated ambient music player with play/pause control",
      "Couple story timeline & high-res photo gallery",
      "Live celebration countdown clock & dress code guide",
      "3 rounds of design & typography refinements",
      "Hosted with SSL security & custom domain assistance",
    ],
    cta: "Choose Signature Portal",
    waMessage: "Hi Zauqode, I'd like to book the Signature Wedding Portal (₹12,999) for our wedding.",
    highlight: true,
  },
  {
    id: "haute-atelier",
    name: "Haute Couture Suite",
    badge: "DIGITAL + PRINT READY",
    desc: "The ultimate celebration experience combining a luxury digital portal with matching physical print stationery.",
    originalPrice: "₹29,999",
    price: "₹21,999",
    period: "/bespoke scope",
    subtext: "Turnaround structured to scope • Dedicated atelier service",
    features: [
      "Complete Signature Wedding Website Portal",
      "Matching 300 DPI print-ready stationery for local printing",
      "Individual animated Save The Date cards for WhatsApp",
      "Interactive guest wishes wall & photo collection",
      "Dedicated host dashboard & RSVP management support",
      "Priority turnaround & flexible revision rounds",
      "Direct consultation throughout your planning journey",
    ],
    cta: "Discuss Haute Couture Suite",
    waMessage: "Hi Zauqode, I'd like to discuss the Haute Couture Suite (₹21,999) for my celebration.",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto text-[#0D2626]">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#0D9488]/8 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 rounded-full border border-[#0D9488]/30 bg-white/70 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.25em] text-[#0D9488] mb-3"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
          <span>Curated Collections &amp; Investment</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-editorial text-[clamp(2.1rem,5vw,3.75rem)] text-[#0D2626] leading-tight"
        >
          Transparent packages,
          <br />
          <span className="italic font-heading text-[#0D9488]">crafted for unforgettable moments.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-[#3D6060] max-w-xl mx-auto mt-4 leading-relaxed"
        >
          Fixed pricing with clear milestones and no hidden fees. Choose your ideal celebration format or contact me for a tailored quote.
        </motion.p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch mb-12">
        {packages.map((pkg, idx) => {
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                pkg.highlight
                  ? "liquid-glass-card border-2 border-[#0D9488]/50 shadow-2xl bg-white/90 ring-4 ring-[#0D9488]/10 md:-translate-y-2"
                  : "liquid-glass-card border border-white/70 shadow-lg bg-white/70 backdrop-blur-xl hover:border-[#0D9488]/30"
              }`}
            >
              {/* Highlight ribbon */}
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-[#0D9488] text-white shadow-md">
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div>
                {!pkg.highlight && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D9488] mb-2">
                    {pkg.badge}
                  </span>
                )}

                <h3 className="font-editorial text-2xl sm:text-3xl text-[#0D2626] font-normal tracking-wide">
                  {pkg.name}
                </h3>
                <p className="text-xs sm:text-sm text-[#3D6060] mt-2 mb-5 leading-relaxed">
                  {pkg.desc}
                </p>

                {/* Pricing display */}
                <div className="py-4 border-y border-[#0D9488]/15 mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#3D6060]/70 line-through">
                      {pkg.originalPrice}
                    </span>
                    <span className="font-numeric text-3xl sm:text-4xl font-bold text-[#0D9488] tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-[#3D6060] font-medium">
                      {pkg.period}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3D6060] mt-1 font-medium">
                    {pkg.subtext}
                  </p>
                </div>

                {/* Features list */}
                <div className="space-y-2.5 mb-8">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-[#0D2626]">
                      <span className="w-4 h-4 rounded-full bg-[#0D9488]/15 text-[#0D9488] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={`https://wa.me/${WHATSAPP_RAW}?text=${encodeURIComponent(pkg.waMessage)}`}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-3.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 shadow-md ${
                  pkg.highlight
                    ? "liquid-glass-dark text-white hover:scale-[1.02]"
                    : "liquid-glass text-[#0D2626] hover:bg-[#0D9488]/10 hover:text-[#0D9488]"
                }`}
              >
                <span>{pkg.cta}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          );
        })}
      </div>

      {/* Commercial & Brand Websites Callout Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="liquid-glass-card rounded-3xl p-6 sm:p-8 border border-[#0D9488]/20 bg-white/70 backdrop-blur-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#0D9488]/10 text-[#0D9488] flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-editorial text-xl sm:text-2xl text-[#0D2626] font-normal">
              Looking for a Business or Creator Portfolio Website?
            </h4>
            <p className="text-xs sm:text-sm text-[#3D6060] mt-1">
              I apply the exact same couture design aesthetic to corporate platforms, architectural showcases, and personal brands.
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${WHATSAPP_RAW}?text=Hi%20Zauqode,%20I'd%20like%20to%20discuss%20a%20Business%20or%20Portfolio%20Website.`}
          target="_blank"
          rel="noreferrer"
          className="liquid-glass-dark text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 shadow-md flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <span>Discuss Business Website</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </motion.div>
    </section>
  );
}
