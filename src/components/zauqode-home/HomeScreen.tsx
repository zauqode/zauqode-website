import React, { useState, useEffect } from 'react';
import styles from './HomeScreen.module.css';
import { Navbar } from './Navbar';
import { Hero } from './Hero';

/**
 * HomeScreen Component (Hero section only)
 * Minimal, sleek, artist-portfolio feel for Zauqode with lots of white space.
 */
export function HomeScreen() {
  const [activeRoute, setActiveRoute] = useState('home');
  const [curtainState, setCurtainState] = useState<'idle' | 'in' | 'out'>('idle');

  // Handle route transition with curtain animation if navigated
  const handleRouteChange = (newRoute: string) => {
    if (newRoute === activeRoute) return;

    // Check reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveRoute(newRoute);
      window.location.hash = `#${newRoute}`;
      return;
    }

    setCurtainState('in');
    setTimeout(() => {
      setActiveRoute(newRoute);
      window.location.hash = `#${newRoute}`;
      setTimeout(() => {
        setCurtainState('out');
        setTimeout(() => setCurtainState('idle'), 600);
      }, 250);
    }, 450);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      setActiveRoute(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className={styles.homeContainer}>
      {/* Fixed soft mint radial background glows in top-left & bottom-right */}
      <div className={styles.backgroundGlows} aria-hidden="true" />

      {/* Fixed Glass Blur Navbar */}
      <Navbar activeRoute={activeRoute} onRouteChange={handleRouteChange} />

      {/* Main Content: Hero Section Only */}
      <main id="home">
        <Hero />
      </main>

      {/* Full-Screen Page Transition Curtain */}
      <div
        className={`${styles.curtain} ${
          curtainState === 'in'
            ? styles.curtainIn
            : curtainState === 'out'
            ? styles.curtainOut
            : ''
        }`}
        aria-hidden="true"
      >
        <span className={styles.curtainText}>Zauqode</span>
      </div>
    </div>
  );
}

