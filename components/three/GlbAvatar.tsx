"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Sparkles, useGLTF } from "@react-three/drei";
import {
  AVATAR_GLB,
  AVATAR_HEIGHT,
  AVATAR_IDLE_CLIPS,
  AVATAR_LOOK_AT,
  HEAD_LOOK_GAIN,
} from "@/lib/avatar/config";
import { frameModel, prepareModel } from "@/lib/avatar/frameModel";
import { idlePlayback, pickIdleClip } from "@/lib/avatar/pickClip";
import { avatarState } from "./avatarState";

useGLTF.preload(AVATAR_GLB);

const HEAD_HINTS = ["head", "Head", "face", "Face", "neck", "Neck"];

function findLookTarget(root: THREE.Object3D): THREE.Object3D | null {
  let found: THREE.Object3D | null = null;
  root.traverse((obj) => {
    if (found) return;
    if (HEAD_HINTS.some((h) => obj.name.includes(h))) found = obj;
  });
  return found;
}

export function AvatarCamera() {
  const camera = useThree((s) => s.camera);
  const target = useMemo(
    () => new THREE.Vector3(0, AVATAR_HEIGHT * AVATAR_LOOK_AT, 0),
    [],
  );
  useFrame(() => camera.lookAt(target));
  return null;
}

export function GlbAvatar() {
  const framed = useRef(false);
  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const look = useRef<THREE.Object3D | null>(null);
  const lookBase = useRef({ x: 0, y: 0, z: 0 });
  const { scene, animations } = useGLTF(AVATAR_GLB);

  useLayoutEffect(() => {
    if (framed.current) return;
    prepareModel(scene);
    frameModel(scene, AVATAR_HEIGHT);
    framed.current = true;

    const target = findLookTarget(scene) ?? scene;
    look.current = target;
    lookBase.current = { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z };
  }, [scene]);

  useEffect(() => {
    if (!animations.length) return;
    const m = new THREE.AnimationMixer(scene);
    mixer.current = m;
    const clip = pickIdleClip(animations, AVATAR_IDLE_CLIPS);
    if (clip) {
      const action = m.clipAction(clip, scene);
      const { loop, timeScale } = idlePlayback(clip);
      action.reset().fadeIn(0.35).play();
      action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce, loop ? Infinity : 1);
      action.timeScale = timeScale;
    }
    return () => {
      m.stopAllAction();
      mixer.current = null;
    };
  }, [animations, scene]);

  useFrame((_, delta) => {
    mixer.current?.update(delta);
    const t = look.current;
    if (!t) return;
    const targetY = lookBase.current.y + HEAD_LOOK_GAIN.yaw * avatarState.pointerX;
    const targetX = lookBase.current.x + HEAD_LOOK_GAIN.pitch * avatarState.pointerY;
    t.rotation.y = THREE.MathUtils.damp(t.rotation.y, targetY, 9, delta);
    t.rotation.x = THREE.MathUtils.damp(t.rotation.x, targetX, 9, delta);
  });

  return <primitive object={scene} />;
}

export function AvatarGround() {
  return (
    <ContactShadows
      position={[0, 0.002, 0]}
      opacity={0.38}
      scale={2.4}
      blur={2.4}
      far={1.6}
      color="#05070c"
    />
  );
}

export function AvatarAura() {
  return (
    <>
      <Sparkles count={16} scale={2.4} size={1.6} speed={0.2} opacity={0.32} color="#e0c572" />
      <Sparkles count={10} scale={1.8} size={1} speed={0.28} opacity={0.22} color="#8fbee8" />
    </>
  );
}

export { AVATAR_HEIGHT };
