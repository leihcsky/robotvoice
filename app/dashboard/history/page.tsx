"use client";

import { useEffect, useState } from "react";
import { AudioPlayer } from "@/components/audio-player";

interface GenerationItem {
  id: string;
  text: string;
  preset: string;
  status: string;
  duration: number | null;
  audioUrl: string | null;
  createdAt: string;
}

export default function HistoryPage() {
  const [items, setItems] = useState<GenerationItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/generations")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load history");
        return res.json();
      })
      .then((payload) => setItems(payload.generations ?? []))
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">My Generations</h1>
      <p className="mt-2 text-muted">Replay or download completed robot clips.</p>

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      <ul className="mt-8 space-y-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-line bg-panel p-5">
            <p className="text-sm">{item.text}</p>
            <p className="mt-2 font-mono text-xs text-muted">
              {item.preset} · {item.status}
              {item.duration ? ` · ${item.duration.toFixed(1)}s` : ""}
            </p>
            {item.audioUrl ? (
              <div className="mt-4">
                <AudioPlayer src={item.audioUrl} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>

      {items.length === 0 && !error ? (
        <p className="mt-8 text-sm text-muted">No generations yet.</p>
      ) : null}
    </div>
  );
}
