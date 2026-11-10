import React, { useState } from 'react';
import styles from './Navbar.module.css';

interface NavbarProps {
  activeRoute?: string;
  onRouteChange?: (route: string) => void;
}

const navItems = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'About', href: '#about', id: 'about' },
  { label: 'Services', href: '#services', id: 'services' },
  { label: 'Works', href: '#works', id: 'works' },
  { label: 'Contact', href: '#contact', id: 'contact' },
];

/**
 * Navbar Component
 * Fixed glass blur header on desktop, full-screen overlay on mobile.
 */
export function Navbar({ activeRoute = 'home', onRouteChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (onRouteChange) {
      e.preventDefault();
      onRouteChange(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={styles.navbar} aria-label="Main Navigation">
        {/* Left: ZAUQODE Logo in Croissant One */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, 'home')}
          className={styles.logo}
          aria-label="Zauqode Home"
        >
          ZAUQODE
        </a>

        {/* Right: Desktop Links in Poiret One */}
        <ul className={styles.navLinks}>
          {navItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={`${styles.navLink} ${activeRoute === item.id ? styles.active : ''}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile: Menu Toggle Button (<820px) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className={styles.menuButton}
          aria-label="Open Navigation Menu"
        >
          Menu
        </button>
      </nav>

      {/* Mobile Full-Screen Overlay with normal-sized Antic Didone links */}
      <div
        className={`${styles.mobileOverlay} ${mobileMenuOpen ? styles.open : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          className={styles.mobileCloseButton}
          aria-label="Close Navigation Menu"
        >
          ✕
        </button>

        <ul className={styles.mobileLinks}>
          {navItems.map((item) => (
            <li key={`mobile-${item.id}`}>
              <a
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.id)}
                className={styles.mobileLink}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

