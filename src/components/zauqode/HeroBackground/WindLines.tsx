import { useEffect, useRef } from "react";
import gsap from "gsap";

const windPaths = [
  { d: "M -100 220 C 200 180, 500 280, 1200 200", dur: 11, delay: 0 },
  { d: "M -100 380 C 300 320, 700 420, 1300 350", dur: 14, delay: 2.5 },
  { d: "M -100 520 C 150 490, 600 560, 1250 480", dur: 9.5, delay: 5.0 },
  { d: "M -100 140 C 400 100, 800 190, 1350 120", dur: 13, delay: 1.2 },
  { d: "M -100 680 C 250 640, 650 720, 1200 650", dur: 12, delay: 4.1 },
];

export function WindLines() {
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const pathEls = containerRef.current?.querySelectorAll("path");
      pathEls?.forEach((path, i) => {
        const length = (path as SVGPathElement).getTotalLength();
        gsap.set(path, {
          strokeDasharray: `${length / 3} ${length}`,
          strokeDashoffset: length,
          opacity: 0,
        });

        const { dur, delay } = windPaths[i % windPaths.length];

        gsap.to(path, {
          strokeDashoffset: -length,
          opacity: 0.22,
          duration: dur,
          delay: delay,
          ease: "sine.inOut",
          repeat: -1,
          repeatDelay: 2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={containerRef}
      viewBox="0 0 1200 800"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 w-full h-full pointer-events-none z-1 overflow-hidden"
    >
      {windPaths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          stroke="url(#windLineGrad)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      ))}

      <defs>
        <linearGradient id="windLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(45, 212, 191, 0)" />
          <stop offset="30%" stopColor="rgba(80, 210, 205, 0.25)" />
          <stop offset="70%" stopColor="rgba(180, 240, 235, 0.35)" />
          <stop offset="100%" stopColor="rgba(45, 212, 191, 0)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
