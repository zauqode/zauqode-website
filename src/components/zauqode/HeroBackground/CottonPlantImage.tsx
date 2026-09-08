import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CottonPlantImage() {
  const plantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (plantRef.current) {
        gsap.to(plantRef.current, {
          rotate: 0.6,
          x: 4,
          y: -2,
          duration: 9.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    }, plantRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={plantRef}
      className="absolute pointer-events-none z-10 transition-opacity duration-700"
      style={{
        left: "-2%",
        bottom: "-5%",
        width: "clamp(380px, 42vw, 750px)",
        opacity: 0.88,
        transformOrigin: "bottom left",
      }}
    >
      {/* Subtle radial glow behind cotton plant */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 35% 65%, rgba(45, 212, 191, 0.14), transparent 65%)",
        }}
      />

      <img
        src="/assets/hero/cotton-plant.png"
        alt="Botanical Cotton Plant"
        className="w-full h-auto object-contain filter drop-shadow-[0_0_20px_rgba(45,212,191,0.15)]"
      />
    </div>
  );
}
