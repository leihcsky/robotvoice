import type { VoiceOption } from "./types";

/**
 * MiniMax system voices on Replicate Speech 2.8 Turbo.
 * Docs: https://replicate.com/minimax/speech-2.8-turbo
 *
 * Authority: Deep_Voice_Man, Imposing_Manner, Elegant_Man
 * Friendly:  Casual_Guy, Friendly_Person, Decent_Boy, Lively_Girl
 * Energetic: Exuberant_Girl, Inspirational_girl
 * Character: Young_Knight, Abbess, Wise_Woman
 *
 * Also accepts a custom voice_id from MiniMax voice cloning.
 */
const DEFAULT_MINIMAX_VOICE =
  process.env.REPLICATE_VOICE_DEFAULT || "Deep_Voice_Man";

export const VOICES: VoiceOption[] = [
  {
    id: "robot-male-01",
    label: "Robot Male",
    description: "Deep / imposing male source",
  },
  {
    id: "robot-female-01",
    label: "Robot Female",
    description: "Lively Girl source",
  },
  {
    id: "robot-narrator-01",
    label: "Robot Narrator",
    description: "Elegant narrator source",
  },
];

const VOICE_MAP: Record<string, string> = {
  "robot-male-01": process.env.REPLICATE_VOICE_MALE || DEFAULT_MINIMAX_VOICE,
  "robot-female-01":
    process.env.REPLICATE_VOICE_FEMALE || "Lively_Girl",
  "robot-narrator-01":
    process.env.REPLICATE_VOICE_NARRATOR || "Elegant_Man",
};

export function resolveTtsVoiceId(voiceId: string): string {
  const mapped = VOICE_MAP[voiceId];
  if (!mapped) {
    throw new Error(`Unknown voice: ${voiceId}`);
  }
  return mapped;
}

export function isValidVoiceId(voiceId: string): boolean {
  return voiceId in VOICE_MAP;
}

export function listVoices(): VoiceOption[] {
  return VOICES;
}
