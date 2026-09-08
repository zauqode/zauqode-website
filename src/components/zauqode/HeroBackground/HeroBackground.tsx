import { Atmosphere } from "./Atmosphere";
import { WindLines } from "./WindLines";
import { CottonPlant } from "./CottonPlant";
import { ParticleCanvas } from "./ParticleCanvas";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Atmospheric background radial illumination */}
      <Atmosphere />

      {/* Layer 2: Wind flow lines */}
      <WindLines />

      {/* Layer 3: Botanical line-art cotton plant with GSAP wind motion */}
      <CottonPlant />

      {/* Layer 4: Floating cotton fiber particle canvas */}
      <ParticleCanvas />
    </div>
  );
}
