import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";


const navLinks = [
  { name: "Home", href: "#top" },
  { name: "Services", href: "#services" },
  { name: "Work", href: "#work" },
  { name: "Process", href: "#process" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 40;
    if (scrolled !== isScrolled) setScrolled(isScrolled);

    // Dynamic active section detection
    const sections = ["top", "services", "work", "process", "contact"];
    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 300 && rect.bottom >= 150) {
          if (activeSection !== section) setActiveSection(section);
          break;
        }
      }
    }
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-md border-b border-[#2DD4BF]/10 py-4 shadow-xl"
          : "bg-transparent py-6"
      }`}
    >
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4 w-full"
      >
        {/* Zauqode Brand Logo with Alice Font */}
        <a href="#top" data-cursor="button" className="flex items-center gap-3 group">
          <img
            src={zauqodeLogo}
            alt="ZAUQODE"
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md"
          />
          <span className="font-alice text-xl sm:text-2xl tracking-[0.25em] text-[#2DD4BF] font-normal">
            ZAUQODE
          </span>
        </a>

        {/* Desktop Nav Links with Shared LayoutId Active Pill */}
        <div className="hidden md:flex items-center gap-1 bg-[#050505]/40 p-1.5 rounded-full backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.name}
                href={link.href}
                data-cursor="button"
                className={`relative px-4 py-1.5 text-xs font-semibold uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? "text-[#2DD4BF]" : "text-[#94A3B8] hover:text-[#FDFBF7]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute inset-0 bg-[#136262]/60 rounded-full shadow-inner border border-[#2DD4BF]/50"
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            );
          })}
        </div>

        {/* Action CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <a
              href="#contact"
              className="inline-block rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-widest bg-[#2DD4BF] text-[#050505] hover:bg-[#14B8A6] hover:scale-105 transition-all shadow-[0_0_15px_rgba(45,212,191,0.25)]"
            >
              Start a Project
            </a>
          </div>


          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden glass-button-secondary rounded-full p-2.5 text-[#2DD4BF]"
            aria-label="Toggle Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Expanding Glass Panel */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="pointer-events-auto absolute top-20 left-4 right-4 glass-card rounded-3xl p-6 md:hidden flex flex-col gap-4 shadow-2xl z-50 border-white/20 bg-[#080E0D]/95 backdrop-blur-2xl text-[#FDFBF7]"
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-semibold text-[#FDFBF7] hover:text-[#2DD4BF] transition-colors py-2 border-b border-white/05"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="liquid-glass-dark text-center rounded-full py-3 text-xs font-bold uppercase tracking-widest mt-2 text-white"
          >
            Start a Project
          </a>
        </motion.div>
      )}
    </header>
  );
}
