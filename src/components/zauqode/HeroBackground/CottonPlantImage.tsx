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
        left: "-3%",
        bottom: "-4%",
        width: "clamp(340px, 38vw, 680px)",
        maxHeight: "90vh",
        opacity: 0.92,
        transformOrigin: "bottom left",
      }}
    >
      {/* Soft teal backdrop glow behind left cotton plant */}
      <div
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none -z-10 opacity-70"
        style={{
          background: "radial-gradient(circle at 35% 60%, rgba(45, 212, 191, 0.16), transparent 65%)",
        }}
      />

      <img
        src={cottonPlantImg}
        alt="Botanical Cotton Plant Artwork"
        className="w-full h-auto object-contain mix-blend-screen filter drop-shadow-[0_0_25px_rgba(45,212,191,0.2)]"
      />
    </div>
  );
}

