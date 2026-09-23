import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { HeroBackground } from "./HeroBackground/HeroBackground";
import heroDeveloperImg from "../../assets/hero-developer.jpg";

const WHATSAPP_RAW = "918946077234";

// Magnetic Button component
function MagneticButton({ children, className, href }: { children: React.ReactNode; className?: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 22 });
  const springY = useSpring(y, { stiffness: 280, damping: 22 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}

// Animated scroll-cue chevron
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const leftY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const rightY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const words1 = ["Solving", "problems,"];
  const words2 = ["with", "digital", "solutions."];

  return (
    <section
      id="top"
      ref={containerRef}
      className="relative overflow-hidden select-none bg-transparent text-[#0D2626] min-h-[100dvh] flex flex-col justify-center"
    >
      {/* RIGHT PANEL — background visual fills entire section behind */}
      <div className="absolute inset-0 z-0">
        <HeroBackground />
      </div>

      {/* SPLIT GRID */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-2 min-h-[100dvh] items-center pt-[calc(5.5rem+env(safe-area-inset-top,0px))] sm:pt-28 lg:pt-28 pb-10 sm:pb-14 lg:pb-16 gap-8 lg:gap-12">

        {/* LEFT PANEL — text content */}
        <motion.div
          style={{ y: leftY }}
          className="flex flex-col justify-center py-2"
        >
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-[#0D9488]/40 bg-[#0D9488]/10 backdrop-blur-md px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#0D9488] mb-4 sm:mb-5 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            Freelance Digital Studio
          </motion.div>

          {/* Headline with fluid clamp typography */}
          <div className="mb-4 sm:mb-5">
            <h1 className="font-editorial text-[clamp(2.15rem,6.5vw,3.85rem)] leading-[1.12] sm:leading-[1.1] text-[#0D2626] break-words">
              <span className="block mb-1 sm:whitespace-nowrap">
                {words1.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-2 sm:mr-3.5">
                    <motion.span
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ duration: 0.85, delay: 0.55 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
              <span className="block italic text-[#0D9488] sm:whitespace-nowrap">
                {words2.map((word, i) => (
                  <span key={i} className="inline-block overflow-hidden mr-2 sm:mr-3.5">
                    <motion.span
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{ duration: 0.85, delay: 0.78 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="inline-block"
                    >
                      {word}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>
          </div>

          {/* Sub-copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base lg:text-lg text-[#3D6060] leading-relaxed max-w-lg mb-6 sm:mb-8"
          >
            Zauqode crafts thoughtfully designed websites for businesses, celebrations,
            and personal brands — where taste meets digital.
          </motion.p>

          {/* CTAs with comfortable touch targets */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
          >
            {/* Magnetic primary CTA */}
            <MagneticButton
              href="#pricing"
              className="liquid-glass-dark px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 text-center min-h-[46px] flex items-center justify-center"
            >
              View Pricing
            </MagneticButton>

            {/* Secondary CTA */}
            <MagneticButton
              href="#contact"
              className="liquid-glass px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#0D2626] shadow-lg transition-all duration-300 text-center min-h-[46px] flex items-center justify-center"
            >
              Start a Project →
            </MagneticButton>
          </motion.div>

          {/* Trust line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9, duration: 0.7 }}
            className="mt-6 sm:mt-8 flex items-center gap-3 text-xs text-[#3D6060]"
          >
            <span className="flex -space-x-1 flex-shrink-0">
              {["#0D9488", "#136262", "#0F6B6B"].map((c, i) => (
                <span key={i} className="w-6 h-6 rounded-full border-2 border-white/80" style={{ background: c }} />
              ))}
            </span>
            <span>Trusted by businesses &amp; creators across India</span>
          </motion.div>

          {/* Mobile Illustration with aspect ratio to prevent CLS */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mt-7 max-w-[280px] sm:max-w-xs mx-auto relative w-full"
          >
            <div className="liquid-glass-card p-2.5 rounded-2xl border border-[#0D9488]/20 shadow-xl overflow-hidden aspect-[4/5]">
              <img
                src={heroDeveloperImg}
                alt="Web Developer & Designer"
                width={320}
                height={400}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT PANEL — Desktop Bespoke Illustration */}
        <motion.div
          style={{ y: rightY }}
          className="hidden lg:flex items-center justify-center py-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md xl:max-w-lg"
          >
            {/* Ambient teal glow behind illustration */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#0D9488]/20 via-[#2DD4BF]/25 to-transparent rounded-3xl blur-2xl -z-10 pointer-events-none" />

            {/* Framed illustration card */}
            <div className="liquid-glass-card p-3 sm:p-4 rounded-3xl border border-[#0D9488]/20 shadow-2xl overflow-hidden group">
              <div className="relative rounded-2xl overflow-hidden bg-white/70 aspect-[4/5]">
                <img
                  src={heroDeveloperImg}
                  alt="Zauqode — Web Design & Development"
                  width={480}
                  height={600}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0D9488]/5 via-transparent to-white/20 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
