"use client";

import { useLayoutEffect, useMemo } from "react";
import * as THREE from "three";
import { useTexture, RoundedBox } from "@react-three/drei";
import { site } from "@/lib/site";

/** Collectible-card dimensions in scene units. */
const CARD_W = 2.35;
const CARD_H = 3.15;
const CARD_D = 0.07;

/**
 * The hero portrait: the owner's real photo on a premium physical card.
 * No voxel modelling — the texture IS the LinkedIn / Dubai-museum photo,
 * with a glossy print finish and a gold accent strip so it reads as a
 * designed object rather than a flat `<img>`.
 */
export function PhotoPortrait() {
  const texture = useTexture(site.profilePhoto);

  useLayoutEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.generateMipmaps = true;
  }, [texture]);

  const photoSize = useMemo(() => {
    const img = texture.image as { width?: number; height?: number } | undefined;
    const aspect = img?.width && img?.height ? img.width / img.height : 3 / 4;
    const maxH = CARD_H * 0.86;
    const maxW = CARD_W * 0.9;
    let h = maxH;
    let w = h * aspect;
    if (w > maxW) {
      w = maxW;
      h = w / aspect;
    }
    return { w, h };
  }, [texture]);

  const frameMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#12151a"),
        roughness: 0.22,
        metalness: 0.38,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
    [],
  );

  const photoMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: texture,
        roughness: 0.28,
        metalness: 0.02,
        clearcoat: 0.92,
        clearcoatRoughness: 0.1,
        sheen: 0.35,
        sheenRoughness: 0.45,
        sheenColor: new THREE.Color("#8fbee8"),
      }),
    [texture],
  );

  const goldMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#c9a227"),
        metalness: 1,
        roughness: 0.26,
      }),
    [],
  );

  return (
    <group>
      {/* Back plate — gives the card thickness and catches rim light */}
      <RoundedBox args={[CARD_W, CARD_H, CARD_D]} radius={0.07} smoothness={6} material={frameMat} castShadow />

      {/* Photo print layer */}
      <mesh position={[0, 0.06, CARD_D / 2 + 0.002]} material={photoMat}>
        <planeGeometry args={[photoSize.w, photoSize.h]} />
      </mesh>

      {/* Gold nameplate */}
      <mesh position={[0, -CARD_H / 2 + 0.28, CARD_D / 2 + 0.004]} material={goldMat}>
        <planeGeometry args={[CARD_W * 0.52, 0.055]} />
      </mesh>

      {/* Holographic edge shimmer — a thin fresnel-like strip along the leading edge */}
      <mesh position={[CARD_W / 2 - 0.015, 0, CARD_D / 2 + 0.005]}>
        <planeGeometry args={[0.018, CARD_H * 0.88]} />
        <meshBasicMaterial color="#e0c572" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
}
