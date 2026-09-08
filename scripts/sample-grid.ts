import { mkdir, writeFile, access, copyFile } from "node:fs/promises";
import path from "node:path";
import {
  PRESETS,
  PRESET_IDS,
  isValidPresetId,
  type RobotPresetId,
} from "../lib/audio/presets";
import { processRobotVoice } from "../lib/audio/robot-engine";
import { cleanupTemp, saveTempAudio } from "../lib/audio/ffmpeg";
import { generateTTS, isValidVoiceId, VOICES } from "../lib/tts";

const DEMO_TEXT =
  "Hello, I am your robot assistant. Welcome to the future.";

const FUNNEL_INTENSITIES = [0.3, 0.5, 0.8];
const COARSE_INTENSITIES = [0.5];
const PICK_INTENSITIES = [0.5, 0.8];

const LOCKED_PICKS = [
  {
    id: "classic-robot",
    // Original deep-robot__i80 was overwritten when the new Deep recipe reused that filename.
    // Seed from baked Classic @ 0.5 (same DSP numbers as the old deep @ 0.8).
    seedFrom: ["robot-male-01__classic-robot__i50.mp3"],
    publicFile: "locked__classic-robot.mp3",
    label: "Classic (locked listen pick)",
  },
  {
    id: "deep-robot",
    seedFrom: ["robot-male-01__deep-robot__i80.mp3"],
    publicFile: "locked__deep-robot.mp3",
    label: "Deep (locked listen pick)",
  },
  {
    id: "futuristic-robot",
    seedFrom: ["robot-male-01__evil-robot__i80.mp3"],
    publicFile: "locked__futuristic-robot.mp3",
    label: "Futuristic (locked listen pick)",
  },
  {
    id: "cute-robot",
    seedFrom: ["robot-female-01__cute-robot__i80.mp3"],
    publicFile: "locked__cute-robot.mp3",
    label: "Cute (locked listen pick)",
  },
  {
    id: "villain-robot",
    seedFrom: ["robot-female-01__villain-robot__i80.mp3"],
    publicFile: "locked__villain-robot.mp3",
    label: "Villain (locked listen pick)",
  },
  {
    id: "announcer-robot",
    seedFrom: ["robot-narrator-01__announcer-robot__i80.mp3"],
    publicFile: "locked__announcer-robot.mp3",
    label: "Announcer (locked listen pick)",
  },
];

interface Clip {
  file: string;
  voiceId: string;
  voiceLabel: string;
  preset: string;
  presetLabel: string;
  intensity: number;
}

function readArg(name: string, fallback?: string) {
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0 && process.argv[index + 1]) {
    return process.argv[index + 1];
  }
  return fallback;
}

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function parseRecipes(raw?: string): RobotPresetId[] {
  if (!raw) return [...PRESET_IDS];
  return raw.split(",").map((part) => part.trim()).filter(Boolean).map((id) => {
    if (!isValidPresetId(id)) {
      throw new Error(`Unknown recipe: ${id}. Use ${PRESET_IDS.join(", ")}`);
    }
    return id;
  });
}

function intensitiesFor(round: string) {
  if (round === "coarse") return COARSE_INTENSITIES;
  if (round === "pick") return PICK_INTENSITIES;
  return FUNNEL_INTENSITIES;
}

