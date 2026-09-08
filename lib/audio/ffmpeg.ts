import { spawn } from "node:child_process";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { AudioFilterGraph } from "./robot-effects";

const TMP_DIR = path.join(process.cwd(), "tmp");
const filterSupport = new Map<string, boolean>();

export async function ffmpegHasFilter(name: string): Promise<boolean> {
  const cached = filterSupport.get(name);
  if (cached !== undefined) return cached;

  try {
    const output = await runCommand("ffmpeg", ["-hide_banner", "-filters"]);
    const available = new RegExp(`\\b${name}\\b`).test(output);
    filterSupport.set(name, available);
    return available;
  } catch {
    filterSupport.set(name, false);
    return false;
  }
}

function runCommand(bin: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
    });
    proc.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    proc.on("error", (error) => {
      reject(new Error(`${bin} is not available: ${error.message}`));
    });
    proc.on("close", (code) => {
      if (code === 0) {
        resolve(stdout.trim() || stderr);
        return;
      }
      reject(new Error(`${bin} exited ${code}: ${stderr.slice(-2000)}`));
    });
  });
}

export async function runFFmpeg(options: {
  input: string;
  output: string;
  filter: AudioFilterGraph;
}): Promise<void> {
  const args = ["-y", "-i", options.input];

  if (options.filter.kind === "complex") {
    args.push("-filter_complex", options.filter.filter, "-map", "[out]");
  } else {
    args.push("-af", options.filter.filter);
  }

  args.push("-ar", "44100", "-ac", "1", "-b:a", "128k", options.output);
  await runCommand("ffmpeg", args);
}

export async function probeDuration(filePath: string): Promise<number> {
  const output = await runCommand("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    filePath,
  ]);
  const duration = Number.parseFloat(output);
  return Number.isFinite(duration) ? duration : 0;
}

export async function saveTempAudio(
  audio: Buffer,
  prefix = "tts",
): Promise<string> {
  const dir = path.join(TMP_DIR, prefix);
  await mkdir(dir, { recursive: true });
  const filePath = path.join(dir, `${randomUUID()}.mp3`);
  await writeFile(filePath, audio);
  return filePath;
}

export async function createTempOutputPath(prefix = "dsp"): Promise<string> {
  const dir = path.join(TMP_DIR, prefix);
  await mkdir(dir, { recursive: true });
  return path.join(dir, `${randomUUID()}.mp3`);
}

export async function cleanupTemp(...paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(async (filePath) => {
      try {
        await unlink(filePath);
      } catch {
        // ignore missing temp files
      }
    }),
  );
}
