"use client";

import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hero } from "@/components/zauqode-home/Hero";
import { ArrowIcon } from "@/components/zauqode-home/ArrowIcon";
import { PortfolioCard } from "./PortfolioCard";
import {
  HOME_SELECTED_WORKS,
  INVITATION_WORKS,
  PORTFOLIO_WORKS,
  TESTIMONIALS,
  WHY_PILLARS,
  type ActiveMockupState,
  type WorkItem,
} from "./portfolioData";
import { getAdminDataFn, type AdminWork } from "@/lib/adminServerFns";
import "./RenovatedPortfolio.css";

const WorksCatalogueView = lazy(() =>
  import("./WorksCatalogueView").then((m) => ({ default: m.WorksCatalogueView }))
);
const InvitationShowcaseModal = lazy(() =>
  import("./InvitationShowcaseModal").then((m) => ({ default: m.InvitationShowcaseModal }))
);
const MobileMockupModal = lazy(() =>
  import("./MobileMockupModal").then((m) => ({ default: m.MobileMockupModal }))
);

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "works", label: "Works" },
  { id: "contact", label: "Contact" },
] as const;

const PROCESS_STEPS = [
  {
    num: "01",
    title: "Share your story",
    description: "Tell me your wishes, your style and your date. I listen first.",
  },
  {
    num: "02",
    title: "I design",
    description: "Your feelings become a custom invitation, made with detail and care.",
  },
  {
    num: "03",
    title: "Printing, arranged for you",
    description:
      "Printing depends on my work schedule. When it is full, my trusted premium printing partners handle it with the same quality. I arrange everything, so you only enjoy the design.",
  },
  {
    num: "04",
    title: "Delivered with love",
    description: "Every detail is checked, and your invitation reaches you ready to share.",
  },
] as const;

function mapAdminWorkToWorkItem(w: AdminWork): WorkItem {
  return {
    id: w.id,
    name: w.name,
    sub: w.sub || w.label || "Custom Creation",
    category: (w.category as any) || "websites",
    label: w.label || "WEDDING WEBSITE",
    thumb: w.thumbUrl,
    url: w.liveUrl,
    videoUrl: w.videoUrl,
    canIframe: (w.category === "websites" || w.category === "business") && !!w.liveUrl,
    story: w.story || `Bespoke digital creation for ${w.name}.`,
    occasion: w.occasion || (w.category === "websites" ? "Wedding Celebration" : "Celebration"),
  };
}

