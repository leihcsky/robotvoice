"use client";

import { VOICES } from "@/lib/tts/voices";

export function VoiceSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (voiceId: string) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-foreground">
        Source voice
      </legend>
      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        {VOICES.map((voice) => {
          const selected = voice.id === value;
          return (
            <button
              key={voice.id}
              type="button"
              onClick={() => onChange(voice.id)}
              className={`rounded-xl border px-3 py-3 text-left transition ${
                selected
                  ? "border-accent bg-accent/10"
                  : "border-line bg-panel hover:border-accent/50"
              }`}
            >
              <div className="text-sm font-medium">{voice.label}</div>
              <div className="mt-1 text-xs text-muted">{voice.description}</div>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
