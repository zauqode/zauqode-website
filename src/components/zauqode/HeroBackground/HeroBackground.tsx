import { Atmosphere } from "./Atmosphere";
import { WindLines } from "./WindLines";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Layer 1: Dark atmospheric background with edge radial illumination */}
      <Atmosphere />

      {/* Layer 2: SVG wind flow lines */}
      <WindLines />
    </div>
  );
}
