import { useEffect, useRef } from "react";
import gsap from "gsap";
import cottonPlantImg from "@/assets/hero/cotton-plant.png";

export function CottonPlantImage() {
  const plantRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Organic slow main stem sway (7s seamless loop duration)
      if (plantRef.current) {
        gsap.to(plantRef.current, {
          rotate: 0.35,
          x: 2.5,
          y: -1.5,
          duration: 7,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 2. Soft cyan/turquoise bioluminescent breathing glow pulse (6.5s loop)
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.85,
          scale: 1.03,
          duration: 6.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 3. Delicate edge glow aura breathing on the cotton blossoms
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          filter: "drop-shadow(0px 0px 32px rgba(45, 212, 191, 0.32)) drop-shadow(0px 0px 14px rgba(120, 230, 225, 0.22)) drop-shadow(0px 10px 40px rgba(0, 0, 0, 0.6))",
          duration: 7,
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
        opacity: 0.96,
        transformOrigin: "bottom left",
      }}
    >
      {/* Bioluminescent cyan & turquoise breathing glow aura behind cotton bolls */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-full blur-3xl pointer-events-none -z-10 opacity-60 transition-transform duration-1000"
        style={{
          background: "radial-gradient(circle at 28% 55%, rgba(45, 212, 191, 0.28), rgba(20, 184, 166, 0.12) 50%, transparent 72%)",
        }}
      />

      <img
        ref={imgRef}
        src={cottonPlantImg}
        alt="Botanical Cotton Plant Artwork"
        className="w-full h-auto object-contain filter drop-shadow-[0_0_24px_rgba(45,212,191,0.22)] drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
      />
    </div>
  );
}


