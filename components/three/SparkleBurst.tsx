"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { avatarState } from "./avatarState";

/**
 * A small, choreographed set of four-point stars that appear as the
 * avatar completes its 360° rotation — a product-reveal moment, not a
 * particle system. Each star lives in a narrow progress window near the
 * end of the hero scroll and scrubs with it (scrolling back replays it).
 */

const WINDOW_START = 0.8;
const WINDOW_END = 0.96;

interface StarSpec {
  position: [number, number, number];
  color: string;
  size: number;
  delay: number; // 0..1 within the window
  spin: number;
}

const STARS: StarSpec[] = [
  { position: [0.98, 1.18, 0.5], color: "#8fbee8", size: 0.2, delay: 0.0, spin: 0.8 },
  { position: [-0.92, 1.34, 0.35], color: "#e0c572", size: 0.17, delay: 0.14, spin: -0.6 },
  { position: [0.72, -0.14, 0.75], color: "#f0e8d8", size: 0.13, delay: 0.24, spin: 1.0 },
  { position: [-1.02, 0.26, 0.55], color: "#dbb584", size: 0.15, delay: 0.34, spin: -0.8 },
  { position: [0.34, 1.52, 0.3], color: "#f0e8d8", size: 0.11, delay: 0.46, spin: 1.2 },
];

function createStarGeometry(): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const points = 4;
  const outer = 1;
  const inner = 0.32;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return new THREE.ShapeGeometry(shape, 4);
}

export function SparkleBurst({ compact = false }: { compact?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const geometry = useMemo(() => createStarGeometry(), []);

  const materials = useMemo(
    () =>
      STARS.map(
        (s) =>
          new THREE.MeshBasicMaterial({
            color: s.color,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
      ),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      materials.forEach((mat) => mat.dispose());
    };
  }, [geometry, materials]);

  useFrame((_, delta) => {
    if (!group.current) return;
    const p = avatarState.scrollProgress;
    const windowP = (p - WINDOW_START) / (WINDOW_END - WINDOW_START);

    group.current.children.forEach((child, i) => {
      const spec = STARS[i];
      const mesh = child as THREE.Mesh;
      // each star occupies a sub-window offset by its delay
      const local = THREE.MathUtils.clamp((windowP - spec.delay * 0.6) / 0.4, 0, 1);
      // rise-and-fall envelope: appear, hold, fade
      const envelope = Math.sin(local * Math.PI);
      const eased = envelope * envelope * (3 - 2 * envelope);
      materials[i].opacity = eased;
      const scale = spec.size * (compact ? 0.7 : 1) * (0.4 + eased * 0.8);
      mesh.scale.setScalar(Math.max(scale, 0.0001));
      mesh.rotation.z += delta * spec.spin * (0.3 + eased);
      mesh.visible = eased > 0.001;
    });
  });

  return (
    <group ref={group}>
      {STARS.map((s, i) => (
        <mesh key={i} position={s.position} geometry={geometry} material={materials[i]} />
      ))}
    </group>
  );
}
