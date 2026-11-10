import React, { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { Button } from "./Button";

export interface HeroProps {
  onSelectCategory?: (category: string) => void;
}

const mantraWords = ["emotion.", "memory.", "meaning.", "feeling."];

const studioTags = ["Bespoke", "Elegant", "Heartfelt"];

/**
 * Hero Component
 * Luxury studio banner with fixed editorial line and rotating Sacramento mantra word.
 */
export function Hero(_props: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [wordIdx, setWordIdx] = useState(0);

  // Cycle the curly script mantra word smoothly (disabled if user prefers reduced motion)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      setWordIdx((prev) => (prev + 1) % mantraWords.length);
    }, 3200);
    return () => window.clearInterval(timer);
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

  const activeWord = mantraWords[wordIdx] || mantraWords[0];

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
        {/* 2-Line Banner Headline: Line 1 Fixed + Line 2 Changing Curly Mantra */}
        <h1 className={styles.headline}>
          <span className={styles.fixedLineMask}>
            <span className={styles.fixedLine}>Where elegance meets</span>
          </span>
          <span className={styles.curlyLineMask} aria-live="polite">
            <span key={activeWord} className={styles.rotatingCurlyWord}>
              {activeWord}
            </span>
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
            fill="var(--teal, #00756e)"
            fontFamily="'Poiret One', cursive, sans-serif"
            fontSize="9.4px"
            letterSpacing="2.2px"
            textTransform="uppercase"
          >
            <textPath href="#badgeCirclePath" startOffset="0%">
              Design · Code · Elevate · Design · Code · Elevate ·
            </textPath>
          </text>
          <text
            x="56"
            y="62"
            textAnchor="middle"
            fill="var(--gold, #d4a55a)"
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
