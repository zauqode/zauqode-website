import React from "react";

export type ArrowDirection = "right" | "up-right" | "left";

interface ArrowIconProps {
  direction?: ArrowDirection;
  className?: string;
}

const ARROW_PATHS: Record<ArrowDirection, string> = {
  "up-right": "M4.5 11.5L11.5 4.5M6 4.5H11.5V10",
  right: "M2.5 8H13.5M9 3.5L13.5 8L9 12.5",
  left: "M13.5 8H2.5M7 3.5L2.5 8L7 12.5",
};

/**
 * Vector SVG arrow icon so iOS/Safari and desktop browsers never substitute emoji glyphs.
 */
export function ArrowIcon({ direction = "right", className = "" }: ArrowIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`.trim()}
      style={{ width: "1em", height: "1em", verticalAlign: "-0.125em" }}
    >
      <path d={ARROW_PATHS[direction]} />
    </svg>
  );
}
