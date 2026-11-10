import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  arrow?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
}

/**
 * Reusable Pill Button Component
 * Pure CSS: 1px teal border, bottom sliding fill, and animated directional arrow.
 */
export function Button({
  href,
  target,
  rel,
  children,
  arrow,
  onClick,
  className = '',
}: ButtonProps) {
  const combinedClassName = `${styles.button} ${className}`.trim();

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        onClick={onClick}
        className={combinedClassName}
      >
        <span>{children}</span>
        {arrow && <span className={styles.arrow}>{arrow}</span>}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClassName}>
      <span>{children}</span>
      {arrow && <span className={styles.arrow}>{arrow}</span>}
    </button>
  );
}

