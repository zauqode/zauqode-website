import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CottonPlant() {
  const stemRef = useRef<SVGGElement>(null);
  const branch1Ref = useRef<SVGGElement>(null);
  const branch2Ref = useRef<SVGGElement>(null);
  const branch3Ref = useRef<SVGGElement>(null);
  const leaf1Ref = useRef<SVGGElement>(null);
  const leaf2Ref = useRef<SVGGElement>(null);
  const blossom1Ref = useRef<SVGGElement>(null);
  const blossom2Ref = useRef<SVGGElement>(null);
  const blossom3Ref = useRef<SVGGElement>(null);
  const blossom4Ref = useRef<SVGGElement>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 1. Main Stem - subtle slow wind sway
      if (stemRef.current) {
        gsap.to(stemRef.current, {
          x: 4,
          rotate: 0.4,
          duration: 6.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 2. Branch 1 (Bottom Left)
      if (branch1Ref.current) {
        gsap.to(branch1Ref.current, {
          rotate: 1.2,
          x: -3,
          duration: 4.8,
          delay: 0.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 3. Branch 2 (Mid-Left Hero Branch)
      if (branch2Ref.current) {
        gsap.to(branch2Ref.current, {
          rotate: -1.4,
          x: 5,
          y: -2,
          duration: 6.2,
          delay: 0.5,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 4. Branch 3 (Top Left)
      if (branch3Ref.current) {
        gsap.to(branch3Ref.current, {
          rotate: 1.5,
          x: -4,
          duration: 5.4,
          delay: 0.1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 5. Leaf Groups
      if (leaf1Ref.current) {
        gsap.to(leaf1Ref.current, {
          rotate: 2.5,
          duration: 3.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      if (leaf2Ref.current) {
        gsap.to(leaf2Ref.current, {
          rotate: -2.2,
          duration: 4.2,
          delay: 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }

      // 6. Cotton Blossoms independent floating
      const blossoms = [
        { ref: blossom1Ref, dur: 4.5, delay: 0.1, y: -4, rot: 1.8 },
        { ref: blossom2Ref, dur: 5.8, delay: 0.4, y: 5, rot: -2 },
        { ref: blossom3Ref, dur: 4.2, delay: 0.2, y: -3, rot: 1.5 },
        { ref: blossom4Ref, dur: 5.0, delay: 0.6, y: 4, rot: -1.6 },
      ];

      blossoms.forEach(({ ref: bRef, dur, delay, y, rot }) => {
        if (bRef.current) {
          gsap.to(bRef.current, {
            y,
            rotate: rot,
            duration: dur,
            delay,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full max-w-[320px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[720px] h-[75%] sm:h-[88%] lg:h-[95%] pointer-events-none z-10 opacity-85 sm:opacity-95 transition-opacity duration-700">
      <svg
        viewBox="0 0 700 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(45,212,191,0.15)]"
      >
        <defs>
          <radialGradient id="blossomGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(245, 255, 250, 0.75)" />
            <stop offset="60%" stopColor="rgba(200, 240, 235, 0.4)" />
            <stop offset="100%" stopColor="rgba(45, 212, 191, 0.0)" />
          </radialGradient>
          <linearGradient id="stemGradient" x1="0%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="rgba(45, 212, 191, 0.5)" />
            <stop offset="70%" stopColor="rgba(80, 210, 205, 0.35)" />
            <stop offset="100%" stopColor="rgba(180, 240, 235, 0.25)" />
          </linearGradient>
        </defs>

        {/* 1. Main Stem Base */}
        <g id="main-stem" ref={stemRef} className="origin-bottom-left">
          <path
            d="M 60 980 C 80 880, 110 750, 150 620 C 185 505, 230 380, 290 250 C 330 165, 360 110, 390 70"
            stroke="url(#stemGradient)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M 63 980 C 82 880, 111 750, 151 620"
            stroke="rgba(120, 230, 225, 0.18)"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
        </g>

        {/* 2. Branch 1 */}
        <g id="branch-1" ref={branch1Ref} style={{ transformOrigin: "110px 750px" }}>
          <path
            d="M 110 750 C 70 710, 30 650, 20 570 C 15 530, 25 480, 45 440"
            stroke="rgba(80, 210, 205, 0.35)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <g id="leaf-group-1" ref={leaf1Ref} style={{ transformOrigin: "45px 440px" }}>
            <path
              d="M 45 440 C 20 410, 10 360, 25 330 C 50 345, 60 395, 45 440 Z"
              fill="rgba(20, 140, 135, 0.08)"
              stroke="rgba(120, 230, 225, 0.25)"
              strokeWidth="0.9"
            />
            <path
              d="M 45 440 C 32 385, 25 330, 25 330"
              stroke="rgba(80, 210, 205, 0.2)"
              strokeWidth="0.6"
            />
          </g>
          <g id="cotton-blossom-1" ref={blossom1Ref} style={{ transformOrigin: "45px 440px" }}>
            <circle cx="45" cy="440" r="32" fill="url(#blossomGlow)" />
            <path
              d="M 25 430 C 15 410, 35 390, 50 405 C 65 390, 85 410, 75 430 C 85 450, 65 470, 45 460 C 25 470, 10 445, 25 430 Z"
              fill="rgba(235, 245, 240, 0.35)"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="0.8"
            />
            <path
              d="M 45 460 L 35 475 M 45 460 L 55 475 M 45 460 L 45 482"
              stroke="rgba(80, 210, 205, 0.5)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path d="M 32 415 C 40 410, 52 412, 60 418" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.5" />
            <path d="M 28 435 C 38 430, 55 435, 68 440" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.5" />
          </g>
        </g>

        {/* 3. Branch 2 */}
        <g id="branch-2" ref={branch2Ref} style={{ transformOrigin: "185px 520px" }}>
          <path
            d="M 185 520 C 140 450, 110 370, 105 280 C 102 230, 120 180, 145 140"
            stroke="rgba(80, 210, 205, 0.38)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <g id="leaf-group-2" ref={leaf2Ref} style={{ transformOrigin: "115px 330px" }}>
            <path
              d="M 115 330 C 70 310, 50 250, 75 210 C 110 235, 125 290, 115 330 Z"
              fill="rgba(20, 140, 135, 0.09)"
              stroke="rgba(120, 230, 225, 0.28)"
              strokeWidth="0.9"
            />
            <path
              d="M 115 330 C 95 270, 75 210, 75 210"
              stroke="rgba(80, 210, 205, 0.22)"
              strokeWidth="0.7"
            />
          </g>
          <g id="cotton-blossom-2" ref={blossom2Ref} style={{ transformOrigin: "145px 140px" }}>
            <circle cx="145" cy="140" r="46" fill="url(#blossomGlow)" />
            <path
              d="M 115 130 C 100 100, 135 75, 160 95 C 185 75, 215 105, 200 135 C 215 165, 180 195, 150 180 C 120 195, 95 165, 115 130 Z"
              fill="rgba(240, 250, 245, 0.45)"
              stroke="rgba(255, 255, 255, 0.75)"
              strokeWidth="1.1"
            />
            <path
              d="M 145 180 C 130 195, 125 215, 120 230 M 145 180 C 155 200, 165 215, 175 225 M 145 180 L 145 235"
              stroke="rgba(80, 210, 205, 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path d="M 125 115 C 145 105, 165 110, 185 125" stroke="rgba(255, 255, 255, 0.8)" strokeWidth="0.6" />
            <path d="M 118 145 C 140 135, 170 145, 190 155" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="0.6" />
          </g>
        </g>

        {/* 4. Branch 3 */}
        <g id="branch-3" ref={branch3Ref} style={{ transformOrigin: "290px 250px" }}>
          <path
            d="M 290 250 C 270 190, 260 130, 275 80"
            stroke="rgba(80, 210, 205, 0.35)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <g id="cotton-blossom-3" ref={blossom3Ref} style={{ transformOrigin: "275px 80px" }}>
            <circle cx="275" cy="80" r="36" fill="url(#blossomGlow)" />
            <path
              d="M 255 70 C 240 50, 265 30, 285 45 C 305 30, 325 50, 315 75 C 325 95, 300 115, 280 100 C 260 115, 240 95, 255 70 Z"
              fill="rgba(235, 245, 240, 0.4)"
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="0.9"
            />
            <path
              d="M 280 100 L 270 120 M 280 100 L 290 120"
              stroke="rgba(80, 210, 205, 0.5)"
              strokeWidth="1.2"
            />
          </g>
        </g>

        {/* 5. Branch 4 */}
        <g id="cotton-blossom-4" ref={blossom4Ref} style={{ transformOrigin: "390px 70px" }}>
          <circle cx="390" cy="70" r="28" fill="url(#blossomGlow)" />
          <path
            d="M 375 65 C 365 48, 385 35, 400 48 C 412 35, 428 50, 418 68 C 428 82, 408 98, 395 88 C 380 98, 365 82, 375 65 Z"
            fill="rgba(235, 245, 240, 0.38)"
            stroke="rgba(255, 255, 255, 0.65)"
            strokeWidth="0.8"
          />
          <path
            d="M 390 70 L 375 100"
            stroke="rgba(80, 210, 205, 0.4)"
            strokeWidth="1.1"
          />
        </g>
      </svg>
    </div>
  );
}
