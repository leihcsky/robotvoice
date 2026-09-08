import Replicate from "replicate";
import { resolveTtsVoiceId } from "./voices";
import type { TTSRequest, TTSResult } from "./types";

function getClient() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error("REPLICATE_API_TOKEN is not set");
  }

  return new Replicate({
    auth: token,
    // Return a download URL string instead of a FileOutput stream.
    useFileOutput: false,
  });
}

function envString(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function envNumber(name: string): number | undefined {
  const raw = envString(name);
  if (!raw) return undefined;
  const value = Number(raw);
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a number`);
  }
  return value;
}

function envBoolean(name: string): boolean | undefined {
  const raw = envString(name);
  if (!raw) return undefined;
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  throw new Error(`${name} must be true or false`);
}

function buildInput(text: string, voiceId: string) {
  const input: Record<string, string | number | boolean> = {
    text,
    voice_id: resolveTtsVoiceId(voiceId),
    audio_format: envString("REPLICATE_TTS_AUDIO_FORMAT") ?? "mp3",
    channel: envString("REPLICATE_TTS_CHANNEL") ?? "mono",
  };

  const speed = envNumber("REPLICATE_TTS_SPEED");
  const volume = envNumber("REPLICATE_TTS_VOLUME") ?? 2;
  const pitch = envNumber("REPLICATE_TTS_PITCH");
  const emotion = envString("REPLICATE_TTS_EMOTION");
  const englishNormalization = envBoolean("REPLICATE_TTS_ENGLISH_NORMALIZATION");
  const sampleRate = envNumber("REPLICATE_TTS_SAMPLE_RATE");
  const bitrate = envNumber("REPLICATE_TTS_BITRATE");
  const languageBoost = envString("REPLICATE_TTS_LANGUAGE_BOOST");

  if (speed !== undefined) input.speed = speed;
  if (volume !== undefined) input.volume = volume;
  if (pitch !== undefined) input.pitch = pitch;
  if (emotion) input.emotion = emotion;
  if (englishNormalization !== undefined) {
    input.english_normalization = englishNormalization;
  }
  if (sampleRate !== undefined) input.sample_rate = sampleRate;
  if (bitrate !== undefined) input.bitrate = bitrate;
  if (languageBoost) input.language_boost = languageBoost;

  return input;
}

function resolveAudioUrl(output: unknown): string {
  if (typeof output === "string" && output.startsWith("http")) {
    return output;
  }

  if (output && typeof output === "object" && "url" in output) {
    const url = (output as { url: unknown }).url;
    if (typeof url === "function") {
      const resolved = url();
      return typeof resolved === "string" ? resolved : resolved.href;
    }
    if (typeof url === "string") return url;
    if (url && typeof url === "object" && "href" in url) {
      return String((url as URL).href);
    }
  }

  throw new Error("Replicate TTS returned an unexpected audio output");
}

async function downloadAudio(url: string): Promise<Buffer> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download Replicate audio (${response.status})`);
  }
  return Buffer.from(await response.arrayBuffer());
}

export async function generateTTS({
  text,
  voiceId,
}: TTSRequest): Promise<TTSResult> {
  const client = getClient();
  const model =
    envString("REPLICATE_TTS_MODEL") ?? "minimax/speech-2.8-turbo";

  const prediction = await client.predictions.create({
    model,
    input: buildInput(text, voiceId),
  });

  const completed = await client.wait(prediction, {
    interval: 1000,
  });

  if (completed.status !== "succeeded") {
    const detail =
      typeof completed.error === "string"
        ? completed.error
        : "Replicate TTS failed";
    throw new Error(detail);
  }

  const audioUrl = resolveAudioUrl(completed.output);
  const audio = await downloadAudio(audioUrl);

  return {
    audio,
    requestId: completed.id,
    characterCost: text.length,
  };
}
