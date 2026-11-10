"use client";

import { useState, useEffect, useRef } from "react";
import zauqodeLogo from "../../assets/Logos/zauqode-logo.png";
import { Hero } from "@/components/zauqode-home/Hero";

export function RenovatedPortfolio() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [curtainActive, setCurtainActive] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeMockup, setActiveMockup] = useState<{
    url?: string;
    title: string;
    mobileImg?: string;
    videoUrl?: string;
    canIframe?: boolean;
  } | null>(null);

  const [activeInvitationIndex, setActiveInvitationIndex] = useState<number | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    eventDate: "",
    city: "",
    service: "",
    message: "",
  });

  const [showAllWorks, setShowAllWorks] = useState(false);

  // Close modals on Escape key & arrow keys navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMockup(null);
        setActiveInvitationIndex(null);
        setMobileMenuOpen(false);
      } else if (e.key === "ArrowLeft") {
        setActiveInvitationIndex((prev) => (prev !== null ? (prev - 1 + 5) % 5 : null));
      } else if (e.key === "ArrowRight") {
        setActiveInvitationIndex((prev) => (prev !== null ? (prev + 1) % 5 : null));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Hash Routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (hash === "about" || hash === "services" || hash === "contact") {
        setCurrentRoute("home");
        setMobileMenuOpen(false);
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 60);
        return;
      }

      const validRoutes = ["home", "about", "services", "works", "contact"];
      const target = validRoutes.includes(hash) ? hash : "home";

      // Trigger curtain transition if route changes
      if (target !== currentRoute && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
        setCurtainActive(true);
        setTimeout(() => {
          setCurrentRoute(target);
          window.scrollTo(0, 0);
          setTimeout(() => setCurtainActive(false), 350);
        }, 320);
      } else {
        setCurrentRoute(target);
        window.scrollTo(0, 0);
      }
      setMobileMenuOpen(false);
    };

    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, [currentRoute]);

  const handleMouseEnter = () => {};
  const handleMouseLeave = () => {};

  // 3D Card Tilt Effect (disabled on mobile touch devices)
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 14}deg) translateZ(8px)`;
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    const waMsg = encodeURIComponent(
      `*New Inquiry via zauqode.com*\n\n*Name:* ${form.name}\n*Event Date:* ${form.eventDate || "Not specified"}\n*City:* ${form.city || "Not specified"}\n*Need:* ${form.service}\n*Message:* ${form.message}`
    );
    window.open(`https://wa.me/918946077234?text=${waMsg}`, "_blank");
  };

  const works = [
    {
      id: "01",
      name: "Sonali & Pallav",
      sub: "Occasion Website & RSVP Concierge",
      category: "websites",
      label: "Wedding Website",
      thumb: "/works/pallav-sonali.jpg",
      url: "https://pallav-weds-sonali.vercel.app/",
      mobileImg: "/works/mobile-pallav-sonali.png",
      canIframe: true,
    },
    {
      id: "02",
      name: "Bala & Shahin",
      sub: "Grand Celebration & Itinerary Portal",
      category: "websites",
      label: "Wedding Celebration",
      thumb: "/works/bala-shahin.jpg",
      url: "https://bala-weds-shahin.vercel.app/",
      mobileImg: "/works/mobile-bala-shahin.png",
      canIframe: false,
    },
    {
      id: "03",
      name: "Aravinda & Salini",
      sub: "Sacred Temple Wedding Portal",
      category: "websites",
      label: "Sacred Wedding",
      thumb: "/works/aravinda-salini.jpg",
      url: "https://aravinda-weds-salini.vercel.app/",
      mobileImg: "/works/mobile-aravinda-salini.png",
      canIframe: true,
    },
    {
      id: "04",
      name: "Akash & Megha",
      sub: "Celebration Portal & Digital Invitation",
      category: "websites",
      label: "Wedding Portal",
      thumb: "/works/akash-megha.jpg",
      url: "https://akash-weds-megha.vercel.app/",
      mobileImg: "/works/mobile-akash-megha.png",
      canIframe: true,
    },
    {
      id: "05",
      name: "Giridhar & Renee",
      sub: "A Sacred Wedding Celebration & Portal",
      category: "websites",
      label: "Wedding Celebration",
      thumb: "/works/giridhar-renee.jpg",
      url: "https://giridhar-weds-renee.vercel.app/",
      mobileImg: "/works/mobile-giridhar-renee.jpg",
      canIframe: true,
    },
    {
      id: "06",
      name: "Akash & Yazhini",
      sub: "Four-Ceremony Royal Folio Suite",
      category: "invitations",
      label: "Heirloom Suite",
      thumb: "/works/invite-akash-yazhini.jpg",
      mobileImg: "/works/invite-akash-yazhini.jpg",
      canIframe: false,
      story: "The couple wished for an opulent royal heritage tribute to their lineage. I crafted a four-ceremony folio with emerald foil borders, sacred kolam motifs, and dedicated ceremony cards.",
      occasion: "Four-Ceremony Royal Wedding",
      style: "Deep Forest & Heritage Gold Folio",
      included: ["4 Ceremony Folios", "Custom Monogram", "Wax Seal Motif", "WhatsApp Suite"],
    },
    {
      id: "07",
      name: "Karthik & Divya",
      sub: "Emerald Lotus & Translucent Vellum Suite",
      category: "invitations",
      label: "Vellum & Lotus",
      thumb: "/works/invite-karthik-divya.jpg",
      mobileImg: "/works/invite-karthik-divya.jpg",
      canIframe: false,
      story: "A modern botanical dream requested with ethereal serenity. Hand-painted emerald lotus blossoms paired with translucent vellum overlays and delicate gold serif typography.",
      occasion: "Traditional Temple Wedding",
      style: "Emerald Lotus & Translucent Vellum",
      included: ["Translucent Vellum Overlay", "Hand-Painted Lotus Card", "Keepsake RSVP", "Digital Envelope"],
    },
    {
      id: "08",
      name: "Mohammed & Shakila",
      sub: "Imperial Burgundy & Gold Arch Suite",
      category: "invitations",
      label: "Royal Nikkah",
      thumb: "/works/invite-nikkah.jpg",
      mobileImg: "/works/invite-nikkah.jpg",
      canIframe: false,
      story: "Designed for a grand imperial celebration. Incorporates majestic Islamic arch silhouettes, intricate damask borders, and rich imperial burgundy hues with gilded calligraphy.",
      occasion: "Royal Nikkah Celebration",
      style: "Imperial Burgundy & Gilded Arch",
      included: ["Gilded Arch Main Folio", "Reception Card", "Bespoke Calligraphy", "Mobile Preview Suite"],
    },
    {
      id: "09",
      name: "Malligai Manam",
      sub: "மல்லிகை மணம் சூடிக்கொள் — Jasmine Suite",
      category: "invitations",
      label: "Heritage Tamil",
      thumb: "/works/invite-jasmine.jpg",
      mobileImg: "/works/invite-jasmine.jpg",
      canIframe: false,
      story: "Rooted in Tamil poetic fragrance (மல்லிகை மணம்). Designed with fragrant white jasmine garlands against sacred auspicious crimson and Tamil classical script.",
      occasion: "Tamil Heritage Thirumana Suite",
      style: "Sacred Crimson & Jasmine Flora",
      included: ["Tamil Typography Card", "Muhurtham Keepsake", "Traditional Kolam Accents", "WhatsApp Folio"],
    },
    {
      id: "10",
      name: "Kaadhalum Valaiyalum",
      sub: "காதலும் கை வளையலும் — Bangle Ceremony",
      category: "invitations",
      label: "Ceremony Keepsake",
      thumb: "/works/invite-valaiyal.jpg",
      mobileImg: "/works/invite-valaiyal.jpg",
      canIframe: false,
      story: "Honoring traditional glass bangle blessings with warm temple architecture illustrations, festive marigold accents, and nostalgic celebratory lyricism.",
      occasion: "Valaikappu & Bangle Ceremony",
      style: "Temple Arch & Festive Marigold",
      included: ["Ceremony Keepsake Card", "Song Lyric Accent", "Blessing Card", "Family WhatsApp Suite"],
    },
    {
      id: "11",
      name: "Dr. Vamsi & Ritika",
      sub: "Traditional Musical & Vedic Motion Suite",
      category: "videos",
      label: "Video Invitation",
      thumb: "/works/vamsi-ritika.jpg",
      videoUrl: "/works/vamsi-ritika-video.mp4",
      canIframe: false,
    },
    {
      id: "12",
      name: "Zara Invitations",
      sub: "Artisan Stationery & Bespoke Showcase",
      category: "business",
      label: "Business Website",
      thumb: "/works/zara-mockup.png",
      url: "https://zara-invitation-website.vercel.app/",
      mobileImg: "/works/zara-mockup.png",
      canIframe: true,
    },
    {
      id: "13",
      name: "Thrive Properties",
      sub: "Premium Real Estate & Property Discovery",
      category: "business",
      label: "Business Website",
      thumb: "/works/thrive-mockup.jpg",
      url: "https://thriveproperties.vercel.app/",
      mobileImg: "/works/thrive-mockup.jpg",
      canIframe: true,
    },
  ];

  // Curated 4 items for Home Page Selected Works: 1 Wedding Website, 1 Invitation, 1 Video, 1 Business Website
  const homeSelectedWorks = [
    works.find((w) => w.id === "01")!,
    works.find((w) => w.id === "06")!,
    works.find((w) => w.id === "11")!,
    works.find((w) => w.id === "12")!,
  ].filter(Boolean);

  const invitationWorks = works.filter((w) => w.category === "invitations");
  const activeInv = activeInvitationIndex !== null ? invitationWorks[activeInvitationIndex] : null;

  return (
    <div className="renovated-app min-h-screen relative overflow-x-hidden">
      {/* Inline styles for fonts and effects */}
      <style>{`
        :root {
          --teal: #00756e;
          --teal-deep: #005a55;
          --mint: #cdeee3;
          --mist: #eef8f3;
          --bg-page: #f9fbf8;
          --gold: #d4a55a;
          --gold-dark: #b8893c;
          --text-ink: #0d3b38;
          --cream: #f3e3c0;

          --font-heading: 'Antic Didone', Georgia, serif;
          --font-script: 'Sacramento', cursive;
          --font-ui: 'Poiret One', cursive, sans-serif;
          --font-brand: 'Alice', Georgia, serif;
          --font-body: 'Jost', sans-serif;
        }

        .renovated-app {
          background-color: var(--bg-page);
          background-image: 
            radial-gradient(ellipse 550px 550px at 0% 0%, rgba(205, 238, 227, 0.45) 0%, transparent 70%),
            radial-gradient(ellipse 650px 650px at 100% 100%, rgba(205, 238, 227, 0.35) 0%, transparent 70%);
          background-attachment: fixed;
          color: var(--text-ink);
          font-family: var(--font-body);
          font-weight: 300;
        }

        .font-heading { font-family: var(--font-heading); }
        .font-script { font-family: var(--font-script); }
        .font-ui { font-family: var(--font-ui); }
        .font-brand { font-family: var(--font-brand); }

        /* Pill Button */
        .btn-pill-renovated {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 13px 32px;
          border-radius: 9999px;
          border: 1px solid var(--teal);
          background: transparent;
          color: var(--teal);
          font-family: var(--font-ui);
          font-size: 14px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: color 0.4s ease, border-color 0.4s ease, transform 0.2s ease;
          z-index: 1;
        }
        .btn-pill-renovated::before {
          content: "";
          position: absolute;
          inset: 0;
          background: var(--teal);
          transform: translateY(100%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: -1;
        }
        .btn-pill-renovated:hover::before { transform: translateY(0); }
        .btn-pill-renovated:hover {
          color: var(--cream);
          border-color: var(--teal);
          transform: translateY(-1px);
        }
        .btn-pill-renovated:hover .arrow-move { transform: translateX(4px); }
        .arrow-move { transition: transform 0.35s ease; }

        .btn-pill-light {
          border-color: var(--cream);
          color: var(--cream);
        }
        .btn-pill-light::before { background: var(--cream); }
        .btn-pill-light:hover { color: var(--teal-deep); border-color: var(--cream); }

        /* Work Cards */
        .tilt-card-container {
          aspect-ratio: 3 / 4;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.2s cubic-bezier(0.2, 0, 0.2, 1), box-shadow 0.3s ease;
          box-shadow: 0 12px 32px -8px rgba(13, 59, 56, 0.08);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 34px 28px;
        }
        .card-inner-gold {
          position: absolute;
          inset: 14px;
          border: 1px solid rgba(212, 165, 90, 0.55);
          border-radius: 16px;
          pointer-events: none;
          transition: inset 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease;
          z-index: 2;
        }
        .tilt-card-container:hover .card-inner-gold {
          inset: 8px;
          border-color: var(--gold);
        }
        .tilt-card-container::after {
          content: "";
          position: absolute;
          top: -50%;
          left: -60%;
          width: 50%;
          height: 200%;
          background: linear-gradient(60deg, rgba(255,255,255,0) 20%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 80%);
          transform: rotate(25deg) translateX(-100%);
          transition: transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
          z-index: 3;
        }
        .tilt-card-container:hover::after {
          transform: rotate(25deg) translateX(450%);
        }

        .card-teal { background: linear-gradient(135deg, #00756e 0%, #005a55 100%); color: var(--cream); }
        .card-mint { background: linear-gradient(135deg, #cdeee3 0%, #eef8f3 100%); color: var(--teal-deep); }
        .card-cream { background: linear-gradient(135deg, #f3e3c0 0%, #f9fbf8 100%); color: var(--text-ink); }
        .card-white-mint { background: linear-gradient(135deg, #ffffff 0%, #cdeee3 100%); color: var(--teal-deep); }
        .card-bright-teal { background: linear-gradient(135deg, #008f86 0%, #00756e 100%); color: var(--cream); }

        .service-row-card {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), background 0.3s ease, border-color 0.3s ease;
        }
        .service-row-card:hover {
          transform: translateX(8px);
          background: #ffffff;
          border-color: var(--gold);
        }
        .service-row-card:hover .service-arrow-rot {
          transform: rotate(45deg);
          color: var(--gold-dark);
        }

        @media (max-width: 640px) {
          .tilt-card-container {
            aspect-ratio: 4 / 5;
            min-height: 380px;
            padding: 24px 20px;
            border-radius: 20px;
            transform: none !important;
          }
          .card-inner-gold {
            inset: 10px;
            border-radius: 12px;
          }
          .tilt-card-container:hover .card-inner-gold {
            inset: 6px;
          }
        }
      `}</style>

      {/* Teal Curtain Page Transition */}
      <div
        className={`fixed inset-0 bg-[#005a55] z-[9999] flex flex-col items-center justify-center transition-transform duration-700 pointer-events-none ${
          curtainActive ? "translate-y-0 !pointer-events-auto" : "-translate-y-full"
        }`}
      >
        <div className="font-script text-5xl sm:text-6xl text-[#f3e3c0]">Zauqode</div>
        <div className="font-ui text-xs uppercase tracking-[0.35em] text-[#d4a55a] mt-2">
          Design · Code · Elevate
        </div>
      </div>

      {/* Top Glass Blur Nav */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 sm:px-10 py-4 sm:py-5 bg-[#f9fbf8]/85 backdrop-blur-md border-b border-[#d4a55a]/25">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a
            href="#home"
            className="font-brand text-2xl text-[#00756e] tracking-wide"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span>Zauqode</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {["home", "about", "services", "works", "contact"].map((route) => (
              <a
                key={route}
                href={`#${route}`}
                onClick={(e) => {
                  if ((route === "about" || route === "services" || route === "contact") && currentRoute === "home") {
                    e.preventDefault();
                    document.getElementById(route)?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${route}`);
                  }
                }}
                className={`font-ui text-sm tracking-[0.18em] uppercase py-1 relative capitalize transition-colors ${
                  currentRoute === route ? "text-[#00756e] font-medium" : "text-[#0d3b38]/80 hover:text-[#00756e]"
                }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {route}
                {currentRoute === route && (
                  <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#d4a55a]" />
                )}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden font-ui text-xs tracking-widest uppercase border border-[#d4a55a] text-[#00756e] px-4 py-1.5 rounded-full"
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[65px] bg-[#f9fbf8] z-40 p-8 flex flex-col justify-between">
          <div className="space-y-4 pt-6">
            {["home", "about", "services", "works", "contact"].map((route) => (
              <a
                key={route}
                href={`#${route}`}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if ((route === "about" || route === "services" || route === "contact") && currentRoute === "home") {
                    e.preventDefault();
                    document.getElementById(route)?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${route}`);
                  }
                }}
                className="block font-ui text-base tracking-[0.22em] uppercase text-[#00756e] py-1.5"
              >
                {route}
              </a>
            ))}
          </div>
          <div className="font-script text-2xl text-[#b8893c] pb-6">
            Design . Code . Elevate
          </div>
        </div>
      )}

      {/* =====================================================================
          VIEW: HOME (#home)
          ===================================================================== */}
      {currentRoute === "home" && (
        <div className="space-y-0">
          {/* 1. Redesigned Minimal Sleek Hero */}
          <Hero />

          {/* Wavy Divider to Mist Band */}
          <div className="w-full overflow-hidden leading-none block">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block">
              <path d="M0,25 C320,55 640,0 960,30 C1200,50 1360,15 1440,25 L1440,60 L0,60 Z" fill="#eef8f3" />
            </svg>
          </div>

          {/* 2. About Me Section (Mist Band) */}
          <section id="about" className="bg-[#eef8f3] py-20 px-6 scroll-mt-20">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
              <div className="md:col-span-4 flex justify-center">
                <div className="w-44 h-60 border-[1.5px] border-[#d4a55a] rounded-t-full rounded-b-3xl bg-[#eef8f3] shadow-[inset_0_0_0_7px_#f9fbf8] flex flex-col items-center justify-center p-4">
                  <img src={zauqodeLogo} alt="Zauqode Emblem" className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md mt-1" />
                  <span className="text-[#d4a55a] text-sm mt-2">✦</span>
                </div>
              </div>

              <div className="md:col-span-8 space-y-5 text-center md:text-left">
                <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
                  About Zauqode
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-[#005a55] leading-snug">
                  Where emotion meets <span className="font-script text-4xl sm:text-5xl text-[#b8893c] font-normal">artistry</span>.
                </h2>
                <p className="text-[#0d3b38]/85 text-base sm:text-lg leading-relaxed font-light max-w-xl">
                  I am a bespoke invitation and occasion designer. I design celebration portals and heirloom stationery by deeply connecting with your feelings, so your guests experience genuine warmth from their very first glance.
                </p>

                {/* Three Script Words: Listen ✦ Feel ✦ Create */}
                <div className="flex items-center justify-center md:justify-start gap-4 font-script text-2xl sm:text-3xl text-[#00756e] py-1">
                  <span>Listen</span>
                  <span className="text-[#d4a55a] text-xs">✦</span>
                  <span>Feel</span>
                  <span className="text-[#d4a55a] text-xs">✦</span>
                  <span>Create</span>
                </div>
              </div>
            </div>
          </section>

          {/* Wavy Divider to White Band */}
          <div className="w-full overflow-hidden leading-none block bg-[#eef8f3]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block">
              <path d="M0,35 C380,5 720,55 1060,20 C1240,5 1380,45 1440,35 L1440,60 L0,60 Z" fill="#ffffff" />
            </svg>
          </div>

          {/* 3. Services Section (White Band) */}
          <section id="services" className="bg-white py-20 px-6 scroll-mt-20">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center space-y-2">
                <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
                  Services &amp; Offerings
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl text-[#00756e]">
                  What I Create
                </h2>
              </div>

              {/* Main Two Core Services */}
              <div className="space-y-4">
                {/* Core 01: Bespoke Invitations (Major Design Offering) */}
                <div
                  onClick={() => (window.location.hash = "#contact")}
                  className="service-row-card p-6 sm:p-8 rounded-2xl border border-[#d4a55a]/40 bg-[#f9fbf8] flex items-center justify-between gap-4 cursor-pointer"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center gap-5 sm:gap-6">
                    <span className="font-heading text-2xl text-[#b8893c]">01</span>
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl text-[#005a55]">Bespoke Invitations</h3>
                      <p className="text-xs sm:text-sm text-[#0d3b38]/75 font-light mt-0.5">
                        Heirloom stationery, custom typography suites, and digital cards designed with personal emotion.
                      </p>
                    </div>
                  </div>
                  <span className="service-arrow-rot text-xl text-[#00756e] shrink-0 transition-transform duration-300">
                    ↗
                  </span>
                </div>

                {/* Core 02: Occasion & Wedding Websites */}
                <div
                  onClick={() => (window.location.hash = "#contact")}
                  className="service-row-card p-6 sm:p-8 rounded-2xl border border-[#d4a55a]/40 bg-[#f9fbf8] flex items-center justify-between gap-4 cursor-pointer"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex items-center gap-5 sm:gap-6">
                    <span className="font-heading text-2xl text-[#b8893c]">02</span>
                    <div>
                      <h3 className="font-heading text-xl sm:text-2xl text-[#005a55]">Occasion &amp; Wedding Websites</h3>
                      <p className="text-xs sm:text-sm text-[#0d3b38]/75 font-light mt-0.5">
                        Interactive celebration portals, live RSVP concierges, and memorable digital guest keepsakes.
                      </p>
                    </div>
                  </div>
                  <span className="service-arrow-rot text-xl text-[#00756e] shrink-0 transition-transform duration-300">
                    ↗
                  </span>
                </div>
              </div>

              {/* Also Offered Section (Smaller Compact Cards) */}
              <div className="space-y-3 pt-2">
                <div className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#b8893c] text-center sm:text-left">
                  Also Offered
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Smaller Item: Video Invitations */}
                  <div
                    onClick={() => (window.location.hash = "#contact")}
                    className="p-5 rounded-xl border border-[#d4a55a]/25 bg-[#f9fbf8] hover:border-[#00756e] transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-lg text-[#005a55]">Video Invitations</h4>
                      <span className="text-sm text-[#00756e]">↗</span>
                    </div>
                    <p className="text-xs text-[#0d3b38]/70 font-light">
                      Cinematic motion reveals and audio-synced vertical stories for WhatsApp &amp; Instagram.
                    </p>
                  </div>

                  {/* Smaller Item: Business Websites */}
                  <div
                    onClick={() => (window.location.hash = "#contact")}
                    className="p-5 rounded-xl border border-[#d4a55a]/25 bg-[#f9fbf8] hover:border-[#00756e] transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading text-lg text-[#005a55]">Business Websites</h4>
                      <span className="text-sm text-[#00756e]">↗</span>
                    </div>
                    <p className="text-xs text-[#0d3b38]/70 font-light">
                      Tailored digital flagships and modern portfolios engineered for your brand.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3b. Process & Starting Investment (White to Mist transition) */}
          <section className="bg-white pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16 border-t border-[#d4a55a]/20 pt-16">
              {/* 3-Step Process */}
              <div className="space-y-8">
                <div className="text-center space-y-2">
                  <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
                    How It Works
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#00756e]">
                    A Seamless 3-Step Journey
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div className="p-6 rounded-2xl bg-[#f9fbf8] border border-[#d4a55a]/30 space-y-3">
                    <div className="w-10 h-10 rounded-full border border-[#d4a55a] bg-[#00756e] text-[#f3e3c0] font-heading text-lg flex items-center justify-center mx-auto">
                      1
                    </div>
                    <h4 className="font-heading text-xl text-[#005a55]">Share Your Story</h4>
                    <p className="text-xs text-[#0d3b38]/75 font-light leading-relaxed">
                      Tell me about your celebration, wedding dates, venue, and aesthetic inspirations.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#f9fbf8] border border-[#d4a55a]/30 space-y-3">
                    <div className="w-10 h-10 rounded-full border border-[#d4a55a] bg-[#00756e] text-[#f3e3c0] font-heading text-lg flex items-center justify-center mx-auto">
                      2
                    </div>
                    <h4 className="font-heading text-xl text-[#005a55]">Artisan Design</h4>
                    <p className="text-xs text-[#0d3b38]/75 font-light leading-relaxed">
                      I craft your bespoke stationery suites, custom typography, and interactive live previews.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#f9fbf8] border border-[#d4a55a]/30 space-y-3">
                    <div className="w-10 h-10 rounded-full border border-[#d4a55a] bg-[#00756e] text-[#f3e3c0] font-heading text-lg flex items-center justify-center mx-auto">
                      3
                    </div>
                    <h4 className="font-heading text-xl text-[#005a55]">Delivery &amp; Joy</h4>
                    <p className="text-xs text-[#0d3b38]/75 font-light leading-relaxed">
                      Receive your final print-ready files and published guest portals ready to share with loved ones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Wavy Divider to Mist Band */}
          <div className="w-full overflow-hidden leading-none block bg-white">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block">
              <path d="M0,20 C360,50 720,0 1080,35 C1260,50 1380,20 1440,25 L1440,60 L0,60 Z" fill="#eef8f3" />
            </svg>
          </div>

          {/* 4. Selected Works (Mist Band) */}
          <section className="bg-[#eef8f3] py-16 sm:py-24 px-4 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-10 sm:space-y-12">
              <div className="text-center space-y-2 sm:space-y-3">
                <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
                  Selected Portfolio
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#00756e]">
                  Meaningful stories, thoughtfully shaped.
                </h2>
              </div>

              {/* 4 Curated Cards: 1 Wedding Website, 1 Invitation, 1 Video, 1 Business Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 max-w-md sm:max-w-none mx-auto w-full">
                {homeSelectedWorks.map((item) => (
                  <article
                    key={item.id}
                    onClick={() => {
                      if (item.category === "invitations") {
                        const idx = invitationWorks.findIndex((inv) => inv.id === item.id);
                        setActiveInvitationIndex(idx !== -1 ? idx : 0);
                      } else if (item.videoUrl) {
                        setActiveMockup({
                          title: item.name + " — Video Invitation",
                          videoUrl: item.videoUrl,
                        });
                      } else if (item.url) {
                        setActiveMockup({
                          url: item.url,
                          title: item.name,
                          mobileImg: item.mobileImg || "",
                          canIframe: !!item.canIframe,
                        });
                      } else {
                        window.location.hash = "#contact";
                      }
                    }}
                    className={`tilt-card-container ${item.theme || ""} relative overflow-hidden group cursor-pointer`}
                    style={item.thumb ? { backgroundImage: `url(${item.thumb})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    onMouseEnter={handleMouseEnter}
                  >
                    {item.thumb && (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#002d2a]/90 via-[#004641]/35 to-[#002320]/95 z-0 transition-opacity duration-300 group-hover:opacity-90" />
                    )}
                    <div className="card-inner-gold" />
                    <div className="relative z-10 flex justify-between items-center text-xs font-ui tracking-widest uppercase opacity-85">
                      <span className={item.thumb ? "text-[#f3e3c0]" : ""}>{item.label}</span>
                      <span className="text-[#d4a55a]">✦</span>
                    </div>

                    <div className="relative z-10 text-center my-auto">
                      <div className={`font-script text-3xl sm:text-4xl leading-tight ${item.thumb ? "text-white drop-shadow-md" : ""}`}>{item.name}</div>
                      <div className={`font-heading text-xs sm:text-sm mt-1 leading-snug ${item.thumb ? "text-[#f3e3c0]" : "opacity-80"}`}>{item.sub}</div>
                      <div className="inline-flex items-center justify-center mt-2.5 sm:mt-3 px-3.5 sm:px-4 py-1 rounded-full border border-[#d4a55a] bg-[#d4a55a]/20 text-[#f3e3c0] font-ui text-[10px] sm:text-[11px] tracking-widest uppercase transition-all duration-300 group-hover:bg-[#d4a55a] group-hover:text-[#005a55]">
                        Preview
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center pt-4">
                <a
                  href="#works"
                  className="btn-pill-renovated"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span>All works</span>
                  <span className="arrow-move">→</span>
                </a>
              </div>

              {/* Client Words / Testimonials */}
              <div className="pt-12 border-t border-[#d4a55a]/25 space-y-8">
                <div className="text-center space-y-2">
                  <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
                    Client Words
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl text-[#00756e]">
                    Cherished Celebrations
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Quote 1: Sonali & Major Pallav */}
                  <div className="p-7 rounded-2xl bg-white border border-[#d4a55a]/35 shadow-sm space-y-4 relative">
                    <span className="font-heading text-4xl text-[#d4a55a] leading-none block">“</span>
                    <p className="font-body text-sm text-[#0d3b38]/85 font-light leading-relaxed -mt-3">
                      “Absolutely loved how our invitation turned out! You were so understanding, patient, and creative throughout the process. Highly recommended! ❤️”
                    </p>
                    <div className="pt-2 border-t border-[#d4a55a]/20 flex items-center justify-between">
                      <span className="font-heading text-base text-[#005a55]">Sonali &amp; Major Pallav</span>
                      <span className="font-ui text-[11px] text-[#b8893c] uppercase tracking-wider">Occasion Portal &amp; Folio</span>
                    </div>
                  </div>

                  {/* Quote 2: Aravind & Salini */}
                  <div className="p-7 rounded-2xl bg-white border border-[#d4a55a]/35 shadow-sm space-y-4 relative">
                    <span className="font-heading text-4xl text-[#d4a55a] leading-none block">“</span>
                    <p className="font-body text-sm text-[#0d3b38]/85 font-light leading-relaxed -mt-3">
                      “What a dreamy invitation! Impressed by the creativity and attention to detail. Truly the best invitation I’ve seen! ✨”
                    </p>
                    <div className="pt-2 border-t border-[#d4a55a]/20 flex items-center justify-between">
                      <span className="font-heading text-base text-[#005a55]">Aravind &amp; Salini</span>
                      <span className="font-ui text-[11px] text-[#b8893c] uppercase tracking-wider">Sacred Temple Portal</span>
                    </div>
                  </div>

                  {/* Quote 3: Bala & Shahin */}
                  <div className="p-7 rounded-2xl bg-white border border-[#d4a55a]/35 shadow-sm space-y-4 relative">
                    <span className="font-heading text-4xl text-[#d4a55a] leading-none block">“</span>
                    <p className="font-body text-sm text-[#0d3b38]/85 font-light leading-relaxed -mt-3">
                      “Such a unique and elegant digital invitation! It’s not just an invitation; it’s a beautiful expression of thoughtfulness and style. Absolutely loved it! ❤️”
                    </p>
                    <div className="pt-2 border-t border-[#d4a55a]/20 flex items-center justify-between">
                      <span className="font-heading text-base text-[#005a55]">Bala &amp; Shahin</span>
                      <span className="font-ui text-[11px] text-[#b8893c] uppercase tracking-wider">Digital Wedding Invitation</span>
                    </div>
                  </div>

                  {/* Quote 4: Giridhar & Renee */}
                  <div className="p-7 rounded-2xl bg-white border border-[#d4a55a]/35 shadow-sm space-y-4 relative">
                    <span className="font-heading text-4xl text-[#d4a55a] leading-none block">“</span>
                    <p className="font-body text-sm text-[#0d3b38]/85 font-light leading-relaxed -mt-3">
                      “You understood exactly what we envisioned. Your amazing taste, creativity, and editing made our special occasion even more memorable! 💗”
                    </p>
                    <div className="pt-2 border-t border-[#d4a55a]/20 flex items-center justify-between">
                      <span className="font-heading text-base text-[#005a55]">Giridhar &amp; Renee</span>
                      <span className="font-ui text-[11px] text-[#b8893c] uppercase tracking-wider">Celebration &amp; RSVP Suite</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Wavy Divider to Deep Teal Section */}
          <div className="w-full overflow-hidden leading-none block bg-[#eef8f3]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block">
              <path d="M0,30 C360,0 720,60 1080,25 C1240,10 1380,45 1440,30 L1440,60 L0,60 Z" fill="#005a55" />
            </svg>
          </div>

          {/* 5. Teal Wavy Section */}
          <section className="bg-[#005a55] text-white py-24 px-6">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
              <div className="md:col-span-5 space-y-2 text-center md:text-left">
                <div className="font-script text-5xl sm:text-6xl text-[#f3e3c0]">Let's Create</div>
                <div className="font-ui text-lg sm:text-xl tracking-[0.28em] uppercase text-[#f3e3c0]/85">
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
                  className="btn-pill-renovated btn-pill-light"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <span>Say hello</span>
                  <span className="arrow-move">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* Wavy Divider to Contact Section */}
          <div className="w-full overflow-hidden leading-none block bg-[#005a55] -mb-[2px] relative z-[2]">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 block" shapeRendering="geometricPrecision">
              <path d="M-2,25 C320,55 640,5 960,35 C1200,55 1360,20 1442,30 L1442,65 L-2,65 Z" fill="#f9fbf8" />
            </svg>
          </div>

          {/* 6. Contact Section (On Home Page) */}
          <section id="contact" className="py-20 px-6 max-w-2xl mx-auto space-y-8 scroll-mt-20">
            <div className="text-center space-y-2">
              <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
                Start a Conversation
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl text-[#00756e]">
                Let’s talk about your celebration.
              </h2>
            </div>

            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-ui text-xs tracking-wider uppercase text-[#0d3b38] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Sofia Reyan"
                    className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#0d3b38] focus:outline-none focus:border-[#00756e]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-ui text-xs tracking-wider uppercase text-[#0d3b38] mb-1">
                      Event Date
                    </label>
                    <input
                      type="text"
                      value={form.eventDate}
                      onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                      placeholder="e.g. Dec 2026 / Winter"
                      className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#0d3b38] focus:outline-none focus:border-[#00756e]"
                    />
                  </div>

                  <div>
                    <label className="block font-ui text-xs tracking-wider uppercase text-[#0d3b38] mb-1">
                      City / Venue
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Chennai, Bangalore"
                      className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#0d3b38] focus:outline-none focus:border-[#00756e]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-ui text-xs tracking-wider uppercase text-[#0d3b38] mb-1">
                    I need
                  </label>
                  <select
                    required
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#0d3b38] focus:outline-none focus:border-[#00756e]"
                  >
                    <option value="" disabled hidden>Select an offering...</option>
                    <option value="Occasion & Wedding Website">Occasion &amp; Wedding Website</option>
                    <option value="Bespoke Invitation Suite">Bespoke Invitation Suite</option>
                    <option value="Full Heirloom Bundle (Web + Invite + Video)">Full Heirloom Bundle (Web + Invite + Video)</option>
                    <option value="Video Invitation">Video Invitation</option>
                    <option value="Business Website">Business Website</option>
                  </select>
                </div>

                <div>
                  <label className="block font-ui text-xs tracking-wider uppercase text-[#0d3b38] mb-1">
                    Tell me about your vision
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your celebration, aesthetic ideas, and timeline..."
                    className="w-full bg-white border border-[#d4a55a]/40 rounded-xl px-4 py-2.5 text-sm text-[#0d3b38] focus:outline-none focus:border-[#00756e] resize-none"
                  />
                </div>

                <button type="submit" className="btn-pill-renovated w-full justify-center">
                  <span>Send message</span>
                  <span className="arrow-move">→</span>
                </button>

                <p className="text-center text-xs text-[#0d3b38]/65 font-light pt-1">
                  ✦ I thoughtfully reply within 24 hours.
                </p>
              </form>
            ) : (
              <div className="text-center p-10 bg-white rounded-3xl border border-[#d4a55a] space-y-3">
                <h3 className="font-heading text-3xl text-[#00756e]">Thank you.</h3>
                <p className="font-script text-2xl text-[#b8893c]">Your message has been received.</p>
                <p className="text-sm text-[#0d3b38]/80 font-light">
                  I look forward to discussing your celebration and bringing your feelings to life.
                </p>
                <p className="text-xs text-[#005a55] font-medium pt-2">
                  ✦ I thoughtfully reply within 24 hours.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* =====================================================================
          VIEW: WORKS (#works)
          ===================================================================== */}
      {currentRoute === "works" && (
        <section className="pt-24 sm:pt-32 pb-16 px-4 sm:px-6 max-w-5xl mx-auto space-y-8 sm:space-y-10 w-full overflow-hidden">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="font-ui text-xs tracking-[0.25em] uppercase text-[#b8893c]">
              Portfolio Gallery
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[#00756e] leading-snug">
              A collection of meaningful creations.
            </h1>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-3 max-w-full px-2">
            {[
              { id: "all", label: "All" },
              { id: "websites", label: "Wedding Websites" },
              { id: "invitations", label: "Invitations" },
              { id: "videos", label: "Video Invites" },
              { id: "business", label: "Business Websites" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`font-ui text-[10px] sm:text-xs tracking-wider sm:tracking-widest uppercase px-3 sm:px-5 py-1.5 sm:py-2 rounded-full border transition-all ${
                  activeFilter === f.id
                    ? "bg-[#00756e] text-[#f3e3c0] border-[#00756e]"
                    : "border-[#d4a55a]/40 text-[#0d3b38] hover:border-[#00756e]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid of 3:4 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-md sm:max-w-none mx-auto w-full">
            {works
              .filter((w) => activeFilter === "all" || w.category === activeFilter)
              .slice(0, activeFilter === "all" && !showAllWorks ? 6 : undefined)
              .map((item) => (
                <article
                  key={item.id}
                  onClick={() => {
                    if (item.category === "invitations") {
                      const idx = invitationWorks.findIndex((inv) => inv.id === item.id);
                      setActiveInvitationIndex(idx !== -1 ? idx : 0);
                    } else if (item.videoUrl) {
                      setActiveMockup({
                        title: item.name + " — Video Invitation",
                        videoUrl: item.videoUrl,
                      });
                    } else if (item.url) {
                      setActiveMockup({
                        url: item.url,
                        title: item.name,
                        mobileImg: item.mobileImg || "",
                        canIframe: !!item.canIframe,
                      });
                    } else {
                      window.location.hash = "#contact";
                    }
                  }}
                  className={`tilt-card-container ${item.theme || ""} relative overflow-hidden group cursor-pointer`}
                  style={item.thumb ? { backgroundImage: `url(${item.thumb})`, backgroundSize: "cover", backgroundPosition: "center" } : {}}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  onMouseEnter={handleMouseEnter}
                >
                  {item.thumb && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#002d2a]/90 via-[#004641]/35 to-[#002320]/95 z-0 transition-opacity duration-300 group-hover:opacity-90" />
                  )}
                  <div className="card-inner-gold" />
                  <div className="relative z-10 flex justify-between items-center text-xs font-ui tracking-widest uppercase opacity-85">
                    <span className={item.thumb ? "text-[#f3e3c0]" : ""}>{item.label}</span>
                    <span className="text-[#d4a55a]">✦</span>
                  </div>

                  <div className="relative z-10 text-center my-auto">
                    <div className={`font-script text-3xl sm:text-4xl leading-tight ${item.thumb ? "text-white drop-shadow-md" : ""}`}>{item.name}</div>
                    <div className={`font-heading text-xs sm:text-sm mt-1 leading-snug ${item.thumb ? "text-[#f3e3c0]" : "opacity-80"}`}>{item.sub}</div>
                    <div className="inline-flex items-center justify-center mt-2.5 sm:mt-3 px-3.5 sm:px-4 py-1 rounded-full border border-[#d4a55a] bg-[#d4a55a]/20 text-[#f3e3c0] font-ui text-[10px] sm:text-[11px] tracking-widest uppercase transition-all duration-300 group-hover:bg-[#d4a55a] group-hover:text-[#005a55]">
                      Preview
                    </div>
                  </div>
                </article>
              ))}
          </div>

          {/* Toggle Button for Curated / Full Works */}
          {activeFilter === "all" && works.length > 6 && (
            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setShowAllWorks(!showAllWorks)}
                className="btn-pill-renovated"
              >
                <span>{showAllWorks ? "Show top 6 curated creations" : `Explore all ${works.length} creations`}</span>
                <span className="arrow-move">{showAllWorks ? "↑" : "↓"}</span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* Wavy Divider into Deep Teal Footer */}
      <div className="w-full overflow-hidden leading-none block bg-[#f9fbf8] -mb-[2px] relative z-[2]">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12 sm:h-14 block" shapeRendering="geometricPrecision">
          <path d="M-2,20 C360,50 720,5 1080,40 C1260,55 1380,25 1442,30 L1442,65 L-2,65 Z" fill="#005a55" />
        </svg>
      </div>

      {/* 6. Deep Teal Footer */}
      <footer className="bg-[#005a55] text-[#f3e3c0] py-16 px-6 text-center space-y-6">
        <div className="font-brand text-2xl text-[#f3e3c0]">Zauqode</div>
        <div className="font-script text-2xl text-[#d4a55a]">Design . Code . Elevate</div>

        {/* Direct Contact Channels in Footer */}
        <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 py-4 border-y border-[#d4a55a]/25 max-w-xl mx-auto w-full">
          <div className="flex flex-col items-center gap-1">
            <span className="font-ui text-[11px] uppercase tracking-wider text-[#d4a55a]">Email</span>
            <a href="mailto:zauqode@gmail.com" className="font-body text-sm sm:text-base text-[#f3e3c0] hover:text-white transition-colors">
              zauqode@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-ui text-[11px] uppercase tracking-wider text-[#d4a55a]">Instagram</span>
            <a href="https://instagram.com/zauqode" target="_blank" rel="noreferrer" className="font-body text-sm sm:text-base text-[#f3e3c0] hover:text-white transition-colors">
              @zauqode
            </a>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="font-ui text-[11px] uppercase tracking-wider text-[#d4a55a]">WhatsApp</span>
            <a href="https://wa.me/918946077234" target="_blank" rel="noreferrer" className="font-body text-sm sm:text-base text-[#f3e3c0] hover:text-white transition-colors">
              +91 89460 77234
            </a>
          </div>
        </div>

        <div className="font-ui text-xs tracking-wider text-[#f3e3c0]/55 pt-2">
          © 2026 Zauqode. All rights reserved. Handcrafted with care.
        </div>
      </footer>

      {/* Elite Full-Screen Invitation Modal */}
      {activeInv && (
        <div
          className="fixed inset-0 z-[99999] bg-[#021816]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto animate-fade-in"
          onClick={() => setActiveInvitationIndex(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[92vh] bg-gradient-to-br from-[#041c19] via-[#021816] to-[#01100f] border border-[#d4a55a]/40 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(205,238,227,0.15)] overflow-hidden flex flex-col my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header Bar */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-[#d4a55a]/20 bg-[#011412]/80 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-ui text-xs tracking-[0.25em] uppercase text-[#d4a55a]">
                  Bespoke Invitation Suite
                </span>
                <span className="font-ui text-xs text-[#cdeee3]/40">•</span>
                <span className="font-ui text-xs tracking-widest text-[#cdeee3]/80">
                  {String(activeInvitationIndex! + 1).padStart(2, "0")} / {String(invitationWorks.length).padStart(2, "0")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Previous & Next Navigation Arrows */}
                <button
                  type="button"
                  onClick={() =>
                    setActiveInvitationIndex((prev) =>
                      prev !== null ? (prev - 1 + invitationWorks.length) % invitationWorks.length : null
                    )
                  }
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d4a55a]/40 bg-white/5 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#d4a55a] flex items-center justify-center transition-all cursor-pointer text-sm"
                  aria-label="Previous Invitation"
                  title="Previous (←)"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveInvitationIndex((prev) =>
                      prev !== null ? (prev + 1) % invitationWorks.length : null
                    )
                  }
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d4a55a]/40 bg-white/5 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#d4a55a] flex items-center justify-center transition-all cursor-pointer text-sm"
                  aria-label="Next Invitation"
                  title="Next (→)"
                >
                  →
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvitationIndex(null)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#d4a55a]/40 bg-white/5 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#d4a55a] flex items-center justify-center transition-all cursor-pointer text-sm ml-2"
                  aria-label="Close"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Main 2-Column Content */}
            <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(92vh-60px)]">
              {/* Left Side: Large Invitation with Gentle Zoom */}
              <div className="w-full md:w-[52%] lg:w-[55%] p-4 sm:p-6 lg:p-8 flex items-center justify-center bg-[#010f0e]/60 relative overflow-hidden group">
                <div className="relative max-h-[55vh] md:max-h-[72vh] flex items-center justify-center">
                  <img
                    src={activeInv.thumb || activeInv.mobileImg}
                    alt={activeInv.name}
                    className="max-h-[55vh] md:max-h-[72vh] w-auto max-w-full object-contain rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.6)] border border-[#d4a55a]/30 transition-transform duration-700 ease-out group-hover:scale-[1.03] select-none"
                  />
                </div>
              </div>

              {/* Right Side: 3-Part Description */}
              <div className="w-full md:w-[48%] lg:w-[45%] p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-[#d4a55a]/20 bg-[#031816]/75 space-y-6">
                <div className="space-y-5">
                  {/* Part 1: Couple or occasion name in the script font */}
                  <div className="space-y-1.5 border-b border-[#d4a55a]/20 pb-4">
                    <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-[#d4a55a]">
                      {activeInv.sub}
                    </span>
                    <h3 className="font-script text-3xl sm:text-4xl lg:text-5xl text-[#f3e3c0] leading-tight">
                      {activeInv.name}
                    </h3>
                  </div>

                  {/* Part 2: 2-line story in the Jost font */}
                  <div className="space-y-1.5">
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#d4a55a]/85">
                      Design Story
                    </span>
                    <p className="font-body text-sm sm:text-base text-[#f3e3c0]/90 font-light leading-relaxed border-l-2 border-[#d4a55a]/60 pl-3.5 italic">
                      "{activeInv.story}"
                    </p>
                  </div>

                  {/* Part 3: Small details (Occasion, Style, Included) */}
                  <div className="space-y-3.5 pt-1">
                    <div className="grid grid-cols-2 gap-2.5 text-left">
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-[#d4a55a]/20">
                        <span className="block font-ui text-[10px] uppercase tracking-wider text-[#d4a55a]">
                          Occasion
                        </span>
                        <span className="font-body text-xs sm:text-sm text-[#f3e3c0] font-normal">
                          {activeInv.occasion || "Celebration"}
                        </span>
                      </div>
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-[#d4a55a]/20">
                        <span className="block font-ui text-[10px] uppercase tracking-wider text-[#d4a55a]">
                          Style &amp; Palette
                        </span>
                        <span className="font-body text-xs sm:text-sm text-[#f3e3c0] font-normal">
                          {activeInv.style || "Bespoke Stationery"}
                        </span>
                      </div>
                    </div>

                    {activeInv.included && activeInv.included.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="font-ui text-[10px] uppercase tracking-wider text-[#d4a55a]">
                          Suite Inclusions
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {activeInv.included.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-body font-light bg-[#00756e]/25 text-[#cdeee3] border border-[#d4a55a]/30"
                            >
                              ✦ {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Booking Button */}
                <div className="pt-4 border-t border-[#d4a55a]/20 space-y-2">
                  <a
                    href={`https://wa.me/918946077234?text=${encodeURIComponent(
                      `Hi Zauqode, I saw your "${activeInv.name}" bespoke invitation and would love to design something similar for our upcoming event.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#d4a55a] hover:bg-[#b8893c] text-[#021816] font-ui text-xs sm:text-sm font-semibold tracking-wider uppercase shadow-[0_4px_25px_rgba(212,165,90,0.35)] transition-all cursor-pointer"
                  >
                    Book a similar design
                  </a>
                  <p className="text-[11px] text-center text-[#cdeee3]/60 font-body">
                    Direct consultation with me via WhatsApp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iPhone Mobile Mockup Modal */}
      {activeMockup && (
        <div
          className="fixed inset-0 z-[99999] bg-[#041412]/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto transition-all duration-300"
          onClick={() => setActiveMockup(null)}
        >
          <div
            className="flex flex-col items-center gap-2.5 sm:gap-3 relative max-w-full my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between w-full max-w-[310px] sm:max-w-[350px] px-2 text-[#f3e3c0]">
              <span className="font-heading text-sm sm:text-base tracking-wide truncate pr-2">{activeMockup.title}</span>
              <button
                type="button"
                onClick={() => setActiveMockup(null)}
                className="w-9 h-9 shrink-0 rounded-full border border-[#d4a55a] bg-white/10 hover:bg-[#d4a55a] hover:text-[#005a55] text-[#d4a55a] flex items-center justify-center transition-all cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* iPhone Frame */}
            <div className="w-full max-w-[310px] sm:max-w-[350px] h-[520px] sm:h-[700px] max-h-[74vh] sm:max-h-[84vh] bg-[#09201e] rounded-[40px] sm:rounded-[52px] p-2 sm:p-3 shadow-[0_0_0_3px_#d4a55a,0_0_0_6px_#031412,0_30px_80px_-10px_rgba(0,0,0,0.85)] relative flex flex-col">
              <div className="flex-1 w-full h-full bg-white rounded-[32px] sm:rounded-[42px] overflow-hidden relative flex flex-col">
                {/* Status Bar */}
                <div className="absolute top-0 inset-x-0 h-11 z-30 flex items-center justify-between px-6 pointer-events-none text-xs font-semibold text-black bg-gradient-to-b from-white/95 to-transparent">
                  <span>9:41</span>
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-35 flex items-center justify-end pr-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#101c2c] border border-[#1a2c3f]" />
                  </div>
                  <span>5G 􀛨</span>
                </div>

                {/* Viewport */}
                <div className="w-full h-full pt-11 pb-5 overflow-y-auto bg-[#041412] flex items-center justify-center">
                  {activeMockup.videoUrl ? (
                    <video
                      src={activeMockup.videoUrl}
                      controls
                      autoPlay
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : activeMockup.canIframe ? (
                    <iframe
                      src={activeMockup.url}
                      className="w-full h-full border-0 bg-white"
                      allow="fullscreen"
                      title={activeMockup.title}
                    />
                  ) : (
                    <img
                      src={activeMockup.mobileImg}
                      alt={activeMockup.title}
                      className="w-full h-auto block"
                    />
                  )}
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/60 rounded-full z-35 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

