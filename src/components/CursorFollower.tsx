import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let outerX = pointerX;
    let outerY = pointerY;
    let innerX = pointerX;
    let innerY = pointerY;
    let velocity = 0;
    let animationFrame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const dx = event.clientX - pointerX;
      const dy = event.clientY - pointerY;
      velocity = Math.min(1, Math.sqrt(dx * dx + dy * dy) / 80);
      pointerX = event.clientX;
      pointerY = event.clientY;
      outer.style.opacity = "1";
      inner.style.opacity = "1";
    };

    const handlePointerDown = () => {
      outer.classList.add("cursor-follower-pressed");
      inner.classList.add("cursor-follower-pressed");
    };

    const handlePointerUp = () => {
      outer.classList.remove("cursor-follower-pressed");
      inner.classList.remove("cursor-follower-pressed");
    };

    const animate = () => {
      outerX += (pointerX - outerX) * 0.16;
      outerY += (pointerY - outerY) * 0.16;
      innerX += (pointerX - innerX) * 0.38;
      innerY += (pointerY - innerY) * 0.38;
      velocity *= 0.86;

      const scale = 1 + velocity * 0.35;
      outer.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) translate(-50%, -50%) scale(${scale})`;
      inner.style.transform = `translate3d(${innerX}px, ${innerY}px, 0) translate(-50%, -50%) scale(${1 + velocity * 0.18})`;

      animationFrame = window.requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []);

  return (
    <>
      <div ref={outerRef} className="cursor-follower-outer" aria-hidden="true" />
      <div ref={innerRef} className="cursor-follower-inner" aria-hidden="true" />
    </>
  );
}
