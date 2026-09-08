import { createTempOutputPath, ffmpegHasFilter, runFFmpeg } from "./ffmpeg";
import { applyControls, getPreset, type RobotControls } from "./presets";
import { buildRobotFilter } from "./robot-effects";

let loggedRubberbandFallback = false;

export async function processRobotVoice({
  inputPath,
  outputPath,
  preset,
  controls,
}: {
  inputPath: string;
  outputPath?: string;
  preset: string;
  controls?: RobotControls;
}): Promise<string> {
  const resolvedOutput = outputPath ?? (await createTempOutputPath());
  const tuned = applyControls(getPreset(preset), controls);
  const useRubberband = await ffmpegHasFilter("rubberband");
  if (!useRubberband && !loggedRubberbandFallback) {
    loggedRubberbandFallback = true;
    console.warn(
      "[dsp] FFmpeg rubberband filter not found; using asetrate/atempo pitch-tempo fallback",
    );
  }
  const filter = buildRobotFilter(tuned, { useRubberband });

  await runFFmpeg({
    input: inputPath,
    output: resolvedOutput,
    filter,
  });

  return resolvedOutput;
}
