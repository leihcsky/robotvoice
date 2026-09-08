import { createTempOutputPath, runFFmpeg } from "./ffmpeg";
import { applyControls, getPreset, type RobotControls } from "./presets";
import { buildRobotFilter } from "./robot-effects";

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
  const filter = buildRobotFilter(tuned);

  await runFFmpeg({
    input: inputPath,
    output: resolvedOutput,
    filter,
  });

  return resolvedOutput;
}
