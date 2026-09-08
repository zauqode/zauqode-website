import { useEffect, useRef } from "react";
import gsap from "gsap";

const windPaths = [
  { d: "M -120 180 C 250 140, 600 240, 1300 160", width: 0.8, dur: 12, delay: 0 },
  { d: "M -120 320 C 350 260, 750 380, 1350 310", width: 1.1, dur: 16, delay: 3 },
  { d: "M -120 450 C 200 420, 650 490, 1300 420", width: 0.6, dur: 11, delay: 6 },
  { d: "M -120 580 C 400 520, 850 620, 1400 540", width: 1.0, dur: 15, delay: 1.5 },
  { d: "M -120 240 C 300 210, 700 290, 1320 220", width: 0.7, dur: 13, delay: 8 },
  { d: "M -120 700 C 280 660, 720 740, 1280 670", width: 0.9, dur: 17, delay: 4.5 },
  { d: "M -120 110 C 450 70, 800 150, 1380 90", width: 0.5, dur: 14, delay: 9.5 },
];

export function WindLines() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll("path");
      paths?.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength();
        gsap.set(path, {
          strokeDasharray: `${length / 2.5} ${length}`,
          strokeDashoffset: length,
          opacity: 0,
        });

        const currentWind = windPaths[i % windPaths.length] || { dur: 9, delay: 0 };
        const dur = currentWind.dur;
        const delay = currentWind.delay;

        gsap.to(path, {
          strokeDashoffset: -length,
          opacity: 0.22,
          duration: dur,
          delay: delay,
          ease: "sine.inOut",
          repeat: -1,
          repeatDelay: 3,
        });
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none z-1 overflow-hidden"
    >
      <defs>
        <linearGradient id="windGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(80, 210, 205, 0)" />
          <stop offset="35%" stopColor="rgba(80, 210, 205, 0.18)" />
          <stop offset="65%" stopColor="rgba(120, 230, 225, 0.25)" />
          <stop offset="100%" stopColor="rgba(80, 210, 205, 0)" />
        </linearGradient>
      </defs>

      {windPaths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke="url(#windGrad)"
          strokeWidth={p.width}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
