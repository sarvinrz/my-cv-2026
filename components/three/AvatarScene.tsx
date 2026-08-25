"use client";

import { Suspense, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { GlbAvatar, AvatarAura, AvatarCamera, AvatarGround, AVATAR_HEIGHT } from "./GlbAvatar";
import { AVATAR_LOOK_AT } from "@/lib/avatar/config";
import { SparkleBurst } from "./SparkleBurst";
import { avatarState } from "./avatarState";

const TWO_PI = Math.PI * 2;

function CharacterRig({ reducedMotion }: { reducedMotion: boolean }) {
  const root = useRef<THREE.Group>(null);
  const intro = useRef(avatarState.ready ? 1 : 0);

  useFrame((state, delta) => {
    const g = root.current;
    if (!g) return;
    avatarState.ready = true;

    intro.current = Math.min(1, intro.current + delta * 1.1);
    const introEase = 1 - Math.pow(1 - intro.current, 3);

    if (reducedMotion) {
      g.rotation.y = 0;
      g.scale.setScalar(introEase || 0.001);
      return;
    }

    if (!avatarState.isDragging) {
      avatarState.dragOffset += avatarState.dragVelocity * delta;
      avatarState.dragVelocity = THREE.MathUtils.damp(avatarState.dragVelocity, 0, 2.5, delta);
      avatarState.dragOffset = THREE.MathUtils.damp(avatarState.dragOffset, 0, 1.1, delta);
    }

    const targetY = avatarState.scrollProgress * TWO_PI + avatarState.dragOffset;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 7, delta);

    const targetTiltX = avatarState.pointerY * 0.15;
    const targetTiltZ = -avatarState.pointerX * 0.15;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetTiltX, 4, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, targetTiltZ, 4, delta);

    // subtle idle float — one motion system, no nested Float wrapper
    const t = state.clock.elapsedTime;
    g.position.y = Math.sin(t * 1.2) * 0.035;

    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, introEase, 5, delta) || 0.001);
  });

  return (
    <group ref={root}>
      <GlbAvatar />
    </group>
  );
}

export default function AvatarScene({
  reducedMotion,
  compact = false,
}: {
  reducedMotion: boolean;
  compact?: boolean;
}) {
  const camY = AVATAR_HEIGHT * AVATAR_LOOK_AT;
  const camZ = compact ? 3.35 : 3.55;

  return (
    <Canvas
      camera={{ position: [0, camY, camZ], fov: compact ? 38 : 35, near: 0.01, far: 100 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y", background: "transparent", width: "100%", height: "100%", display: "block" }}
      aria-hidden
    >
      <Suspense fallback={null}>
        {/* Studio three-point — design DNA (codeofsagar.in hero) */}
        <ambientLight intensity={1.1} />
        <directionalLight position={[0, 4, 6]} intensity={1.6} color="#ffffff" />
        <directionalLight position={[-4, 6, 3]} intensity={0.9} color="#ffffff" />
        <directionalLight position={[4, 5, 2]} intensity={0.75} color="#fff8f0" />
        <pointLight position={[0, 2.8, 3]} intensity={0.55} color="#ffffff" />
        <directionalLight position={[0, 2, -5]} intensity={0.22} color="#b8d4f0" />

        <AvatarCamera />

        <CharacterRig reducedMotion={reducedMotion} />
        <AvatarGround />
        <AvatarAura />
        {!reducedMotion && <SparkleBurst compact={compact} />}
      </Suspense>
    </Canvas>
  );
}