function intensityTag(value: number) {
  return `i${Math.round(value * 100).toString().padStart(2, "0")}`;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateTtsWithRetry(voiceId: string, text: string) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      return await generateTTS({ text, voiceId });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("429") || attempt === 5) {
        throw error;
      }
      console.log(`Rate limited, retry ${attempt}/5 in 12s...`);
      await sleep(12000);
    }
  }
  throw new Error("TTS retry failed");
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function listenPage(text: string, clips: Clip[]) {
  const cards = clips
    .map(
      (clip) => `
      <article class="card">
        <h3>${clip.presetLabel}</h3>
        <p class="meta">${clip.voiceLabel} · intensity ${clip.intensity}</p>
        <audio controls preload="none" src="./${clip.file}"></audio>
        <code>${clip.file}</code>
      </article>`,
    )
    .join("");

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <title>Robot Voice sample grid</title>
    <style>
      :root { color-scheme: dark; }
      body { font-family: sans-serif; background: #0b0d12; color: #e8edf5; margin: 0; padding: 24px; }
      h1 { font-size: 22px; margin: 0 0 8px; }
      .hint { color: #8b97ab; max-width: 760px; }
      .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); margin-top: 24px; }
      .card { border: 1px solid #243044; background: #10141c; border-radius: 16px; padding: 16px; }
      .card h3 { margin: 0 0 6px; font-size: 16px; }
      .meta { margin: 0 0 12px; color: #8b97ab; font-size: 13px; }
      audio { width: 100%; }
      code { display: block; margin-top: 10px; color: #3ee0c3; font-size: 12px; word-break: break-all; }
    </style>
  </head>
  <body>
    <h1>Robot Voice sample grid</h1>
    <p class="hint">配方自带推荐人声：Classic / Deep / Futuristic = 男声，Cute / Villain = 女声，Announcer = 旁白。</p>
    <p class="hint"><strong>Script:</strong> ${escapeHtml(text)}</p>
    <div class="grid">${cards}</div>
  </body>
</html>
`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function copyLockedWinners(outDir: string, clips: Clip[]) {
  const lockedDir = path.join(outDir, "_locked");
  await mkdir(lockedDir, { recursive: true });

  for (const item of LOCKED_PICKS) {
    const lockedPath = path.join(lockedDir, `${item.id}.mp3`);

    if (!(await fileExists(lockedPath))) {
      let seeded = false;
      for (const name of item.seedFrom) {
        const fromPath = path.join(outDir, name);
        if (await fileExists(fromPath)) {
          await copyFile(fromPath, lockedPath);
          console.log(`Seeded _locked/${item.id}.mp3 ← ${name}`);
          seeded = true;
          break;
        }
      }
      if (!seeded) {
        console.log(`Skip lock, no seed for ${item.id}`);
        continue;
      }
    }

    const publicPath = path.join(outDir, item.publicFile);
    await copyFile(lockedPath, publicPath);
    console.log(`Locked ${item.publicFile}`);
    clips.push({
      file: item.publicFile,
      voiceId: PRESETS[item.id as RobotPresetId]?.sourceVoiceId ?? "robot-male-01",
      voiceLabel: "Robot Male",
      preset: item.id,
      presetLabel: item.label,
      intensity: 0.8,
    });
  }
}

async function main() {
  if (hasFlag("help")) {
    console.log(`Usage:
  npm run samples
  npm run samples -- --recipes deep-robot,cute-robot,villain-robot,announcer-robot --round pick
  npm run samples -- --skip-tts

--recipes  comma list of preset ids. Default: all current recipes
--round    funnel (0.3/0.5/0.8) | coarse (0.5) | pick (0.5/0.8)
--skip-tts reuse tmp/samples/_source/{voiceId}.mp3
Each recipe uses its own sourceVoiceId unless --voices is set.
`);
    return;
  }

  const text = readArg("text") ?? DEMO_TEXT;
  const round = readArg("round") ?? "pick";
  const skipTts = hasFlag("skip-tts");
  const recipes = parseRecipes(readArg("recipes"));
  const intensities = intensitiesFor(round);
  const voiceOverride = readArg("voices");

  const outDir = path.join(process.cwd(), "tmp", "samples");
  const sourceDir = path.join(outDir, "_source");
  await mkdir(sourceDir, { recursive: true });

  const clips: Clip[] = [];
  await copyLockedWinners(outDir, clips);

  let ttsCount = 0;
  let dspCount = 0;

  const grouped = new Map<string, RobotPresetId[]>();
  for (const preset of recipes) {
    const voiceId = voiceOverride || PRESETS[preset].sourceVoiceId;
    if (!isValidVoiceId(voiceId)) {
      throw new Error(`Unknown voice: ${voiceId}`);
    }
    const list = grouped.get(voiceId) ?? [];
    list.push(preset);
    grouped.set(voiceId, list);
  }

  for (const [voiceId, presetIds] of grouped) {
    const voiceLabel = VOICES.find((voice) => voice.id === voiceId)?.label ?? voiceId;
    const sourcePath = path.join(sourceDir, `${voiceId}.mp3`);

    if (skipTts && (await fileExists(sourcePath))) {
      console.log(`Reuse TTS source ${sourcePath}`);
    } else {
      console.log(`TTS voice=${voiceId}`);
      const tts = await generateTtsWithRetry(voiceId, text);
      ttsCount += 1;
      const tempPath = await saveTempAudio(tts.audio, "poc");
      try {
        await copyFile(tempPath, sourcePath);
      } finally {
        await cleanupTemp(tempPath);
      }
    }

    for (const preset of presetIds) {
      for (const intensity of intensities) {
        const file = `${voiceId}__${preset}__${intensityTag(intensity)}.mp3`;
        const outputPath = path.join(outDir, file);
        console.log(`DSP ${file}`);
        await processRobotVoice({
          inputPath: sourcePath,
          outputPath,
          preset,
          controls: { intensity },
        });
        dspCount += 1;
        clips.push({
          file,
          voiceId,
          voiceLabel,
          preset,
          presetLabel: PRESETS[preset].label,
          intensity,
        });
      }
    }
  }

  const htmlPath = path.join(outDir, "listen.html");
  await writeFile(htmlPath, listenPage(text, clips), "utf8");

  console.log(
    `\nDone. TTS calls: ${ttsCount}. FFmpeg renders: ${dspCount}.\nOpen ${htmlPath}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
