import {
  cleanupTemp,
  createTempOutputPath,
  probeDuration,
  saveTempAudio,
} from "@/lib/audio/ffmpeg";
import { processRobotVoice } from "@/lib/audio/robot-engine";
import type { ProcessJobInput, ProcessJobResult } from "@/lib/jobs/types";
import { uploadToR2 } from "@/lib/storage/r2";
import { generateTTS } from "@/lib/tts";

export async function processRobotJob(
  input: ProcessJobInput,
): Promise<ProcessJobResult> {
  const startedAt = Date.now();
  let inputPath: string | undefined;
  let outputPath: string | undefined;

  try {
    const tts = await generateTTS({
      text: input.text,
      voiceId: input.voiceId,
    });

    inputPath = await saveTempAudio(tts.audio, "tts");
    outputPath = await createTempOutputPath("dsp");

    await processRobotVoice({
      inputPath,
      outputPath,
      preset: input.preset,
      controls: input.controls,
    });

    const duration = await probeDuration(outputPath);
    const outputStorageKey = await uploadToR2({
      userId: input.userId,
      generationId: input.generationId,
      filePath: outputPath,
    });

    return {
      outputStorageKey,
      duration,
      providerRequestId: tts.requestId,
      providerCharacters: tts.characterCost,
      processingTimeMs: Date.now() - startedAt,
    };
  } finally {
    await cleanupTemp(...[inputPath, outputPath].filter(Boolean) as string[]);
  }
}
