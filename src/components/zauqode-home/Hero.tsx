import React, { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { Button } from "./Button";
import { HERO_MANTRA_SVGS } from "./heroMantraSvgs";
import heroLogoVideo from "../../assets/hero-logo-video.webm";
import heroLogoAnimWebp from "../../assets/hero-logo-anim.webp";
import heroLogoPoster from "../../assets/hero-logo-poster.png";

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
  const [activeWord, setActiveWord] = useState(HERO_MANTRA_SVGS[0]?.word ?? "emotion.");
  const [emblemMode, setEmblemMode] = useState<"poster" | "video" | "webp">("poster");
  const [replayTick, setReplayTick] = useState(0);

  // Choose transparent VP9 WebM on Chromium/Firefox or Animated WebP on Apple WebKit / iOS
  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
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

  const handleReplayEmblem = () => {
    if (emblemMode === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (emblemMode === "webp") {
      setReplayTick((n) => n + 1);
    }
  };

  // Stroke-by-stroke SVG handwriting cycle (~1s initial delay, 5.4s period, 4.7s fade-out)
  useEffect(() => {
    const el = wsvgRef.current;
    if (!el) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
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
  }, []);

  // Track mouse for subtle ambient mint glow
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty("--gx", `${x}px`);
    heroRef.current.style.setProperty("--gy", `${y}px`);
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

      {/* Centered Banner Content */}
      <div className={styles.bannerCenter}>
        {/* Animated Zauqode Atelier Crest */}
        <button
          type="button"
          onClick={handleReplayEmblem}
          className={styles.emblemCrest}
          aria-label="Zauqode animated monogram emblem"
          title="Replay Zauqode signature animation"
        >
          {emblemMode === "video" ? (
            <video
              ref={videoRef}
              src={heroLogoVideo}
              poster={heroLogoPoster}
              autoPlay
              muted
              playsInline
              preload="auto"
              className={styles.emblemMedia}
            />
          ) : emblemMode === "webp" ? (
            <img
              key={replayTick}
              src={replayTick > 0 ? `${heroLogoAnimWebp}?r=${replayTick}` : heroLogoAnimWebp}
              alt="Zauqode signature monogram"
              className={styles.emblemMedia}
            />
          ) : (
            <img
              src={heroLogoPoster}
              alt="Zauqode signature monogram"
              className={styles.emblemMedia}
            />
          )}
        </button>

        {/* 2-Line Banner Headline: Line 1 Fixed + Line 2 Changing Curly Mantra */}
        <h1 className={styles.headline}>
          <span className={styles.fixedLineMask}>
            <span className={styles.fixedLine}>Where elegance meets</span>
          </span>
          <span className={styles.curlyLineMask} aria-live="polite">
            <span className={styles.srOnly}>{activeWord}</span>
            <i ref={wsvgRef} className={styles.wsvg} aria-hidden="true" />
          </span>
        </h1>

        {/* Concise Mantra Sub-line */}
        <p className={styles.mantraCopy}>
          Bespoke design and digital experiences, crafted with artistry, care and feeling.
        </p>

        {/* Centered Compact Action Pills */}
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

        {/* Studio Ethos Tag Row */}
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

      {/* Bottom-Left Studio Standard Credo */}
      <div className={styles.studioStandard}>
        <span>Zero Templates</span>
        <span className={styles.standardStar}>✦</span>
        <span>Crafted to Endure</span>
      </div>

      {/* Right Frame Vertical Signature */}
      <div className={styles.verticalText} aria-hidden="true">
        Design . Code . Elevate
      </div>

      {/* Bottom-Right Rotating Badge */}
      <div className={styles.badgeContainer} aria-hidden="true">
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
