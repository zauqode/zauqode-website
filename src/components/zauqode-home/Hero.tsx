import React, { useRef, useState } from 'react';
import styles from './Hero.module.css';
import { Button } from './Button';

export interface HeroProps {
  onSelectCategory?: (category: string) => void;
}

const disciplines = [
  {
    num: '01',
    shortLabel: 'Invitations',
    title: 'Bespoke Invitations',
    category: 'invitations',
    description:
      'Heirloom stationery suites, custom monograms, and refined digital keepsake invitations tailored to your celebration.',
    deliverables: 'Print Suites · Custom Monograms · WhatsApp Cards',
    cta: 'Explore invitation craft',
  },
  {
    num: '02',
    shortLabel: 'Occasion Web',
    title: 'Occasion & Wedding Websites',
    category: 'websites',
    description:
      'Interactive celebration portals featuring custom storytelling, live RSVP tracking, itineraries, and guest concierge.',
    deliverables: 'Celebration Portals · Live RSVP · Custom Domains',
    cta: 'View wedding portals',
  },
  {
    num: '03',
    shortLabel: 'Motion',
    title: 'Motion & Video Invites',
    category: 'videos',
    description:
      'Atmospheric vertical video reveals and audio-synced invitation reels designed to delight loved ones instantly.',
    deliverables: 'Vertical Reels · Musical Sync · Share-Ready MP4',
    cta: 'Watch video invites',
  },
  {
    num: '04',
    shortLabel: 'Brand Web',
    title: 'Brand & Business Websites',
    category: 'business',
    description:
      'Editorial, high-trust digital flagships engineered from scratch to elevate discerning studios and businesses.',
    deliverables: 'Bespoke UI · Clean Code · Mobile Craft',
    cta: 'Explore brand builds',
  },
];

/**
 * Hero Component
 * Editorial, interactive atelier hero showcasing Zauqode's Craft & Positioning.
 */
export function Hero({ onSelectCategory }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const activeDiscipline = disciplines[activeIdx] || disciplines[0];

  // Track mouse for soft radial ambient glow behind hero content
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--gx', `${x}px`);
    heroRef.current.style.setProperty('--gy', `${y}px`);
  };

  const handleDisciplineExplore = (category: string) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    } else {
      window.location.hash = '#works';
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className={styles.hero}
      onMouseMove={handleMouseMove}
      aria-label="Hero Section"
    >
      {/* Ambient Mint Cursor Glow */}
      <div className={styles.cursorGlow} aria-hidden="true" />

      {/* Outer Architectural 1px Gold Frame */}
      <div className={styles.goldFrame} aria-hidden="true" />

      {/* Top Frame Corner Labels */}
      <div className={styles.topLabelLeft}>Designer &amp; Developer</div>
      <div className={styles.topLabelRight}>Crafted with Feeling</div>

      {/* Main 2-Column Editorial Composition */}
      <div className={styles.heroGrid}>
        {/* Left Column: Headline, Clear Positioning & CTAs */}
        <div className={styles.heroPrimary}>
          <div className={styles.headlineWrap}>
            <h1 className={styles.headline}>
              <span className={styles.lineMask}>
                <span className={styles.line1}>Design that</span>
              </span>
              <span className={styles.lineMask}>
                <span className={styles.line2}>
                  feels
                  <span className={styles.scriptWord}>personal.</span>
                </span>
              </span>
            </h1>
          </div>

          <p className={styles.leadCopy}>
            I design bespoke digital &amp; heirloom invitations, interactive occasion websites, and tailored brand flagships—crafted from genuine feeling and clean code.
          </p>

          <div className={styles.actionRow}>
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
          </div>
        </div>

        {/* Right Column: Interactive Signature Discipline Rail */}
        <aside className={styles.disciplineRail} aria-label="Studio Craft Disciplines">
          <div className={styles.railHeader}>
            <span className={styles.railEyebrow}>What I Craft</span>
            <span className={styles.railHint}>Select to inspect</span>
          </div>

          <div className={styles.disciplineList} role="tablist" aria-label="Disciplines">
            {disciplines.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={item.num}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIdx(idx)}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`${styles.disciplineItem} ${isActive ? styles.disciplineActive : ''}`}
                >
                  <span className={styles.disciplineNum}>{item.num}</span>
                  <span className={styles.disciplineName}>{item.title}</span>
                  <span className={styles.disciplineArrow} aria-hidden="true">
                    {isActive ? '✦' : '›'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile quick tabs for ultra-compact view */}
          <div className={styles.mobileTabs} role="tablist" aria-label="Disciplines Mobile">
            {disciplines.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={`m-${item.num}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveIdx(idx)}
                  className={`${styles.mobileTab} ${isActive ? styles.mobileTabActive : ''}`}
                >
                  <span className={styles.mobileTabNum}>{item.num}</span>
                  <span>{item.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Live Detail Inspector Panel */}
          <div className={styles.detailCard} key={activeDiscipline.num}>
            <div className={styles.detailTop}>
              <span className={styles.detailTitle}>{activeDiscipline.title}</span>
              <span className={styles.detailBadge}>{activeDiscipline.num}</span>
            </div>
            <p className={styles.detailDesc}>{activeDiscipline.description}</p>
            <div className={styles.detailDeliverables}>{activeDiscipline.deliverables}</div>
            <button
              type="button"
              onClick={() => handleDisciplineExplore(activeDiscipline.category)}
              className={styles.detailAction}
            >
              <span>{activeDiscipline.cta}</span>
              <span className={styles.detailArrow}>→</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom-Left Studio Standard Line */}
      <div className={styles.studioStandard}>
        <span>Zero Templates</span>
        <span className={styles.standardStar}>✦</span>
        <span>Tailored to Emotion</span>
        <span className={`${styles.standardStar} ${styles.hideOnNarrow}`}>✦</span>
        <span className={styles.hideOnNarrow}>1-on-1 Concierge Craft</span>
      </div>

      {/* Right Frame Edge Vertical Signature */}
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
