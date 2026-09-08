import { Atmosphere } from "./Atmosphere";
import { WindLines } from "./WindLines";
import { CottonPlantImage } from "./CottonPlantImage";
import { FiberParticleCanvas } from "./FiberParticleCanvas";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Dark atmospheric background with edge radial illumination */}
      <Atmosphere />

      {/* Layer 2: SVG wind flow lines */}
      <WindLines />

      {/* Layer 3: Botanical cotton plant image with GSAP sway */}
      <CottonPlantImage />

      {/* Layer 4: Floating fiber particle canvas */}
      <FiberParticleCanvas />
    </div>
  );
}
