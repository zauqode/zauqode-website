import React, { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { Button } from "./Button";
import { HERO_MANTRA_SVGS } from "./heroMantraSvgs";
import heroLogoPoster from "../../assets/hero-logo-poster.webp";
import heroLogoAnimWebp from "../../assets/hero-logo-anim.webp";
import logoVideo from "../../assets/logo-video.webm";

export interface HeroProps {
  onSelectCategory?: (category: string) => void;
}

const studioTags = ["Bespoke", "Elegant", "Heartfelt"];

/**
 * Hero Component
 * Luxury studio banner with signature animated Zauqode emblem crest, fixed editorial line,
 * and rotating stroke-animated Sacramento SVGs.
 */
export function Hero(_props: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const wsvgRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const glowRafRef = useRef<number | null>(null);
  const [activeWord, setActiveWord] = useState(HERO_MANTRA_SVGS[0]?.word ?? "emotion.");
  const [emblemMode, setEmblemMode] = useState<"poster" | "video" | "webp">("poster");
  const [heroVisible, setHeroVisible] = useState(true);

  // Choose transparent VP9 WebM on Chromium/Firefox, Animated WebP on Apple WebKit,
  // or static WebP poster on reduced-motion / Data-Saver / 2G connections
  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const navConn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const lowBandwidth =
      !!navConn?.saveData ||
      navConn?.effectiveType === "slow-2g" ||
      navConn?.effectiveType === "2g";

    if (reducedMotion || lowBandwidth) {
      setEmblemMode("poster");
      return;
    }

    const ua = navigator.userAgent;
    const isAppleEngine =
      (/AppleWebKit/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Firefox|CriOS|FxiOS/i.test(ua)) ||
      /iPhone|iPad|iPod/i.test(ua);

    if (isAppleEngine) {
      setEmblemMode("webp");
      return;
    }

    const probe = document.createElement("video");
    if (probe.canPlayType('video/webm; codecs="vp9"')) {
      setEmblemMode("video");
    } else {
      setEmblemMode("webp");
    }
  }, []);

  // Pause off-screen Hero video and CSS badge rotation cleanly via IntersectionObserver
  useEffect(() => {
    const sectionEl = heroRef.current;
    if (!sectionEl || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setHeroVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(sectionEl);
    return () => {
      observer.disconnect();
      if (glowRafRef.current !== null) {
        window.cancelAnimationFrame(glowRafRef.current);
      }
    };
  }, []);

  // Enforce muted looping & viewport-aware play/pause across React hydration
  useEffect(() => {
    if (emblemMode !== "video" || !videoRef.current) return;
    const el = videoRef.current;
    el.defaultMuted = true;
    el.muted = true;
    el.volume = 0;
    el.loop = true;
    if (heroVisible) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [emblemMode, heroVisible]);

  // Stroke-by-stroke SVG handwriting cycle (~1s initial delay, 5.4s period, 4.7s fade-out)
  useEffect(() => {
    const el = wsvgRef.current;
    if (!el) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !heroVisible) {
      el.classList.remove(styles.out);
      el.innerHTML = HERO_MANTRA_SVGS[0]?.svg ?? "";
      setActiveWord(HERO_MANTRA_SVGS[0]?.word ?? "emotion.");
      return;
    }

    let idx = 0;
    let fadeTimer: number | undefined;
    let intervalId: number | undefined;

    const playWord = (wordIndex: number) => {
      const item = HERO_MANTRA_SVGS[wordIndex % HERO_MANTRA_SVGS.length];
      if (!item || !wsvgRef.current) return;
      if (fadeTimer !== undefined) {
        window.clearTimeout(fadeTimer);
      }
      wsvgRef.current.classList.remove(styles.out);
      wsvgRef.current.innerHTML = item.svg;
      setActiveWord(item.word);
      fadeTimer = window.setTimeout(() => {
        wsvgRef.current?.classList.add(styles.out);
      }, 4700);
    };

    const startTimer = window.setTimeout(() => {
      playWord(idx);
      intervalId = window.setInterval(() => {
        idx = (idx + 1) % HERO_MANTRA_SVGS.length;
        playWord(idx);
      }, 5400);
    }, 1000);

    return () => {
      window.clearTimeout(startTimer);
      if (fadeTimer !== undefined) {
        window.clearTimeout(fadeTimer);
      }
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [heroVisible]);

  // Track pointer on fine-pointer desktops throttled with requestAnimationFrame
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (
      !heroRef.current ||
      typeof window === "undefined" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const target = heroRef.current;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (glowRafRef.current !== null) return;
    glowRafRef.current = window.requestAnimationFrame(() => {
      const rect = target.getBoundingClientRect();
      target.style.setProperty("--gx", `${clientX - rect.left}px`);
      target.style.setProperty("--gy", `${clientY - rect.top}px`);
      glowRafRef.current = null;
    });
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className={styles.hero}
      onMouseMove={handleMouseMove}
      aria-label="Hero Banner"
    >
      {/* Ambient Mint Cursor Glow */}
      <div className={styles.cursorGlow} aria-hidden="true" />

      {/* Outer Architectural 1px Gold Frame */}
      <div className={styles.goldFrame} aria-hidden="true" />

      {/* Centered Top Frame Label */}
      <div className={styles.topLabel}>
        <span>Designer &amp; Developer</span>
        <span aria-hidden="true">·</span>
        <span>Bespoke Design Studio</span>
      </div>

      {/* Split Hero Content: Left Editorial Copy / Right Monogram Crest */}
      <div className={styles.heroSplit}>
        {/* Left Side: Mantra Headline, Sub-line, Actions & Ethos */}
        <div className={styles.heroCopy}>
          <h1 className={styles.headline}>
            <span className={styles.fixedLineMask}>
              <span className={styles.fixedLine}>Where elegance meets</span>
            </span>
            <span className={styles.curlyLineMask} aria-live="polite">
              <span className={styles.srOnly}>{activeWord}</span>
              <i ref={wsvgRef} className={styles.wsvg} aria-hidden="true" />
            </span>
          </h1>

          <p className={styles.mantraCopy}>
            Bespoke design and digital experiences, crafted with artistry, care and feeling.
          </p>

          <div className={styles.buttonGroup}>
            <Button href="#works" arrow="→">
              View Works
            </Button>
            <Button
              href="https://wa.me/918946077234"
              target="_blank"
              rel="noopener noreferrer"
              arrow="↗"
            >
              Chat on WhatsApp
            </Button>
          </div>

          <div className={styles.craftStrip} aria-label="Studio attributes">
            {studioTags.map((tag) => (
              <span key={tag} className={styles.craftChip}>
                <span className={styles.craftDot} aria-hidden="true">
                  ✦
                </span>
                <span>{tag}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Looping Muted Zauqode Atelier Crest Showcase */}
        <div className={styles.heroVisual}>
          <div className={styles.emblemAura} aria-hidden="true" />
          <div
            className={styles.emblemCrest}
            role="img"
            aria-label="Zauqode animated monogram emblem"
          >
            {emblemMode === "video" ? (
              <video
                ref={videoRef}
                src={logoVideo}
                poster={heroLogoPoster}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                width={580}
                height={534}
                aria-hidden="true"
                className={styles.emblemMedia}
              />
            ) : emblemMode === "webp" ? (
              <img
                src={heroLogoAnimWebp}
                alt=""
                width={320}
                height={294}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                aria-hidden="true"
                className={styles.emblemMedia}
              />
            ) : (
              <img
                src={heroLogoPoster}
                alt=""
                width={512}
                height={512}
                loading="eager"
                decoding="sync"
                fetchPriority="high"
                aria-hidden="true"
                className={styles.emblemMedia}
              />
            )}
          </div>
        </div>
      </div>

      {/* Right Frame Vertical Signature */}
      <div className={styles.verticalText} aria-hidden="true">
        Design . Code . Elevate
      </div>

      {/* Bottom-Right Rotating Badge */}
      <div
        className={`${styles.badgeContainer}${heroVisible ? "" : ` ${styles.badgePaused}`}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 112 112" className={styles.rotatingSvg} aria-hidden="true">
          <defs>
            <path
              id="badgeCirclePath"
              d="M 56, 56 m -41, 0 a 41,41 0 1,1 82,0 a 41,41 0 1,1 -82,0"
            />
          </defs>
          <text
            fill="var(--deep, #005a55)"
            fontFamily="'Manrope', 'Jost', sans-serif"
            fontWeight="600"
            fontSize="7.6px"
            letterSpacing="0.95px"
          >
            <textPath href="#badgeCirclePath" startOffset="0%" textLength="250">
              DESIGN · CODE · ELEVATE · DESIGN · CODE · ELEVATE ·
            </textPath>
          </text>
          <text
            x="56"
            y="62"
            textAnchor="middle"
            fill="var(--gold-dark, #785212)"
            fontSize="18px"
            fontFamily="serif"
          >
            ✦
          </text>
        </svg>
      </div>
    </section>
  );
}
