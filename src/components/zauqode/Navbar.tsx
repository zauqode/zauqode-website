import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";

const navLinks = [
  { name: "Home", href: "#hero" },
  { name: "I Craft", href: "#craft" },
  { name: "Contact", href: "#contact" },
];

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setMobileOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = original;
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [mobileOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 20);

    const sections = ["hero", "craft", "contact"];
    for (const section of sections) {
      const el = document.getElementById(section);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 240 && rect.bottom >= 80) {
          setActiveSection(section);
          break;
        }
      }
    }
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#F7F5EF]/95 backdrop-blur-md border-b border-[#0E4847]/10 py-4 shadow-xs"
          : "bg-[#F7F5EF]/80 backdrop-blur-xs border-b border-[#0E4847]/10 py-5 sm:py-6"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between">
        {/* Left: Brand Wordmark Zauqode® */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-85"
        >
          <img
            src={zauqodeLogo}
            alt="Zauqode"
            width={26}
            height={26}
            className="w-6 h-6 object-contain"
          />
          <span className="font-alice text-lg sm:text-xl text-[#0E4847] font-normal tracking-wide">
            Zauqode
          </span>
        </a>

        {/* Right: Desktop Navigation Links + Circular Action */}
        <div className="hidden md:flex items-center gap-8 lg:gap-10">
          <div className="flex items-center gap-7 lg:gap-9">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace("#", "");
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-wide font-medium transition-colors relative py-1 ${
                    isActive ? "text-[#0E4847] font-semibold" : "text-[#0E4847]/70 hover:text-[#0E4847]"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="header-active-line"
                      className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-[#0E8F91]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Minimal circular menu / quick contact trigger */}
          <a
            href="#contact"
            className="w-9 h-9 rounded-full border border-[#0E4847]/20 flex items-center justify-center text-[#0E4847] hover:border-[#0E4847] hover:bg-[#0E4847] hover:text-[#F7F5EF] transition-all duration-300"
            title="Get in touch"
            aria-label="Contact Studio"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle (Circular Minimal Control) */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-10 h-10 rounded-full border border-[#0E4847]/20 flex items-center justify-center text-[#0E4847] hover:bg-[#0E4847]/5 focus:outline-none transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Refined Full-Screen Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed inset-0 top-[69px] bg-[#F7F5EF] px-8 py-12 flex flex-col justify-between z-40"
          >
            <div className="space-y-6">
              <span className="text-xs tracking-wider text-[#0E8F91] font-semibold block">
                Menu
              </span>
              <div className="flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-editorial text-3xl text-[#0E4847] hover:text-[#0E8F91] transition-colors py-1.5 border-b border-[#0E4847]/10 flex items-center justify-between group"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#C9A66B] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-[#0E4847]/10 space-y-3">
              <p className="text-xs text-[#0E4847]/60 font-sans">
                Independent Creative Studio &bull; Worldwide
              </p>
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full text-center"
              >
                Let's Create Together
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
