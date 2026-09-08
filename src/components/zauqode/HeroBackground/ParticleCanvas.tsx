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
  type: "dust" | "fiber" | "strand";
  waveOffset: number;
  waveSpeed: number;
  life: number;
  maxLife: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 640;
    const maxParticles = isMobile ? 18 : 50;
    const particles: FiberParticle[] = [];

    // Resize handler with pixel ratio
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Create a particle
    const createParticle = (spawnX?: number, spawnY?: number): FiberParticle => {
      // Spawn near left cotton plant area if not specified
      const startX = spawnX ?? Math.random() * (width * 0.35);
      const startY = spawnY ?? Math.random() * (height * 0.8) + height * 0.1;

      const randType = Math.random();
      const type: FiberParticle["type"] = randType < 0.5 ? "dust" : randType < 0.8 ? "fiber" : "strand";
      const maxOpacity = Math.random() * 0.35 + 0.15;

      return {
        x: startX,
        y: startY,
        vx: Math.random() * 0.35 + 0.18, // Left to right drift
        vy: (Math.random() - 0.5) * 0.15,
        size: type === "dust" ? Math.random() * 2.5 + 1.2 : Math.random() * 6 + 4,
        opacity: 0,
        maxOpacity,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.012,
        type,
        waveOffset: Math.random() * 100,
        waveSpeed: Math.random() * 0.003 + 0.001,
        life: 0,
        maxLife: Math.random() * 350 + 250, // 4 - 10s at 60fps
      };
    };

    // Seed initial pool
    for (let i = 0; i < Math.floor(maxParticles * 0.6); i++) {
      const p = createParticle(Math.random() * width * 0.7, Math.random() * height);
      p.life = Math.random() * p.maxLife * 0.5; // Staggered start
      p.opacity = p.maxOpacity * 0.5;
      particles.push(p);
    }

    // Occasional wind gust release from blossom coordinates (approx. left 15-25% x, 15-55% y)
    let lastBurstTime = Date.now();
    const burstInterval = Math.random() * 5000 + 7000; // 7-12s

    let time = 0;

    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // Periodic gust release check
      const now = Date.now();
      if (now - lastBurstTime > burstInterval && particles.length < maxParticles) {
        lastBurstTime = now;
        const burstCount = Math.floor(Math.random() * 5) + 3;
        const burstX = width * (Math.random() * 0.2 + 0.1);
        const burstY = height * (Math.random() * 0.4 + 0.15);
        for (let i = 0; i < burstCount; i++) {
          particles.push(createParticle(burstX, burstY));
        }
      }

      // Maintain background particle count
      if (particles.length < maxParticles * 0.5) {
        particles.push(createParticle());
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        p.life++;

        // Fade in & out lifecycle
        const progress = p.life / p.maxLife;
        if (progress < 0.15) {
          p.opacity = (progress / 0.15) * p.maxOpacity;
        } else if (progress > 0.75) {
          p.opacity = (1 - (progress - 0.75) / 0.25) * p.maxOpacity;
        } else {
          p.opacity = p.maxOpacity;
        }

        // Motion update
        p.x += p.vx;
        p.y += p.vy + Math.sin(time * p.waveSpeed + p.waveOffset) * 0.25;
        p.rotation += p.rotationSpeed;

        // Remove dead or off-screen particles
        if (p.life >= p.maxLife || p.x > width + 50 || p.y < -30 || p.y > height + 30) {
          particles.splice(i, 1);
          continue;
        }

        // Render particle by shape type
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));

        if (p.type === "dust") {
          // Soft circular cotton dust
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
          grad.addColorStop(0, "rgba(245, 255, 250, 0.9)");
          grad.addColorStop(0.6, "rgba(180, 240, 235, 0.4)");
          grad.addColorStop(1, "rgba(45, 212, 191, 0)");
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === "fiber") {
          // Soft thin cotton fiber line
          ctx.strokeStyle = "rgba(235, 245, 240, 0.75)";
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, 0);
          ctx.quadraticCurveTo(0, -1.5, p.size / 2, 0);
          ctx.stroke();
        } else {
          // Whispy curved strand
          ctx.strokeStyle = "rgba(180, 240, 235, 0.6)";
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, -1);
          ctx.bezierCurveTo(-p.size / 4, 2, p.size / 4, -2, p.size / 2, 1);
          ctx.stroke();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    // Pause when tab is not active
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
