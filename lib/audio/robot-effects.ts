import type { RobotPreset } from "./presets";

export interface AudioFilterGraph {
  kind: "af" | "complex";
  filter: string;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function atempoChain(ratio: number): string[] {
  const parts: string[] = [];
  let current = clamp(ratio, 0.25, 4);
  while (current > 2.0001) {
    parts.push("atempo=2.0");
    current /= 2;
  }
  while (current < 0.4999) {
    parts.push("atempo=0.5");
    current *= 2;
  }
  if (Math.abs(current - 1) > 0.001) {
    parts.push(`atempo=${current.toFixed(4)}`);
  }
  return parts;
}

function pitchTempoFilters(
  pitchRatio: number,
  tempoRatio: number,
  useRubberband: boolean,
): string[] {
  if (Math.abs(pitchRatio - 1) <= 0.001 && Math.abs(tempoRatio - 1) <= 0.001) {
    return [];
  }

  if (useRubberband) {
    return [
      `rubberband=pitch=${pitchRatio.toFixed(4)}:tempo=${tempoRatio.toFixed(4)}`,
    ];
  }

  const filters: string[] = [];
  let atempo = tempoRatio;
  if (Math.abs(pitchRatio - 1) > 0.001) {
    const rate = Math.round(44100 * pitchRatio);
    filters.push("aresample=44100", `asetrate=${rate}`, "aresample=44100");
    atempo = tempoRatio / pitchRatio;
  }
  filters.push(...atempoChain(atempo));
  return filters;
}

export function buildRobotFilter(
  preset: RobotPreset,
  options: { useRubberband?: boolean } = {},
): AudioFilterGraph {
  const pitchRatio = clamp(1 + preset.pitch / 100, 0.5, 1.6);
  const tempoRatio = clamp(1 + preset.speed / 100, 0.5, 1.6);

  const chain: string[] = [
    `highpass=f=${preset.highpassHz}`,
    `lowpass=f=${preset.lowpassHz}`,
    "acompressor=threshold=0.126:ratio=6:attack=5:release=80:makeup=2",
  ];

  if (Math.abs(pitchRatio - 1) > 0.001 || Math.abs(tempoRatio - 1) > 0.001) {
    chain.push(
      ...pitchTempoFilters(
        pitchRatio,
        tempoRatio,
        options.useRubberband ?? false,
      ),
    );
  }

  if (preset.bass !== 0) {
    chain.push(`equalizer=f=120:t=q:w=1:g=${preset.bass.toFixed(1)}`);
  }
  if (preset.treble !== 0) {
    chain.push(`equalizer=f=3500:t=q:w=1:g=${preset.treble.toFixed(1)}`);
  }

  if (preset.distortion > 0) {
    const amount = clamp(preset.distortion / 8, 0.5, 12);
    const drive = clamp(preset.distortion / 10, 0.5, 10);
    chain.push(`aexciter=amount=${amount.toFixed(2)}:drive=${drive.toFixed(2)}`);
  }

  if (preset.bitcrush > 0) {
    const bits = Math.round(clamp(16 - preset.bitcrush * 0.6, 4, 12));
    chain.push(`acrusher=bits=${bits}:mode=log:aa=1:mix=0.6`);
  }

  if (preset.chorus > 0) {
    const delay = clamp(preset.chorus * 0.8, 20, 60).toFixed(1);
    const depth = clamp(preset.chorus / 8, 1, 8).toFixed(2);
    chain.push(
      `chorus=in_gain=0.6:out_gain=0.85:delays=${delay}:decays=0.4:speeds=0.25:depths=${depth}`,
    );
  }

  if (preset.tremolo > 0) {
    chain.push(
      `tremolo=f=6:d=${clamp(preset.tremolo / 100, 0.05, 0.9).toFixed(2)}`,
    );
  }

  if (preset.ringModHz > 0) {
    chain.push(
      `tremolo=f=${preset.ringModHz.toFixed(1)}:d=0.72`,
      "aphaser=in_gain=0.5:out_gain=0.9:delay=3:decay=0.5:speed=0.6:type=t",
    );
  }

  if (preset.reverb > 0) {
    const delay = Math.round(clamp(preset.reverb * 4, 20, 200));
    const decay = clamp(preset.reverb / 140, 0.05, 0.5);
    chain.push(
      `aecho=in_gain=0.8:out_gain=0.9:delays=${delay}:decays=${decay.toFixed(2)}`,
    );
  }

  // Fixed gain only. dynaudnorm ramps up over the first 1–2s on short clips.
  chain.push("volume=2.2", "alimiter=limit=0.95", "aresample=44100");

  return {
    kind: "af",
    filter: chain.join(","),
  };
}
