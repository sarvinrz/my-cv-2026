"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const LABELS: Record<string, string> = {
  drag: "DRAG",
  view: "VIEW",
  link: "→",
};

/**
 * Minimal trailing cursor ring for fine pointers only. The native cursor
 * stays visible; this only adds context (DRAG over the avatar, VIEW over
 * projects). Fully disabled on touch devices and for reduced motion.
 */
export function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useReducedMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    let x = -100;
    let y = -100;
    let cx = -100;
    let cy = -100;
    let active = false;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const kind = target?.dataset.cursor;
      if (kind && LABELS[kind]) {
        label.textContent = LABELS[kind];
        active = true;
      } else {
        active = false;
      }
      ring.dataset.active = String(active);
    };

    const loop = () => {
      cx += (x - cx) * 0.18;
      cy += (y - cy) * 0.18;
      ring.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%) scale(${active ? 1 : 0.35})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
    };
  }, [finePointer, reducedMotion]);

  if (!finePointer || reducedMotion) return null;

  return (
    <div
      ref={ringRef}
      aria-hidden
      data-active="false"
      className="pointer-events-none fixed start-0 top-0 z-[90] flex h-14 w-14 items-center justify-center rounded-full border border-accent/70 bg-background/50 backdrop-blur-sm transition-opacity duration-300 data-[active=false]:opacity-0 data-[active=true]:opacity-100"
    >
      <span ref={labelRef} className="font-mono text-[10px] tracking-[0.2em] text-accent" />
    </div>
  );
}
