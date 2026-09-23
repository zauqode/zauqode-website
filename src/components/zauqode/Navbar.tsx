import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

const navLinks = [
  { name: "Home", href: "#top" },
  { name: "About", href: "#about" },
  { name: "Pricing", href: "#pricing" },
  { name: "Process", href: "#process" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 30;
    if (scrolled !== isScrolled) setScrolled(isScrolled);

    // If near top, mark Home as active
    if (latest < 200) {
      if (activeSection !== "top") setActiveSection("top");
      return;
    }

    // Dynamic active section detection
    const sections = ["top", "about", "pricing", "wedding-services", "process", "faq", "contact"];
    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 260 && rect.bottom >= 120) {
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
          ? "bg-white/85 backdrop-blur-md border-b border-[#0D9488]/15 py-3 sm:py-4 shadow-lg shadow-teal-100/30"
          : "bg-transparent py-4 sm:py-6"
      } pt-[calc(0.75rem+env(safe-area-inset-top,0px))]`}
    >
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 w-full"
      >
        {/* Zauqode Brand Logo with Alice Font */}
        <a href="#top" data-cursor="button" className="flex items-center gap-2.5 sm:gap-3 group">
          <img
            src={zauqodeLogo}
            alt="ZAUQODE"
            width={36}
            height={36}
            className="h-8 sm:h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-md"
          />
          <span className="font-alice text-xl sm:text-2xl tracking-[0.25em] text-[#0D9488] font-normal">
            ZAUQODE
          </span>
        </a>

        {/* Desktop Nav Links with Minimal Underline Draw */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.replace("#", "");
            return (
              <a
                key={link.name}
                href={link.href}
                data-cursor="button"
                className={`nav-link-underline text-xs font-semibold uppercase tracking-widest ${
                  isActive ? "active text-[#0D9488]" : "text-[#0D2626]"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </div>

        {/* Action CTA & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:block">
            <a
              href="#contact"
              className="liquid-glass-dark inline-block px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:scale-[1.03] transition-all duration-300"
            >
              Start a Project
            </a>
          </div>

          {/* Mobile Menu Toggle Button (Touch Friendly 44x44px minimum target) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden w-11 h-11 rounded-full flex items-center justify-center bg-white/70 backdrop-blur-md border border-[#0D9488]/25 text-[#0D9488] hover:bg-[#0D9488]/10 transition-colors shadow-xs"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Expanding Glass Panel & Full Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/35 backdrop-blur-xs z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Floating Drawer Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto absolute top-full mt-2 left-4 right-4 rounded-3xl p-6 md:hidden flex flex-col gap-3 shadow-2xl z-50 border border-[#0D9488]/25 bg-white/95 backdrop-blur-2xl text-[#0D2626]"
            >
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.href.replace("#", "");
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`text-base font-semibold transition-colors py-3 px-3 rounded-xl flex items-center justify-between min-h-[44px] ${
                        isActive
                          ? "bg-[#0D9488]/10 text-[#0D9488] font-bold"
                          : "text-[#0D2626] hover:bg-[#0D9488]/5"
                      }`}
                    >
                      <span>{link.name}</span>
                      <span className="text-xs text-[#0D9488]">→</span>
                    </a>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#0D9488]/15 flex flex-col gap-2.5">
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="liquid-glass-dark text-center rounded-full py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg min-h-[44px] flex items-center justify-center"
                >
                  Start a Project
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

