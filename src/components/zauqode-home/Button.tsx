import React from 'react';
import styles from './Button.module.css';
import { ArrowIcon, type ArrowDirection } from './ArrowIcon';

const ARROW_DIRECTION_MAP: Record<string, ArrowDirection> = {
  '→': 'right',
  '↗': 'up-right',
  '←': 'left',
  right: 'right',
  'up-right': 'up-right',
  left: 'left',
};

interface ButtonProps {
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  arrow?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
  className?: string;
  dataPixelSource?: string;
  dataPixelLabel?: string;
}

/**
 * Reusable Pill Button Component
 * Pure CSS: 1px teal border, bottom sliding fill, and animated directional vector arrow.
 */
export function Button({
  href,
  target,
  rel,
  children,
  arrow,
  onClick,
  className = '',
  dataPixelSource,
  dataPixelLabel,
}: ButtonProps) {
  const combinedClassName = `${styles.button} ${className}`.trim();
  const mappedDirection = arrow ? ARROW_DIRECTION_MAP[arrow] : undefined;
  const arrowNode = arrow ? (
    <span className={styles.arrow}>
      {mappedDirection ? <ArrowIcon direction={mappedDirection} /> : arrow}
    </span>
  ) : null;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        onClick={onClick}
        className={combinedClassName}
        data-pixel-source={dataPixelSource}
        data-pixel-label={dataPixelLabel}
      >
        <span>{children}</span>
        {arrowNode}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={combinedClassName}>
      <span>{children}</span>
      {arrowNode}
    </button>
  );
}

