export interface TTSRequest {
  text: string;
  voiceId: string;
}

export interface TTSResult {
  audio: Buffer;
  requestId?: string;
  characterCost?: number;
}

export interface VoiceOption {
  id: string;
  label: string;
  description: string;
}