export function RenovatedPortfolio() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [curtainActive, setCurtainActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeMockup, setActiveMockup] = useState<ActiveMockupState | null>(null);
  const [activeInvitationIndex, setActiveInvitationIndex] = useState<number | null>(null);
  const [marqueeVisible, setMarqueeVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [dynamicWorks, setDynamicWorks] = useState<WorkItem[]>([]);
  const [featuredHomeIds, setFeaturedHomeIds] = useState<string[] | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Load dynamically published works and home showcase curation from Vercel Blob cloud store
  useEffect(() => {
    let mounted = true;
    getAdminDataFn()
      .then((data) => {
        if (!mounted) return;
        if (data?.works) {
          const visible = data.works
            .filter((w) => !w.hidden)
            .map(mapAdminWorkToWorkItem);
          setDynamicWorks(visible);
        }
        if (data?.featuredHomeIds) {
          setFeaturedHomeIds(data.featuredHomeIds);
        }
      })
      .catch((err) => {
        console.error("Failed to load cloud works:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const allCatalogueWorks = useMemo(() => {
    return [...dynamicWorks, ...PORTFOLIO_WORKS];
  }, [dynamicWorks]);

  const homeWorks = useMemo(() => {
    // Combine all available works (cloud uploads + built-in catalogue)
    const map = new Map<string, WorkItem>();
    PORTFOLIO_WORKS.forEach((w) => map.set(w.id, w));
    dynamicWorks.forEach((w) => map.set(w.id, w));

    if (featuredHomeIds && featuredHomeIds.length > 0) {
      const selected = featuredHomeIds
        .map((id) => map.get(id))
        .filter((w): w is WorkItem => Boolean(w));
      if (selected.length > 0) {
        return selected;
      }
    }

    return [...dynamicWorks, ...HOME_SELECTED_WORKS];
  }, [dynamicWorks, featuredHomeIds]);

  const allInvitations = useMemo(() => {
    const dynamicInvs = dynamicWorks.filter(
      (w) => w.category === "invitations" || w.category === "stalls"
    );
    return [...dynamicInvs, ...INVITATION_WORKS];
  }, [dynamicWorks]);

  const marqueeRef = useRef<HTMLDivElement>(null);
  const currentRouteRef = useRef(currentRoute);
  currentRouteRef.current = currentRoute;

  const [form, setForm] = useState({
    name: "",
    eventDate: "",
    city: "",
    service: "",
    message: "",
  });

  // Track scrolled state passively for frosted glassmorphism navbar
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const scrolled = window.scrollY > 16;
      setIsScrolled((prev) => (prev !== scrolled ? scrolled : prev));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close modals on Escape key & arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMockup(null);
        setActiveInvitationIndex(null);
        setMobileMenuOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveInvitationIndex((prev) =>
          prev !== null ? (prev - 1 + allInvitations.length) % allInvitations.length : null
        );
      } else if (e.key === "ArrowRight") {
        setActiveInvitationIndex((prev) =>
          prev !== null ? (prev + 1) % allInvitations.length : null
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hash Routing without re-registering listener on state flips
  useEffect(() => {
    let switchTimer: number | undefined;
    let closeTimer: number | undefined;

    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "about" || hash === "services" || hash === "contact") {
        setCurrentRoute("home");
        setMobileMenuOpen(false);
        window.setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }, 60);
        return;
      }

      const validRoutes = ["home", "about", "services", "works", "contact"];
      const target = validRoutes.includes(hash) ? hash : "home";
      const allowCurtain = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

      if (target !== currentRouteRef.current && allowCurtain) {
        setCurtainActive(true);
        switchTimer = window.setTimeout(() => {
          setCurrentRoute(target);
          window.scrollTo(0, 0);
          closeTimer = window.setTimeout(() => setCurtainActive(false), 320);
        }, 280);
      } else {
        setCurrentRoute(target);
        window.scrollTo(0, 0);
      }
      setMobileMenuOpen(false);
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => {
      window.removeEventListener("hashchange", handleHash);
      if (switchTimer !== undefined) window.clearTimeout(switchTimer);
      if (closeTimer !== undefined) window.clearTimeout(closeTimer);
    };
  }, []);

  // Pause testimonial marquee when scrolled off-screen to preserve mobile FPS & battery
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setMarqueeVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [currentRoute]);

  const handleSelectWork = useCallback(
    (item: WorkItem) => {
      if (item.category === "invitations" || item.category === "stalls") {
        const idx = allInvitations.findIndex((inv) => inv.id === item.id);
        setActiveInvitationIndex(idx !== -1 ? idx : 0);
      } else if (item.videoUrl) {
        setActiveMockup({
          title: `${item.name} — Video Invitation`,
          videoUrl: item.videoUrl,
        });
      } else if (item.url) {
        setActiveMockup({
          url: item.url,
          title: item.name,
          mobileImg: item.mobileImg || "",
          canIframe: item.canIframe !== false,
        });
      } else {
        window.location.hash = "#contact";
      }
    },
    [allInvitations]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const waMsg = encodeURIComponent(
      `*New Inquiry via zauqode.com*\n\n*Name:* ${form.name}\n*Event Date:* ${form.eventDate || "Not specified"}\n*City:* ${form.city || "Not specified"}\n*Need:* ${form.service}\n*Message:* ${form.message}`
    );
    window.open(`https://wa.me/918946077234?text=${waMsg}`, "_blank", "noopener,noreferrer");
  };

  const activeInv =
    activeInvitationIndex !== null ? allInvitations[activeInvitationIndex] ?? null : null;

  return (
    <div className="renovated-app min-h-[100dvh] relative overflow-x-hidden">
      {/* Teal Curtain Page Transition */}
      <div
        className={`fixed inset-0 bg-[#005a55] z-[9999] flex flex-col items-center justify-center transition-transform duration-500 pointer-events-none ${
          curtainActive ? "translate-y-0 !pointer-events-auto" : "-translate-y-full"
        }`}
        aria-hidden={!curtainActive}
      >
        <div className="font-script text-5xl sm:text-6xl text-[#f3e3c0]">Zauqode</div>
        <div className="font-ui font-semibold text-xs uppercase tracking-[0.3em] text-[#ecd08b] mt-2">
          Design · Code · Elevate
        </div>
      </div>

      {/* Top Fixed Navigation Bar */}
      <header
        className={`fixed top-0 inset-x-0 z-50 px-5 sm:px-10 py-3 sm:py-4 site-nav-glass${
          isScrolled ? " is-scrolled backdrop-blur-xl backdrop-saturate-150" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="#home"
            className="min-h-[44px] inline-flex items-center transition-opacity hover:opacity-85"
            style={{
              fontFamily: "'Croissant One', cursive, serif",
              fontSize: "17px",
              letterSpacing: "0.3em",
              color: "var(--teal-deep, #005a55)",
              textTransform: "uppercase",
            }}
            aria-label="Zauqode Home"
          >
            Zauqode
          </a>

          <nav className="hidden md:flex items-center gap-9" aria-label="Primary navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    if (
                      (item.id === "about" || item.id === "services" || item.id === "contact") &&
                      currentRoute === "home"
                    ) {
                      e.preventDefault();
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", `#${item.id}`);
                    }
                  }}
                  className={`nav-progress-link ${isActive ? "active" : ""}`}
                >
                  <span>{item.label}</span>
                  <span className="nav-progress-bar" />
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] inline-flex items-center justify-center font-ui font-semibold text-xs uppercase px-5 py-2 rounded-full border border-[#b8893c] text-[#005a55] tracking-[0.2em]"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Mobile Menu Full-Screen Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#f9fbf8] z-[99999] p-7 flex flex-col justify-between">
          <div className="flex justify-between items-center pb-5 border-b border-[#d4a55a]/35">
            <span
              style={{
                fontFamily: "'Croissant One', cursive, serif",
                fontSize: "17px",
                letterSpacing: "0.3em",
                color: "var(--teal-deep, #005a55)",
                textTransform: "uppercase",
              }}
            >
              Zauqode
            </span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="w-11 h-11 inline-flex items-center justify-center rounded-full border border-[#d4a55a]/60 text-xl text-[#005a55]"
              aria-label="Close Menu"
            >
              ✕
            </button>
          </div>

          <nav className="space-y-2 py-auto my-auto" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (
                    (item.id === "about" || item.id === "services" || item.id === "contact") &&
                    currentRoute === "home"
                  ) {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${item.id}`);
                  }
                }}
                className="flex items-center min-h-[48px] py-2 text-[#005a55] hover:text-[#00756e] transition-colors"
                style={{
                  fontFamily: "'Antic Didone', serif",
                  fontSize: "22px",
                  lineHeight: "1.4",
                  letterSpacing: "0.05em",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="font-script text-2xl text-[#785212] pt-5 border-t border-[#d4a55a]/35">
            Design . Code . Elevate
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW: HOME (#home)
          ===================================================================== */}
      {currentRoute === "home" && (
        <div className="space-y-0">
          {/* 1. Interactive Atelier Hero */}
          <Hero
            onSelectCategory={(category) => {
              setActiveFilter(category);
              window.location.hash = "#works";
            }}
          />

          {/* Wavy Divider to Mist Band */}
          <div className="w-full overflow-hidden leading-none block">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block" aria-hidden="true">
              <path
                d="M0,25 C320,55 640,0 960,30 C1200,50 1360,15 1440,25 L1440,60 L0,60 Z"
                fill="#eef8f3"
              />
            </svg>
          </div>

          {/* 2. About Me Section (Mist Band — Centered) */}
          <section id="about" className="bg-[#eef8f3] py-16 sm:py-20 px-6 scroll-mt-20">
            <div className="max-w-3xl mx-auto text-center space-y-5">
              <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#785212]">
                About Zauqode
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-[#005a55] leading-snug">
                Where emotion meets{" "}
                <span className="font-script text-4xl sm:text-5xl text-[#785212] font-normal">
                  artistry
                </span>
                .
              </h2>
              <p className="text-[#0d3b38]/90 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
                I am a bespoke invitation and occasion designer. I design celebration portals and
                heirloom stationery by deeply connecting with your feelings, so your guests experience
                genuine warmth from their very first glance.
              </p>

              <div className="flex items-center justify-center gap-4 font-script text-2xl sm:text-3xl text-[#00756e] py-1">
                <span>Listen</span>
                <span className="text-[#785212] text-xs" aria-hidden="true">
                  ✦
                </span>
                <span>Feel</span>
                <span className="text-[#785212] text-xs" aria-hidden="true">
                  ✦
                </span>
                <span>Create</span>
              </div>
            </div>
          </section>

          {/* Wavy Divider to White Band */}
          <div className="w-full overflow-hidden leading-none block bg-[#eef8f3]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block" aria-hidden="true">
              <path
                d="M0,35 C380,5 720,55 1060,20 C1240,5 1380,45 1440,35 L1440,60 L0,60 Z"
                fill="#ffffff"
              />
            </svg>
          </div>

          {/* 3. Services Section (White Band) */}
          <section id="services" className="bg-white py-16 sm:py-20 px-6 scroll-mt-20">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#785212]">
                  Services &amp; Offerings
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-[#00756e] leading-snug">
                  What I <span className="font-script text-4xl sm:text-5xl font-normal">Create</span>
                </h2>
              </div>

              <div className="space-y-4">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#contact");
                  }}
                  className="service-row-card p-6 sm:p-8 rounded-2xl border border-[#d4a55a]/40 bg-[#f9fbf8] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-heading text-2xl text-[#785212]">01</span>
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl text-[#005a55]">
                        Bespoke Invitation Design
                      </h3>
                      <p className="text-sm text-[#0d3b38]/85 font-normal mt-1 leading-relaxed">
                        Heirloom stationery, custom typography suites, and digital cards designed
                        with personal emotion.
                      </p>
                    </div>
                  </div>
                  <span className="service-arrow-rot text-xl text-[#00756e] shrink-0 transition-transform duration-300">
                    <ArrowIcon direction="up-right" />
                  </span>
                </a>

                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#contact");
                  }}
                  className="service-row-card p-6 sm:p-8 rounded-2xl border border-[#d4a55a]/40 bg-[#f9fbf8] flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="font-heading text-2xl text-[#785212]">02</span>
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl text-[#005a55]">
                        Occasion &amp; Wedding Websites
                      </h3>
                      <p className="text-sm text-[#0d3b38]/85 font-normal mt-1 leading-relaxed">
                        Interactive celebration portals, live RSVP concierges, and memorable digital
                        guest keepsakes.
                      </p>
                    </div>
                  </div>
                  <span className="service-arrow-rot text-xl text-[#00756e] shrink-0 transition-transform duration-300">
                    <ArrowIcon direction="up-right" />
                  </span>
                </a>
              </div>

              <div className="space-y-3 pt-2">
                <div className="font-ui font-semibold text-xs tracking-[0.2em] uppercase text-[#785212] text-center sm:text-left">
                  Also Offered
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "#contact");
                    }}
                    className="p-5 rounded-xl border border-[#d4a55a]/25 bg-[#f9fbf8] hover:border-[#00756e] transition-colors cursor-pointer space-y-1.5 block"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading text-lg text-[#005a55]">Video Invitations</h4>
                      <span className="text-sm text-[#00756e] shrink-0">
                        <ArrowIcon direction="up-right" />
                      </span>
                    </div>
                    <p className="text-[13.5px] sm:text-sm text-[#0d3b38]/85 font-normal leading-relaxed">
                      Cinematic motion reveals and audio-synced vertical stories for WhatsApp &amp;
                      Instagram.
                    </p>
                  </a>

                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", "#contact");
                    }}
                    className="p-5 rounded-xl border border-[#d4a55a]/25 bg-[#f9fbf8] hover:border-[#00756e] transition-colors cursor-pointer space-y-1.5 block"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading text-lg text-[#005a55]">Business Websites</h4>
                      <span className="text-sm text-[#00756e] shrink-0">
                        <ArrowIcon direction="up-right" />
                      </span>
                    </div>
                    <p className="text-[13.5px] sm:text-sm text-[#0d3b38]/85 font-normal leading-relaxed">
                      Tailored digital flagships and modern portfolios engineered for your brand.
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* 3b. Process Section */}
          <section id="process" className="bg-white pb-16 sm:pb-20 px-6 scroll-mt-20">
            <div className="max-w-6xl mx-auto space-y-12 border-t border-[#d4a55a]/20 pt-16">
              <div className="text-center space-y-2">
                <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.25em] uppercase text-[#785212]">
                  Process
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-[#005a55]">
                  How I create{" "}
                  <span className="font-script text-4xl sm:text-5xl text-[#00756e] font-normal lowercase">
                    your invitation
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {PROCESS_STEPS.map((step) => (
                  <div
                    key={step.num}
                    className="p-7 rounded-2xl bg-[#f9fbf8] border border-[#d4a55a]/35 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,117,110,0.04)] hover:shadow-[0_12px_28px_-6px_rgba(212,165,90,0.22)] hover:border-[#d4a55a] hover:-translate-y-1 transition-all duration-300 relative"
                  >
                    <div>
                      <div className="w-full h-[1.5px] bg-gradient-to-r from-[#d4a55a] via-[#f3e3c0] to-transparent mb-5" />
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-heading text-2xl text-[#785212] font-semibold">
                          {step.num}
                        </span>
                        <span className="text-[#785212] text-xs" aria-hidden="true">
                          ✦
                        </span>
                      </div>
                      <h3 className="font-heading text-xl sm:text-[22px] text-[#005a55] mb-2 leading-snug">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-[#0d3b38]/85 font-normal leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-3">
                <div className="flex items-center justify-center gap-4 max-w-xs mx-auto">
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#d4a55a] to-transparent" />
                  <span className="text-[#785212] text-xs" aria-hidden="true">
                    ✦
                  </span>
                  <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#d4a55a] to-transparent" />
                </div>
                <div className="font-script text-2xl sm:text-3xl text-[#00756e] text-center">
                  Everything handled with care, love and trust.
                </div>
              </div>
            </div>
          </section>

          {/* Wavy Divider from White to Ivory (#f9fbf8) */}
          <div className="w-full overflow-hidden leading-none block bg-white">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block" aria-hidden="true">
              <path
                d="M0,25 C340,55 700,5 1060,35 C1240,50 1380,15 1440,25 L1440,60 L0,60 Z"
                fill="#f9fbf8"
              />
            </svg>
          </div>

          {/* 3c. Why Zauqode Section (Ivory Band) */}
          <section id="why-zauqode" className="bg-[#f9fbf8] py-16 sm:py-22 px-6 scroll-mt-20">
            <div className="max-w-5xl mx-auto space-y-12">
              <div className="text-center space-y-2.5 max-w-2xl mx-auto">
                <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.24em] uppercase text-[#785212]">
                  The Zauqode Difference
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-[#005a55]">
                  Why{" "}
                  <span className="font-script text-4xl sm:text-5xl text-[#00756e] font-normal">
                    Zauqode
                  </span>
                  ?
                </h2>
                <p className="text-sm sm:text-base text-[#0d3b38]/85 font-normal leading-relaxed pt-1">
                  Every commission is crafted personally from initial concept to final delivery—for
                  discerning clients who value genuine artistry over templates.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {WHY_PILLARS.map((pillar) => (
                  <div
                    key={pillar.num}
                    className="group p-6 sm:p-7 rounded-2xl bg-white/85 border border-[#d4a55a]/30 border-l-2 border-l-[#d4a55a] hover:bg-white hover:border-[#d4a55a]/70 hover:border-l-[#00756e] hover:shadow-[0_12px_28px_-8px_rgba(0,90,85,0.08)] transition-all duration-300 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-ui font-semibold text-xs tracking-[0.2em] text-[#785212]">
                        {pillar.num}
                      </span>
                      <span
                        className="text-[#785212] text-xs opacity-85 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      >
                        ✦
                      </span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl text-[#005a55] leading-snug">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#0d3b38]/85 font-normal leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Wavy Divider from Ivory (#f9fbf8) to Mist Band */}
          <div className="w-full overflow-hidden leading-none block bg-[#f9fbf8]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block" aria-hidden="true">
              <path
                d="M0,20 C360,50 720,0 1080,35 C1260,50 1380,20 1440,25 L1440,60 L0,60 Z"
                fill="#eef8f3"
              />
            </svg>
          </div>

          {/* 4. Selected Works (Mist Band) */}
          <section className="bg-[#eef8f3] py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#785212]">
                  Selected Portfolio
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#00756e] leading-snug">
                  Meaningful stories,{" "}
                  <span className="font-script text-3xl sm:text-4xl md:text-5xl font-normal">
                    thoughtfully shaped
                  </span>
                  .
                </h2>
              </div>

              {/* Horizontal Scroll Reel with Navigation Controls */}
              <div className="relative group/reel">
                {/* Scroll Left Button (visible on md+) */}
                <button
                  type="button"
                  onClick={() => {
                    carouselRef.current?.scrollBy({ left: -320, behavior: "smooth" });
                  }}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#d4a55a]/60 text-[#005a55] shadow-[0_4px_18px_rgba(0,90,85,0.14)] hover:bg-[#005a55] hover:text-[#F7F5EF] hover:border-[#005a55] items-center justify-center transition-all cursor-pointer backdrop-blur-xs opacity-75 hover:opacity-100"
                  aria-label="Scroll left"
                >
                  <ArrowIcon direction="left" />
                </button>

                {/* The Horizontal Reel */}
                <div
                  ref={carouselRef}
                  className="flex overflow-x-auto snap-x snap-mandatory gap-5 sm:gap-6 pb-4 pt-1 px-4 sm:px-2 scroll-pl-4 sm:scroll-pl-2 no-scrollbar scroll-smooth"
                >
                  {homeWorks.map((item) => (
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      variant="home"
                      onSelect={handleSelectWork}
                    />
                  ))}
                  <div className="shrink-0 w-4" aria-hidden="true" />
                </div>

                {/* Scroll Right Button (visible on md+) */}
                <button
                  type="button"
                  onClick={() => {
                    carouselRef.current?.scrollBy({ left: 320, behavior: "smooth" });
                  }}
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 border border-[#d4a55a]/60 text-[#005a55] shadow-[0_4px_18px_rgba(0,90,85,0.14)] hover:bg-[#005a55] hover:text-[#F7F5EF] hover:border-[#005a55] items-center justify-center transition-all cursor-pointer backdrop-blur-xs opacity-75 hover:opacity-100"
                  aria-label="Scroll right"
                >
                  <ArrowIcon direction="right" />
                </button>
              </div>

              {/* Swipe / Scroll indicator hint */}
              <div className="text-center font-ui font-semibold text-[11px] sm:text-xs tracking-[0.2em] uppercase text-[#785212] -mt-2 flex items-center justify-center gap-1.5">
                <span>Swipe to explore creations</span>
                <ArrowIcon direction="right" className="inline-block" />
              </div>

              <div className="text-center pt-4">
                <a href="#works" className="btn-pill-renovated">
                  <span>All works</span>
                  <span className="arrow-move">
                    <ArrowIcon direction="right" />
                  </span>
                </a>
              </div>

              {/* Client Words / Testimonials */}
              <div ref={marqueeRef} className="pt-12 border-t border-[#d4a55a]/25 space-y-8">
                <div className="text-center space-y-2">
                  <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#785212]">
                    Client Words
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#00756e] leading-snug">
                    Cherished{" "}
                    <span className="font-script text-3xl sm:text-4xl font-normal">
                      Celebrations
                    </span>
                  </h3>
                </div>

                <div
                  className={`testimonial-marquee-wrap -mx-4 sm:mx-0 w-auto sm:w-full py-1${
                    marqueeVisible ? "" : " testimonial-marquee-paused"
                  }`}
                >
                  <div className="testimonial-marquee-track">
                    {[0, 1].map((setIdx) => (
                      <div
                        key={setIdx}
                        className={`flex gap-4 sm:gap-5 pr-4 sm:pr-5 shrink-0 ${
                          setIdx === 1 ? "testimonial-duplicate-set" : ""
                        }`}
                        aria-hidden={setIdx === 1}
                      >
                        {TESTIMONIALS.map((t, idx) => (
                          <div
                            key={`${setIdx}-${idx}`}
                            className="w-[250px] sm:w-[285px] shrink-0 p-4 sm:p-5 rounded-2xl bg-white border border-[#d4a55a]/35 shadow-sm flex flex-col justify-between gap-3 relative"
                          >
                            <div>
                              <span
                                className="font-heading text-2xl sm:text-3xl text-[#785212] leading-none block"
                                aria-hidden="true"
                              >
                                “
                              </span>
                              <p className="font-body text-[13px] sm:text-sm text-[#0d3b38]/90 font-normal leading-relaxed -mt-1.5">
                                {t.quote}
                              </p>
                            </div>
                            <div className="pt-2.5 border-t border-[#d4a55a]/20 flex flex-col gap-0.5">
                              <span className="font-script text-[22px] sm:text-2xl text-[#005a55] leading-snug font-normal">
                                {t.name}
                              </span>
                              <span className="font-ui font-semibold text-[10.5px] sm:text-[11px] text-[#785212] uppercase tracking-wider leading-tight">
                                {t.project}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Wavy Divider to Deep Teal Section */}
          <div className="w-full overflow-hidden leading-none block bg-[#eef8f3]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block" aria-hidden="true">
              <path
                d="M0,30 C360,0 720,60 1080,25 C1240,10 1380,45 1440,30 L1440,60 L0,60 Z"
                fill="#005a55"
              />
            </svg>
          </div>

          {/* 5. Teal Wavy CTA Section */}
          <section className="bg-[#005a55] text-white py-20 sm:py-24 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5 space-y-2 text-center md:text-left">
                <div className="font-script text-5xl sm:text-6xl text-[#f3e3c0]">Let's Create</div>
                <div className="font-ui font-semibold text-lg sm:text-xl tracking-[0.24em] uppercase text-[#f3e3c0]">
                  something beautiful.
                </div>
              </div>

              <div className="hidden md:block md:col-span-1 w-[1px] h-24 bg-[#d4a55a]/60 mx-auto" />

              <div className="md:col-span-6 space-y-6 text-center md:text-left">
                <p className="font-heading text-2xl sm:text-3xl text-[#f9fbf8] leading-snug">
                  "Have an idea, a celebration or a brand to bring to life?"
                </p>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", "#contact");
                  }}
                  className="btn-pill-renovated btn-pill-light"
                >
                  <span>Say hello</span>
                  <span className="arrow-move">
                    <ArrowIcon direction="right" />
                  </span>
                </a>
              </div>
            </div>
          </section>

          {/* Wavy Divider to Contact Section */}
          <div className="w-full overflow-hidden leading-none block bg-transparent -mt-[2px] relative z-[2]">
            <svg
              viewBox="0 0 1440 60"
              preserveAspectRatio="none"
              className="w-full h-12 block"
              shapeRendering="geometricPrecision"
              aria-hidden="true"
            >
              <path
                d="M-2,-5 L1442,-5 L1442,30 C1360,20 1200,55 960,35 C640,5 320,55 -2,25 Z"
                fill="#005a55"
              />
            </svg>
          </div>

          {/* 6. Contact Section */}
          <section id="contact" className="py-16 sm:py-20 px-6 max-w-2xl mx-auto space-y-8 scroll-mt-20">
            <div className="text-center space-y-2">
              <div className="font-ui font-semibold text-xs sm:text-[13px] tracking-[0.22em] uppercase text-[#785212]">
                Start a Conversation
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-[#00756e] leading-snug">
                Let’s talk about your{" "}
                <span className="font-script text-4xl sm:text-5xl font-normal">celebration</span>.
              </h2>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-ui font-semibold text-xs tracking-wider uppercase text-[#0d3b38] mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sofia Reyan"
                    className="w-full min-h-[46px] bg-white border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-sm font-normal text-[#0d3b38] placeholder:text-[#4a6b68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]/35 focus:border-[#00756e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui font-semibold text-xs tracking-wider uppercase text-[#0d3b38] mb-1.5">
                      Event Date
                    </label>
                    <input
                      type="text"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      placeholder="e.g. Dec 2026 / Winter"
                      className="w-full min-h-[46px] bg-white border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-sm font-normal text-[#0d3b38] placeholder:text-[#4a6b68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]/35 focus:border-[#00756e]"
                    />
                  </div>

                  <div>
                    <label className="block font-ui font-semibold text-xs tracking-wider uppercase text-[#0d3b38] mb-1.5">
                      City / Venue
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Chennai, Bangalore"
                      className="w-full min-h-[46px] bg-white border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-sm font-normal text-[#0d3b38] placeholder:text-[#4a6b68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]/35 focus:border-[#00756e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-ui font-semibold text-xs tracking-wider uppercase text-[#0d3b38] mb-1.5">
                    I need
                  </label>
                  <select
                    required
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full min-h-[46px] bg-white border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-sm font-normal text-[#0d3b38] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]/35 focus:border-[#00756e]"
                  >
                    <option value="" disabled hidden>
                      Select an offering...
                    </option>
                    <option value="Occasion & Wedding Website">Occasion &amp; Wedding Website</option>
                    <option value="Bespoke Invitation Suite">Bespoke Invitation Suite</option>
                    <option value="Full Heirloom Bundle (Web + Invite + Video)">
                      Full Heirloom Bundle (Web + Invite + Video)
                    </option>
                    <option value="Video Invitation">Video Invitation</option>
                    <option value="Business Website">Business Website</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui font-semibold text-xs tracking-wider uppercase text-[#0d3b38] mb-1.5">
                    Tell me about your vision
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your celebration, aesthetic ideas, and timeline..."
                    className="w-full bg-white border border-[#d4a55a]/50 rounded-xl px-4 py-3 text-sm font-normal text-[#0d3b38] placeholder:text-[#4a6b68] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00756e]/35 focus:border-[#00756e] resize-none"
                  />
                </div>

                <button type="submit" className="btn-pill-renovated w-full justify-center">
                  <span>Send message</span>
                  <span className="arrow-move">
                    <ArrowIcon direction="right" />
                  </span>
                </button>

                <p className="text-center text-[13px] text-[#0d3b38]/85 font-normal pt-1">
                  ✦ I thoughtfully reply within 24 hours.
                </p>
              </form>
            ) : (
              <div className="text-center p-10 bg-white rounded-3xl border border-[#d4a55a] space-y-3">
                <h3 className="font-heading text-3xl text-[#00756e]">Thank you.</h3>
                <p className="font-script text-2xl text-[#785212]">Your message has been received.</p>
                <p className="text-sm text-[#0d3b38]/85 font-normal">
                  I look forward to discussing your celebration and bringing your feelings to life.
                </p>
                <p className="text-[13px] text-[#005a55] font-medium pt-2">
                  ✦ I thoughtfully reply within 24 hours.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* =====================================================================
          VIEW: WORKS (#works — Lazy-Loaded Portfolio Catalogue)
          ===================================================================== */}
      {currentRoute === "works" && (
        <Suspense
          fallback={
            <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="aspect-[3/4] rounded-2xl bg-[#eef8f3] border border-[#d4a55a]/25 animate-pulse"
                />
              ))}
            </div>
          }
        >
          <WorksCatalogueView
            works={allCatalogueWorks}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onSelectWork={handleSelectWork}
          />
        </Suspense>
      )}

      {/* Wavy Divider into Deep Teal Footer */}
      <div className="w-full overflow-hidden leading-none block bg-transparent -mb-[2px] relative z-[2]">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-14 block"
          shapeRendering="geometricPrecision"
          aria-hidden="true"
        >
          <path
            d="M-2,20 C360,50 720,5 1080,40 C1260,55 1380,25 1442,30 L1442,65 L-2,65 Z"
            fill="#005a55"
          />
        </svg>
      </div>

      {/* Deep Teal Footer */}
      <footer className="bg-[#005a55] text-[#f3e3c0] py-16 px-6 text-center space-y-6">
        <div
          className="text-xl sm:text-2xl text-[#f3e3c0]"
          style={{
            fontFamily: "'Croissant One', cursive, serif",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}
        >
          ZAUQODE
        </div>
        <div className="font-script text-2xl sm:text-3xl text-[#edd08b]">Design . Code . Elevate</div>

        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-12 py-4 border-y border-[#d4a55a]/25 max-w-xl mx-auto w-full">
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-[#ecd08b]">
              Email
            </span>
            <a
              href="mailto:zauqode@gmail.com"
              className="inline-flex items-center min-h-[44px] px-2 font-body text-sm sm:text-base text-[#f3e3c0] hover:text-white transition-colors"
            >
              zauqode@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-[#ecd08b]">
              Instagram
            </span>
            <a
              href="https://instagram.com/zauqode"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center min-h-[44px] px-2 font-body text-sm sm:text-base text-[#f3e3c0] hover:text-white transition-colors"
            >
              @zauqode
            </a>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <span className="font-ui font-semibold text-xs uppercase tracking-wider text-[#ecd08b]">
              WhatsApp
            </span>
            <a
              href="https://wa.me/918946077234"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center min-h-[44px] px-2 font-body text-sm sm:text-base text-[#f3e3c0] hover:text-white transition-colors"
            >
              +91 89460 77234
            </a>
          </div>
        </div>

        <div className="font-ui font-medium text-xs tracking-wider text-[#f3e3c0]/90 pt-2">
          © 2026 Zauqode. All rights reserved. Handcrafted with care.
        </div>
      </footer>

      {/* Lazy-Loaded Modals */}
      {activeInv && activeInvitationIndex !== null && (
        <Suspense fallback={null}>
          <InvitationShowcaseModal
            activeInv={activeInv}
            activeIndex={activeInvitationIndex}
            totalCount={allInvitations.length}
            onPrev={() =>
              setActiveInvitationIndex((prev) =>
                prev !== null
                  ? (prev - 1 + allInvitations.length) % allInvitations.length
                  : null
              )
            }
            onNext={() =>
              setActiveInvitationIndex((prev) =>
                prev !== null ? (prev + 1) % allInvitations.length : null
              )
            }
            onClose={() => setActiveInvitationIndex(null)}
          />
        </Suspense>
      )}

      {activeMockup && (
        <Suspense fallback={null}>
          <MobileMockupModal
            activeMockup={activeMockup}
            onClose={() => setActiveMockup(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
