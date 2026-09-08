"use client";

import { useEffect, useRef, useState } from "react";
import { PRESETS, PRESET_IDS, type RobotPresetId } from "@/lib/audio/presets";
import { AudioPlayer } from "./audio-player";
import { GenerationButton } from "./generation-button";
import { RecipePicker } from "./recipe-picker";
import { VoiceSelector } from "./voice-selector";
import { VALIDATION_MAX_CHARS, DAILY_LIMIT_MESSAGE } from "@/lib/limits/constants";

interface GenerateResponse {
  generationId: string;
  audioUrl: string;
  duration: number;
  characters: number;
  creditsUsed: number;
  error?: string;
  code?: string;
}

const SAMPLE_INTENSITY = 0.5;

export function RobotEditor({
  defaultPreset = PRESET_IDS[0],
  presetIds = PRESET_IDS,
  defaultText = "Hello, I am your robot assistant. Welcome to the future.",
  pickerNote,
}: {
  defaultPreset?: RobotPresetId;
  presetIds?: readonly RobotPresetId[];
  defaultText?: string;
  pickerNote?: React.ReactNode;
}) {
  const [text, setText] = useState(defaultText);
  const [preset, setPreset] = useState<RobotPresetId>(defaultPreset);
  const [voiceId, setVoiceId] = useState(PRESETS[defaultPreset].sourceVoiceId);
  const [intensity, setIntensity] = useState(SAMPLE_INTENSITY);
  const [speed, setSpeed] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const recipe = PRESETS[preset];
  const tweaked =
    voiceId !== recipe.sourceVoiceId ||
    intensity !== SAMPLE_INTENSITY ||
    speed !== 0 ||
    pitch !== 0;

  function selectRecipe(next: RobotPresetId) {
    if (next === preset || !presetIds.includes(next)) return;
    setPreset(next);
    setVoiceId(PRESETS[next].sourceVoiceId);
    setIntensity(SAMPLE_INTENSITY);
    setSpeed(0);
    setPitch(0);
  }

  function resetTweaks() {
    setVoiceId(recipe.sourceVoiceId);
    setIntensity(SAMPLE_INTENSITY);
    setSpeed(0);
    setPitch(0);
  }

  useEffect(() => {
    if (!result?.audioUrl) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [result?.audioUrl]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId,
          preset,
          format: "mp3",
          intensity,
          speed,
          pitch,
        }),
      });
      const payload = (await response.json()) as GenerateResponse;

      if (!response.ok) {
        if (payload.code === "DAILY_LIMIT") {
          setError(DAILY_LIMIT_MESSAGE);
        } else {
          setError(payload.error || "Generation failed");
        }
        return;
      }

      setResult(payload);
    } catch {
      setError("Generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18.5rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_20rem]"
    >
      <div className="space-y-5">
        <RecipePicker
          value={preset}
          onChange={selectRecipe}
          haltPlayback={loading}
          presetIds={presetIds}
        />
        {pickerNote ? (
          <div className="text-sm text-muted">{pickerNote}</div>
        ) : null}

        <label className="block space-y-2">
          <span className="text-base font-semibold text-foreground">
            2. Type your script
          </span>
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={4}
            maxLength={VALIDATION_MAX_CHARS}
            placeholder="Paste the text you want the robot to speak"
            className="w-full resize-y rounded-2xl border border-line bg-panel px-4 py-3 text-base outline-none ring-accent/40 focus:ring-2"
          />
          <span className="flex justify-between text-sm text-muted">
            <span>Short lines work best. A daily free allowance applies.</span>
            <span className="font-mono text-xs">
              {text.length} / {VALIDATION_MAX_CHARS}
            </span>
          </span>
        </label>
      </div>

      <div className="space-y-3 lg:sticky lg:top-20">

        <details className="rounded-xl border border-line bg-panel px-4 py-2.5">
          <summary className="cursor-pointer text-base font-semibold text-foreground">
            Optional tweaks
            {tweaked ? (
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-accent-2">
                changed
              </span>
            ) : null}
          </summary>
          <div className="mt-4 space-y-5">
            <p className="text-sm text-muted">
              Sliders start on the sample mix. Change them only if you want a
              different sound.
            </p>
            <VoiceSelector value={voiceId} onChange={setVoiceId} />
            <div className="grid gap-4">
              <Slider
                label="Robot Intensity"
                min={0}
                max={1}
                step={0.05}
                value={intensity}
                display={
                  intensity === SAMPLE_INTENSITY
                    ? "sample"
                    : intensity.toFixed(2)
                }
                onChange={setIntensity}
              />
              <Slider
                label="Speed"
                min={-20}
                max={20}
                step={1}
                value={speed}
                display={speed === 0 ? "sample" : String(speed)}
                onChange={setSpeed}
              />
              <Slider
                label="Pitch"
                min={-20}
                max={20}
                step={1}
                value={pitch}
                display={pitch === 0 ? "sample" : String(pitch)}
                onChange={setPitch}
              />
            </div>
            {tweaked ? (
              <button
                type="button"
                onClick={resetTweaks}
                className="text-sm text-accent hover:underline"
              >
                Reset to the {recipe.label} sample mix
              </button>
            ) : null}
          </div>
        </details>

        <div className="sticky bottom-3 z-10 bg-background/95 py-1 backdrop-blur lg:static lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
          <GenerationButton
            loading={loading}
            disabled={!text.trim()}
            label={recipe.label}
            hint={
              tweaked
                ? `Uses ${recipe.label} with your tweaks — it will not match the sample.`
                : `Uses the ${recipe.label} mix you just heard.`
            }
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {result?.audioUrl ? (
          <div ref={resultRef} className="space-y-2">
            <p className="text-base font-semibold text-foreground">
              Your line as {recipe.label}
            </p>
            <AudioPlayer
              key={result.audioUrl}
              src={result.audioUrl}
              downloadName={`${preset}.mp3`}
              autoPlay
              label={`${recipe.label} voice`}
            />
            <p className="font-mono text-xs text-muted">
              {result.duration.toFixed(2)}s · {result.characters} chars
            </p>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">
            Generated audio plays here after you hit Generate.
          </p>
        )}
      </div>
    </form>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex justify-between text-sm font-medium text-foreground">
        {label}
        <span className="font-mono text-sm text-muted">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />
    </label>
  );
}
