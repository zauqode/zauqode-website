import React, { useEffect, useRef, useState } from 'react';
import styles from './Hero.module.css';
import { Button } from './Button';

export interface HeroProps {
  onSelectCategory?: (category: string) => void;
}

const mantraWords = [
  'intention.',
  'emotion.',
  'devotion.',
  'distinction.',
  'grace.',
];

const craftLinks = [
  {
    label: 'Invitations',
    category: 'invitations',
    note: 'Heirloom foil print suites, custom monograms & digital folios.',
  },
  {
    label: 'Occasion Web',
    category: 'websites',
    note: 'Interactive wedding & celebration portals with live RSVP concierge.',
  },
  {
    label: 'Stall Boards',
    category: 'stalls',
    note: 'Custom event signage & illustrated boards crafted for wedding counters.',
  },
  {
    label: 'Motion',
    category: 'videos',
    note: 'Cinematic musical reels & animated invitation stories.',
  },
  {
    label: 'Brand Web',
    category: 'business',
    note: 'Editorial digital flagships engineered with restraint and speed.',
  },
];

/**
 * Hero Component
 * Luxury studio banner with fixed editorial line and rotating Sacramento mantra word.
 */
export function Hero({ onSelectCategory }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [wordIdx, setWordIdx] = useState(0);
  const [hoveredCraft, setHoveredCraft] = useState<number | null>(null);

  // Cycle the curly script mantra word smoothly (disabled if user prefers reduced motion)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const timer = window.setInterval(() => {
      setWordIdx((prev) => (prev + 1) % mantraWords.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  // Track mouse for subtle ambient mint glow
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--gx', `${x}px`);
    heroRef.current.style.setProperty('--gy', `${y}px`);
  };

  const handleExploreCraft = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      window.location.hash = '#works';
    }
  };

  const activeWord = mantraWords[wordIdx] || mantraWords[0];
  const activeCraftNote =
    hoveredCraft !== null
      ? craftLinks[hoveredCraft]?.note
      : 'Nothing templated. Nothing rushed. I design bespoke invitations and interactive occasion websites where artistry meets enduring precision.';

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

      {/* Top Corner Labels inside frame */}
      <div className={styles.topLabelLeft}>Designer &amp; Developer</div>
      <div className={styles.topLabelRight}>Bespoke Design Studio</div>

      {/* Centered Banner Content */}
      <div className={styles.bannerCenter}>
        {/* Discipline Eyebrow */}
        <div className={styles.bannerEyebrow}>
          <span>Invitations</span>
          <span className={styles.eyebrowStar}>✦</span>
          <span>Occasion Websites</span>
          <span className={styles.eyebrowStar}>✦</span>
          <span>Digital Craft</span>
        </div>

        {/* 2-Line Banner Headline: Line 1 Fixed + Line 2 Changing Curly Mantra */}
        <h1 className={styles.headline}>
          <span className={styles.fixedLineMask}>
            <span className={styles.fixedLine}>Design with</span>
          </span>
          <span className={styles.curlyLineMask} aria-live="polite">
            <span key={activeWord} className={styles.rotatingCurlyWord}>
              {activeWord}
            </span>
          </span>
        </h1>

        {/* Subtle Mantra Progress Dots (Clickable) */}
        <div className={styles.mantraPips} role="tablist" aria-label="Studio Mantra Words">
          {mantraWords.map((word, idx) => (
            <button
              key={word}
              type="button"
              role="tab"
              aria-selected={idx === wordIdx}
              aria-label={`Select ${word.replace('.', '')}`}
              onClick={() => setWordIdx(idx)}
              className={`${styles.mantraPip} ${idx === wordIdx ? styles.mantraPipActive : ''}`}
            />
          ))}
        </div>

        {/* Concise Mantra Statement / Interactive Craft Insight */}
        <p className={styles.mantraCopy} key={hoveredCraft !== null ? `hover-${hoveredCraft}` : 'default'}>
          {activeCraftNote}
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

        {/* Interactive Minimal Discipline Links Bar */}
        <div className={styles.craftStrip} aria-label="Explore crafts by discipline">
          {craftLinks.map((craft, idx) => (
            <button
              key={craft.category}
              type="button"
              onClick={() => handleExploreCraft(craft.category)}
              onMouseEnter={() => setHoveredCraft(idx)}
              onMouseLeave={() => setHoveredCraft(null)}
              onFocus={() => setHoveredCraft(idx)}
              onBlur={() => setHoveredCraft(null)}
              className={styles.craftChip}
            >
              <span className={styles.craftDot}>✦</span>
              <span>{craft.label}</span>
            </button>
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
        <svg
          viewBox="0 0 112 112"
          className={styles.rotatingSvg}
          aria-hidden="true"
        >
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
