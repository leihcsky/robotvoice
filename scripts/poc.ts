import { mkdir } from "node:fs/promises";
import path from "node:path";
import { processRobotVoice } from "../lib/audio/robot-engine";
import { isValidPresetId, PRESET_IDS } from "../lib/audio/presets";
import { cleanupTemp, saveTempAudio } from "../lib/audio/ffmpeg";
import { generateTTS } from "../lib/tts";

function readArg(name: string, fallback?: string) {
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return fallback;
}

async function main() {
  const text =
    readArg("text") ?? "Hello, I am a robot. Welcome to the future.";
  const preset = readArg("preset") ?? "classic-robot";

  if (!isValidPresetId(preset)) {
    throw new Error(`Unknown preset. Use one of: ${PRESET_IDS.join(", ")}`);
  }

  const outDir = path.join(process.cwd(), "tmp", "samples");
  await mkdir(outDir, { recursive: true });
  const outputPath = path.join(outDir, `${preset}.mp3`);

  console.log(`TTS → DSP preset=${preset}`);
  const tts = await generateTTS({
    text,
    voiceId: "robot-male-01",
  });

  const inputPath = await saveTempAudio(tts.audio, "poc");
  try {
    await processRobotVoice({
      inputPath,
      outputPath,
      preset,
    });
  } finally {
    await cleanupTemp(inputPath);
  }

  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
