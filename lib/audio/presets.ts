export const PRESET_IDS = [
  "classic-robot",
  "deep-robot",
  "futuristic-robot",
  "cute-robot",
  "villain-robot",
  "announcer-robot",
] as const;

export type RobotPresetId = (typeof PRESET_IDS)[number];

export interface RobotPreset {
  id: RobotPresetId;
  label: string;
  description: string;
  sourceVoiceId: string;
  pitch: number;
  speed: number;
  bass: number;
  treble: number;
  distortion: number;
  chorus: number;
  tremolo: number;
  reverb: number;
  bitcrush: number;
  ringModHz: number;
  highpassHz: number;
  lowpassHz: number;
}

export interface RobotControls {
  intensity?: number;
  speed?: number;
  pitch?: number;
}

export const PRESETS: Record<RobotPresetId, RobotPreset> = {
  "classic-robot": {
    id: "classic-robot",
    label: "Classic",
    description: "Metallic male robot, the default sci-fi voice",
    sourceVoiceId: "robot-male-01",
    pitch: -12,
    speed: 0,
    bass: 5,
    treble: 0,
    distortion: 19.5,
    chorus: 0,
    tremolo: 0,
    reverb: 10.4,
    bitcrush: 0,
    ringModHz: 23.6,
    highpassHz: 80,
    lowpassHz: 8000,
  },
  "deep-robot": {
    id: "deep-robot",
    label: "Deep",
    description: "Lower commander tone, thicker than Classic",
    sourceVoiceId: "robot-male-01",
    pitch: -22,
    speed: -3,
    bass: 8,
    treble: -1,
    distortion: 15.6,
    chorus: 0,
    tremolo: 0,
    reverb: 7.8,
    bitcrush: 0,
    ringModHz: 14.2,
    highpassHz: 80,
    lowpassHz: 7000,
  },
  "futuristic-robot": {
    id: "futuristic-robot",
    label: "Futuristic",
    description: "Darker, more processed metal",
    sourceVoiceId: "robot-male-01",
    pitch: -8,
    speed: 0,
    bass: 3,
    treble: 0,
    distortion: 26,
    chorus: 0,
    tremolo: 10.4,
    reverb: 19.5,
    bitcrush: 5.2,
    ringModHz: 29.5,
    highpassHz: 80,
    lowpassHz: 8000,
  },
  "cute-robot": {
    id: "cute-robot",
    label: "Cute",
    description: "Lively Girl helper bot, bright and metallic",
    sourceVoiceId: "robot-female-01",
    pitch: 18,
    speed: 8,
    bass: -1,
    treble: 5,
    distortion: 15.6,
    chorus: 7.8,
    tremolo: 0,
    reverb: 5.2,
    bitcrush: 2.6,
    ringModHz: 49.6,
    highpassHz: 220,
    lowpassHz: 4800,
  },
  "villain-robot": {
    id: "villain-robot",
    label: "Villain",
    description: "Cold antagonist AI, more vocoder than speech",
    sourceVoiceId: "robot-female-01",
    pitch: -8,
    speed: -8,
    bass: 2,
    treble: 0,
    distortion: 28.6,
    chorus: 0,
    tremolo: 13,
    reverb: 10.4,
    bitcrush: 9.1,
    ringModHz: 37.8,
    highpassHz: 180,
    lowpassHz: 4000,
  },
  "announcer-robot": {
    id: "announcer-robot",
    label: "Announcer",
    description: "Ship PA / radio robot",
    sourceVoiceId: "robot-narrator-01",
    pitch: -6,
    speed: -4,
    bass: 3,
    treble: 0,
    distortion: 20.8,
    chorus: 0,
    tremolo: 0,
    reverb: 10.4,
    bitcrush: 6.5,
    ringModHz: 28.3,
    highpassHz: 200,
    lowpassHz: 3800,
  },
};

export function getPreset(id: string): RobotPreset {
  const preset = PRESETS[id as RobotPresetId];
  if (!preset) {
    throw new Error(`Unknown preset: ${id}`);
  }
  return preset;
}

export function recipePreviewPath(id: RobotPresetId) {
  return `/recipes/${id}.mp3`;
}

export function applyControls(
  preset: RobotPreset,
  controls: RobotControls = {},
): RobotPreset {
  const intensity = clamp(controls.intensity ?? 0.5, 0, 1);
  const scale = 0.5 + intensity;

  return {
    ...preset,
    distortion: preset.distortion * scale,
    chorus: preset.chorus * scale,
    reverb: preset.reverb * scale,
    tremolo: preset.tremolo * scale,
    bitcrush: preset.bitcrush * scale,
    ringModHz:
      preset.ringModHz === 0
        ? 0
        : preset.ringModHz * (0.7 + intensity * 0.6),
    speed: preset.speed + (controls.speed ?? 0),
    pitch: preset.pitch + (controls.pitch ?? 0),
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
