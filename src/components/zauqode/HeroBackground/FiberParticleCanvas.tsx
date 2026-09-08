import { useEffect, useRef } from "react";

interface FiberParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  rotation: number;
  rotationSpeed: number;
  imgIndex: number;
  depth: "bg" | "mid" | "fg";
  waveOffset: number;
  waveSpeed: number;
  life: number;
  maxLife: number;
}

const FIBER_SOURCES = [
  "/assets/hero/fibers/fiber-01.png",
  "/assets/hero/fibers/fiber-02.png",
  "/assets/hero/fibers/fiber-03.png",
  "/assets/hero/fibers/fiber-04.png",
  "/assets/hero/fibers/fiber-05.png",
  "/assets/hero/fibers/fiber-06.png",
];

export function FiberParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preload fiber PNG assets
    const loadedImages: HTMLImageElement[] = [];
    FIBER_SOURCES.forEach((src) => {
      const img = new Image();
      img.src = src;
      loadedImages.push(img);
    });

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive particle limit
    const getMaxParticles = () => {
      const w = window.innerWidth;
      if (w < 640) return 12;
      if (w < 1024) return 25;
      return 40;
    };

    let maxParticles = getMaxParticles();
    const particles: FiberParticle[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      maxParticles = getMaxParticles();
    };
    window.addEventListener("resize", handleResize);

    // 3 Blossom Emission Zones
    const getEmissionZone = () => {
      const zones = [
        { x: width * 0.18, y: height * 0.22 }, // Upper blossom
        { x: width * 0.28, y: height * 0.42 }, // Middle-right blossom
        { x: width * 0.12, y: height * 0.65 }, // Lower-left blossom
      ];
      return zones[Math.floor(Math.random() * zones.length)];
    };

    const createParticle = (spawnX?: number, spawnY?: number): FiberParticle => {
      const zone = getEmissionZone();
      const x = spawnX ?? zone.x + (Math.random() - 0.5) * 40;
      const y = spawnY ?? zone.y + (Math.random() - 0.5) * 40;

      // Assign 3 depths
      const randDepth = Math.random();
      const depth: FiberParticle["depth"] = randDepth < 0.33 ? "bg" : randDepth < 0.75 ? "mid" : "fg";

      let baseSize = 20;
      let maxOpacity = 0.3;

      if (depth === "bg") {
        baseSize = Math.random() * 12 + 10;
        maxOpacity = Math.random() * 0.12 + 0.08;
      } else if (depth === "mid") {
        baseSize = Math.random() * 18 + 16;
        maxOpacity = Math.random() * 0.2 + 0.15;
      } else {
        baseSize = Math.random() * 24 + 22;
        maxOpacity = Math.random() * 0.3 + 0.2;
      }

      return {
        x,
        y,
        vx: Math.random() * 0.35 + (depth === "bg" ? 0.15 : 0.25),
        vy: (Math.random() - 0.5) * 0.12,
        size: baseSize,
        opacity: 0,
        maxOpacity,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        imgIndex: Math.floor(Math.random() * FIBER_SOURCES.length),
        depth,
        waveOffset: Math.random() * 100,
        waveSpeed: Math.random() * 0.003 + 0.001,
        life: 0,
        maxLife: Math.random() * 400 + 300, // 5 to 12s at 60fps
      };
    };

    // Seed initial midground pool
    for (let i = 0; i < Math.floor(maxParticles * 0.5); i++) {
      const p = createParticle(Math.random() * width * 0.6, Math.random() * height * 0.8 + height * 0.1);
      p.life = Math.random() * p.maxLife * 0.6;
      particles.push(p);
    }

    let lastBurstTime = Date.now();
    let burstInterval = Math.random() * 7000 + 5000; // 5 to 12s

    let time = 0;

    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Gentle Burst Emission
      const now = Date.now();
      if (now - lastBurstTime > burstInterval && particles.length < maxParticles) {
        lastBurstTime = now;
        burstInterval = Math.random() * 7000 + 5000;
        const burstZone = getEmissionZone();
        const burstCount = Math.floor(Math.random() * 6) + 2; // 2 to 7 particles
        for (let b = 0; b < burstCount; b++) {
          particles.push(createParticle(burstZone.x, burstZone.y));
        }
      }

      // Update and Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        // Lifecycle Fade In/Out
        const progress = p.life / p.maxLife;
        if (progress < 0.15) {
          p.opacity = (progress / 0.15) * p.maxOpacity;
        } else if (progress > 0.75) {
          p.opacity = (1 - (progress - 0.75) / 0.25) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        // Center Content Protection Zone (Reduce opacity in middle 50% of viewport)
        const distFromCenter = Math.abs(p.x - width * 0.5) / (width * 0.5);
        if (distFromCenter < 0.35) {
          p.opacity *= 0.45;
        }

        // Motion physics
        p.x += p.vx;
        p.y += p.vy + Math.sin(time * p.waveSpeed + p.waveOffset) * 0.3;
        p.rotation += p.rotationSpeed;

        if (p.life >= p.maxLife || p.x > width + 60 || p.y < -50 || p.y > height + 50) {
          particles.splice(i, 1);
          continue;
        }

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        const img = loadedImages[p.imgIndex];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Delicate organic fiber fallback if image is loading
          ctx.strokeStyle = "rgba(235, 245, 240, 0.8)";
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, -p.size / 4);
          ctx.quadraticCurveTo(0, p.size / 3, p.size / 2, -p.size / 4);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15 overflow-hidden"
    />
  );
}
