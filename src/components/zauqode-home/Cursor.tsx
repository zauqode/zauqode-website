import React, { useEffect, useState } from 'react';
import styles from './Cursor.module.css';

/**
 * Custom Cursor Component (Desktop only)
 * 38px gold border circle that follows mouse & expands to 70px over clickable links and buttons.
 */
export function Cursor() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) {
        setIsHovering(false);
        return;
      }

      const isInteractive = Boolean(
        target.closest('a, button, [role="button"], input, select, textarea, .interactive')
      );
      setIsHovering(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!pos || !isVisible) return null;

  return (
    <div
      className={`${styles.cursor} ${isHovering ? styles.hovering : ''}`}
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
      }}
      aria-hidden="true"
    />
  );
}

