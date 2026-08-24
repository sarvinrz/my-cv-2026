import type { AnimationClip } from "three";

/** Bind/rest poses — never play these as hero idle motion. */
const POSE_CLIP = /^(t[-_]?pose|a[-_]?pose|bind|rest|reference)$/i;

/** Clips that work as a subtle hero idle when nothing named Idle exists. */
const LOOP_IDLE = /^(idle|standing|breath|look|shift|samba|dance|sway)/i;

/**
 * Pick the best idle clip from a GLB export.
 * Industry exports usually include Idle; Meshy/Mixamo often only ship TPose + one loop.
 */
export function pickIdleClip(
  clips: AnimationClip[],
  preferred: readonly string[] = [],
): AnimationClip | null {
  if (!clips.length) return null;

  for (const name of preferred) {
    const hit = clips.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (hit && !POSE_CLIP.test(hit.name)) return hit;
  }

  const nonPose = clips.filter((c) => !POSE_CLIP.test(c.name));
  if (!nonPose.length) return null;

  const idle = nonPose.find((c) => /idle|standing|breath/i.test(c.name));
  if (idle) return idle;

  const loop = nonPose.find((c) => LOOP_IDLE.test(c.name));
  if (loop) return loop;

  return nonPose[0] ?? null;
}

export function idlePlayback(clip: AnimationClip) {
  const name = clip.name.toLowerCase();
  if (/dance|samba|walk|run|jog|step/.test(name)) {
    return { loop: true as const, timeScale: 0.32 };
  }
  if (/idle|standing|breath|look/.test(name)) {
    return { loop: true as const, timeScale: 1 };
  }
  return { loop: true as const, timeScale: 0.85 };
}
