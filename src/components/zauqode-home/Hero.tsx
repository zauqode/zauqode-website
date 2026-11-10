import React, { useRef } from 'react';
import styles from './Hero.module.css';
import { Button } from './Button';

/**
 * Hero Component
 * Minimal, sleek, artist-portfolio home screen layout for Zauqode.
 */
export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Set --gx and --gy CSS custom properties on hero container from mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    heroRef.current.style.setProperty('--gx', `${x}px`);
    heroRef.current.style.setProperty('--gy', `${y}px`);
  };

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      onMouseMove={handleMouseMove}
      aria-label="Hero Section"
    >
      {/* 8. Soft 560px Cursor Glow behind content */}
      <div className={styles.cursorGlow} aria-hidden="true" />

      {/* 1. Gold Frame: 1px border inset 92px 3vw 28px */}
      <div className={styles.goldFrame} aria-hidden="true" />

      {/* 2. Top Corner Labels inside frame (top 122px) */}
      <div className={styles.topLabelLeft}>Invitation Designer</div>
      <div className={styles.topLabelRight}>Occasion Websites</div>

      {/* 3. Headline: Antic Didone + Sacramento */}
      <div className={styles.headlineWrap}>
        <h1 className={styles.headline}>
          <span className={styles.lineMask}>
            <span className={styles.line1}>Invitations</span>
          </span>
          <span className={styles.lineMask}>
            <span className={styles.line2}>
              that carry your
              <span className={styles.scriptWord}>feelings.</span>
            </span>
          </span>
        </h1>
      </div>

      {/* 4. Row under headline: Tagline + Gold line + Two pill buttons */}
      <div className={styles.actionRow}>
        <p className={styles.tagline}>Designed with care, love and trust.</p>

        <div className={styles.dividerLine} aria-hidden="true" />

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

      {/* 5. Vertical text on the right inside frame */}
      <div className={styles.verticalText} aria-hidden="true">
        Design . Code . Elevate
      </div>

      {/* 6. Scroll cue bottom-left inside frame (bottom 52px) */}
      <div className={styles.scrollCue} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollWord}>Scroll</span>
      </div>

      {/* 7. Rotating badge bottom-right (112px, 84px on mobile) */}
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
          {/* Centered gold star */}
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

