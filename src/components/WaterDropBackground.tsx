import { useEffect, useRef } from "react";

interface WaterDropBackgroundProps {
  className?: string;
}

interface Ripple {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  strength: number;
}

export default function WaterDropBackground({ className = "" }: WaterDropBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let lastDropTime = 0;
    const ripples: Ripple[] = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const createDrop = (timestamp: number) => {
      const x = width * (0.22 + Math.random() * 0.62);
      const y = height * (0.52 + Math.random() * 0.22);
      const strength = 0.55 + Math.random() * 0.45;

      ripples.push({
        x,
        y,
        age: 0,
        maxAge: 1300 + Math.random() * 350,
        strength,
      });
      lastDropTime = timestamp;
    };

    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, width, height);

      const isDark = Boolean(canvas.closest(".dark"));
      const centerX = width * 0.5;
      const horizonY = height * 0.64;
      const floorHeight = Math.max(260, height * 0.42);
      const glow = ctx.createRadialGradient(centerX, horizonY, 24, centerX, horizonY, width * 0.56);

      if (isDark) {
        glow.addColorStop(0, "rgba(154, 213, 247, 0.16)");
        glow.addColorStop(0.34, "rgba(154, 213, 247, 0.07)");
        glow.addColorStop(1, "rgba(9, 17, 21, 0)");
      } else {
        glow.addColorStop(0, "rgba(45, 100, 130, 0.12)");
        glow.addColorStop(0.36, "rgba(45, 100, 130, 0.05)");
        glow.addColorStop(1, "rgba(248, 249, 250, 0)");
      }

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      if (timestamp - lastDropTime > 1200 + Math.random() * 950) {
        createDrop(timestamp);
      }

      for (let i = ripples.length - 1; i >= 0; i -= 1) {
        const ripple = ripples[i];
        ripple.age += 16.7;
        if (ripple.age >= ripple.maxAge) {
          ripples.splice(i, 1);
        }
      }

      const spacing = Math.max(8, Math.min(13, width / 110));
      const startY = height * 0.48;

      for (let y = startY; y < height; y += spacing) {
        const depth = (y - startY) / floorHeight;
        const perspective = 0.25 + depth * 1.4;
        const rowSpacing = spacing / perspective;
        const rowWidth = width * (0.25 + depth * 1.55);
        const left = centerX - rowWidth / 2;
        const right = centerX + rowWidth / 2;

        for (let x = left; x <= right; x += rowSpacing) {
          const wave = Math.sin(x * 0.012 + timestamp * 0.0018) * 1.4;
          const pointY = y + wave * depth;
          let brightness = isDark ? 0.2 + depth * 0.36 : 0.09 + depth * 0.18;
          let size = 0.55 + depth * 1.45;

          for (const ripple of ripples) {
            const dx = x - ripple.x;
            const dy = (pointY - ripple.y) * 1.55;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const radius = (ripple.age / ripple.maxAge) * width * 0.28;
            const ring = Math.max(0, 1 - Math.abs(distance - radius) / 16);
            const fade = 1 - ripple.age / ripple.maxAge;

            brightness += ring * fade * ripple.strength * (isDark ? 0.9 : 0.55);
            size += ring * fade * ripple.strength * 1.9;
          }

          ctx.beginPath();
          ctx.fillStyle = isDark
            ? `rgba(235, 248, 255, ${Math.min(0.9, brightness)})`
            : `rgba(18, 64, 84, ${Math.min(0.48, brightness)})`;
          ctx.arc(x, pointY, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const ripple of ripples) {
        const progress = ripple.age / ripple.maxAge;
        const opacity = (1 - progress) * ripple.strength;
        const radius = progress * width * 0.28;

        ctx.beginPath();
        ctx.ellipse(ripple.x, ripple.y, radius, radius * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(235, 248, 255, ${0.42 * opacity})`
          : `rgba(45, 100, 130, ${0.28 * opacity})`;
        ctx.lineWidth = 1.2 + opacity * 1.8;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(ripple.x, ripple.y, radius * 0.62, radius * 0.14, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(154, 213, 247, ${0.34 * opacity})`
          : `rgba(45, 100, 130, ${0.22 * opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    createDrop(0);
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full pointer-events-none opacity-75 dark:opacity-90 ${className}`}
      aria-hidden="true"
    />
  );
}
