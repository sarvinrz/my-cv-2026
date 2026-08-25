"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { avatarState } from "./avatarState";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const AvatarScene = dynamic(() => import("./AvatarScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center" aria-hidden>
      <div className="h-32 w-24 animate-pulse rounded-xl bg-border/40" />
    </div>
  ),
});

const DRAG_SENSITIVITY = 0.009;

function updatePointer(e: React.PointerEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  avatarState.pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  avatarState.pointerY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
}

export function AvatarCanvas({ compact = false }: { compact?: boolean }) {
  const reducedMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ id: -1, lastX: 0, lastT: 0 });

  // Locale switch remounts the tree; nudge R3F to re-measure the canvas box.
  useLayoutEffect(() => {
    const bump = () => window.dispatchEvent(new Event("resize"));
    bump();
    const raf = requestAnimationFrame(bump);
    const timer = window.setTimeout(bump, 120);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    pointer.current = { id: e.pointerId, lastX: e.clientX, lastT: performance.now() };
    avatarState.isDragging = true;
    avatarState.dragVelocity = 0;
    updatePointer(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    updatePointer(e);
    if (!avatarState.isDragging || e.pointerId !== pointer.current.id) return;
    const now = performance.now();
    const dx = e.clientX - pointer.current.lastX;
    const dt = Math.max(8, now - pointer.current.lastT) / 1000;
    avatarState.dragOffset += dx * DRAG_SENSITIVITY;
    avatarState.dragVelocity = (dx * DRAG_SENSITIVITY) / dt;
    pointer.current.lastX = e.clientX;
    pointer.current.lastT = now;
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== pointer.current.id) return;
    avatarState.isDragging = false;
    pointer.current.id = -1;
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`h-full w-full cursor-grab active:cursor-grabbing ${compact ? "min-h-[240px]" : ""}`}
      style={{ touchAction: "pan-y" }}
      data-cursor="drag"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="Interactive 3D portrait — drag to tilt and spin"
    >
      <AvatarScene reducedMotion={reducedMotion} compact={compact} />
    </div>
  );
}
