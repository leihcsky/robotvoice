import { z } from "zod";
import { PRESET_IDS } from "@/lib/audio/presets";
import { VALIDATION_MAX_CHARS } from "@/lib/limits/constants";
import { isDevBypassLimits } from "@/lib/flags";
import { VOICES } from "@/lib/tts/voices";

const voiceIds = VOICES.map((voice) => voice.id) as [string, ...string[]];

export function getMaxScriptChars() {
  return isDevBypassLimits() ? 10000 : VALIDATION_MAX_CHARS;
}

export function generateRequestSchema() {
  return z.object({
    text: z.string().trim().min(1).max(getMaxScriptChars()),
    voiceId: z.enum(voiceIds),
    preset: z.enum(PRESET_IDS),
    format: z.enum(["mp3"]).optional().default("mp3"),
    intensity: z.number().min(0).max(1).optional(),
    speed: z.number().min(-50).max(50).optional(),
    pitch: z.number().min(-50).max(50).optional(),
  });
}

export type GenerateRequest = z.infer<ReturnType<typeof generateRequestSchema>>;

export function validateText(text: string) {
  return generateRequestSchema().shape.text.parse(text);
}

export function validateVoice(voiceId: string) {
  return generateRequestSchema().shape.voiceId.parse(voiceId);
}

export function validatePreset(preset: string) {
  return generateRequestSchema().shape.preset.parse(preset);
}
