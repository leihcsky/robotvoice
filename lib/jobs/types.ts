import type { RobotControls, RobotPresetId } from "@/lib/audio/presets";

export interface ProcessJobInput {
  generationId: string;
  userId: string;
  text: string;
  voiceId: string;
  preset: RobotPresetId;
  format: "mp3";
  controls?: RobotControls;
}

export interface ProcessJobResult {
  outputStorageKey: string;
  duration: number;
  providerRequestId?: string;
  providerCharacters?: number;
  processingTimeMs: number;
}
