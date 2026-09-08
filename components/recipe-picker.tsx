"use client";

import { useEffect, useRef, useState } from "react";
import {
  PRESETS,
  PRESET_IDS,
  recipePreviewPath,
  type RobotPresetId,
} from "@/lib/audio/presets";
import { pauseOtherAudio } from "./pause-other-audio";
import { PlayIcon } from "./play-icon";

export function RecipePicker({
  value,
  onChange,
  haltPlayback = false,
  presetIds = PRESET_IDS,
}: {
  value: RobotPresetId;
  onChange: (preset: RobotPresetId) => void;
  haltPlayback?: boolean;
  presetIds?: readonly RobotPresetId[];
}) {
  const audioRefs = useRef<Partial<Record<RobotPresetId, HTMLAudioElement | null>>>(
    {},
  );
  const [playingId, setPlayingId] = useState<RobotPresetId | null>(null);
  const [progress, setProgress] = useState<Partial<Record<RobotPresetId, number>>>(
    {},
  );

  useEffect(() => {
    if (!haltPlayback) return;
    for (const id of presetIds) {
      audioRefs.current[id]?.pause();
    }
    setPlayingId(null);
  }, [haltPlayback, presetIds]);

  function togglePlay(id: RobotPresetId) {
    const node = audioRefs.current[id];
    if (!node) return;

    if (playingId === id && !node.paused) {
      node.pause();
      return;
    }

    onChange(id);
    pauseOtherAudio(node);
    void node.play().catch(() => {
      setPlayingId(null);
    });
  }

  return (
    <fieldset className="space-y-3">
      <legend className="text-base font-semibold text-foreground">
        1. Play and pick a recipe
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {presetIds.map((id) => {
          const preset = PRESETS[id];
          const selected = id === value;
          const playing = playingId === id;
          const ratio = progress[id] ?? 0;

          return (
            <div
              key={id}
              className={`relative overflow-hidden rounded-2xl border transition ${
                selected
                  ? "border-accent bg-accent/10"
                  : "border-line bg-panel hover:border-accent/40"
              }`}
            >
              <div className="flex items-start gap-3 p-3 pb-4">
                <button
                  type="button"
                  onClick={() => togglePlay(id)}
                  aria-label={
                    playing
                      ? `Pause ${preset.label} sample`
                      : `Play ${preset.label} sample`
                  }
                  className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition ${
                    playing
                      ? "bg-accent text-on-accent"
                      : "bg-foreground/10 text-foreground hover:bg-accent hover:text-on-accent"
                  }`}
                >
                  <PlayIcon playing={playing} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange(id)}
                  className="min-w-0 flex-1 text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base font-semibold">
                      {preset.label}
                    </span>
                    {selected ? (
                      <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                        using
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted">
                    {preset.description}
                  </span>
                </button>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-line/60">
                <div
                  className="h-full bg-accent transition-[width] duration-150"
                  style={{ width: `${Math.round(ratio * 100)}%` }}
                />
              </div>
              <audio
                ref={(node) => {
                  audioRefs.current[id] = node;
                }}
                className="hidden"
                preload="metadata"
                src={recipePreviewPath(id)}
                onPlay={(event) => {
                  pauseOtherAudio(event.currentTarget);
                  setPlayingId(id);
                  onChange(id);
                }}
                onPause={() => {
                  setPlayingId((current) => (current === id ? null : current));
                }}
                onEnded={() => {
                  setPlayingId((current) => (current === id ? null : current));
                  setProgress((current) => ({ ...current, [id]: 0 }));
                }}
                onTimeUpdate={(event) => {
                  const node = event.currentTarget;
                  const next =
                    node.duration > 0 ? node.currentTime / node.duration : 0;
                  setProgress((current) => ({ ...current, [id]: next }));
                }}
              />
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
