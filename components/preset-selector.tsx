"use client";

import { PRESETS, PRESET_IDS, type RobotPresetId } from "@/lib/audio/presets";

export function PresetSelector({
  value,
  onChange,
}: {
  value: RobotPresetId;
  onChange: (preset: RobotPresetId) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs uppercase tracking-[0.16em] text-muted">Effect</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {PRESET_IDS.map((id) => {
          const preset = PRESETS[id];
          const selected = id === value;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                selected
                  ? "border-accent-2 bg-accent-2/10"
                  : "border-line bg-panel hover:border-accent-2/40"
              }`}
            >
              <div className="text-sm font-medium">{preset.label}</div>
              <div className="mt-1 text-xs text-muted">{preset.description}</div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
