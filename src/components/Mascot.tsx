import { useEffect, useState } from "react";

export default function Mascot() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / 20;
      const y = (e.clientY - innerHeight / 2) / 20;
      setCoords({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="relative flex justify-center items-center h-[500px]"
      style={{
        transform: `translate(${coords.x}px, ${coords.y}px) rotate(${coords.x * 0.08}deg)`,
        transition: "transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {/* Floating Mascot */}
      <div className="relative z-20 animate-[float_6s_ease-in-out_infinite]">
        <img
          alt="Notipala Mascot"
          className="w-full max-w-[450px] md:max-w-[480px] h-auto drop-shadow-[0_25px_35px_rgba(45,100,130,0.25)] select-none"
          draggable={false}
          src="/assets/notipala-mascot.png"
        />
      </div>

      {/* Behind Ambient Glow */}
      <div className="absolute w-[360px] h-[360px] bg-primary/15 blur-[120px] rounded-full -z-10 animate-pulse pointer-events-none"></div>

      {/* Floating metallic ring details to emphasize "Skeuomorphism 3.0" */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full border border-primary/20 bg-white/20 backdrop-blur-md -z-10 animate-bounce text-xs flex items-center justify-center pointer-events-none">
        <span className="material-symbols-outlined text-xs text-primary/60">hub</span>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 rounded-full border border-white/50 bg-white/30 backdrop-blur-md -z-10 animate-[pulse_3s_infinite] flex items-center justify-center pointer-events-none">
        <span className="material-symbols-outlined text-sm text-primary/50">bolt</span>
      </div>
    </div>
  );
}
