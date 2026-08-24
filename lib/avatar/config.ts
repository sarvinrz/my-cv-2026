/** Hero 3D character — drop a GLB at public/models/avatar.glb to swap. */
export const AVATAR_GLB = "/models/avatar.glb";

export const AVATAR_IDLE_CLIPS = ["Idle", "idle", "Standing", "Breathing"] as const;

export const AVATAR_HEIGHT = 1.72;
export const AVATAR_LOOK_AT = 0.46;

/** Pointer-driven head / gaze (design DNA). */
export const HEAD_LOOK_GAIN = { yaw: 0.42, pitch: 0.28 } as const;
