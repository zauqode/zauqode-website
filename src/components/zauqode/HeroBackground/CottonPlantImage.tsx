import { useEffect, useRef } from "react";
import gsap from "gsap";
import cottonPlantImg from "@/assets/hero/cotton-plant.png";

export function CottonPlantImage() {
  const plantRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      if (plantRef.current) {
        gsap.to(plantRef.current, {
          rotate: 0.5,
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
      className="absolute pointer-events-none z-10 transition-all duration-700 select-none"
      style={{
        left: "0",
        bottom: "0",
        width: "clamp(380px, 46vw, 820px)",
        maxHeight: "92vh",
        opacity: 0.95,
        transformOrigin: "bottom left",
      }}
    >
      {/* Soft teal backdrop glow behind left cotton plant */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none -z-10 opacity-70"
        style={{
          background: "radial-gradient(circle at 25% 65%, rgba(45, 212, 191, 0.22), transparent 70%)",
        }}
      />

      <img
        src={cottonPlantImg}
        alt="Botanical Cotton Plant Artwork"
        className="w-full h-auto object-contain filter drop-shadow-[0_0_30px_rgba(45,212,191,0.25)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}


