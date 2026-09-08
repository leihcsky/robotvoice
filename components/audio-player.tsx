"use client";

import { useEffect, useRef, useState } from "react";
import { pauseOtherAudio } from "./pause-other-audio";
import { PlayIcon } from "./play-icon";

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path
        d="M12 4v12m0 0-4-4m4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5 19h14" strokeLinecap="round" />
    </svg>
  );
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({
  src,
  downloadName = "robot-voice.mp3",
  autoPlay = false,
  label = "Generated voice",
}: {
  src: string;
  downloadName?: string;
  autoPlay?: boolean;
  label?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const node = audioRef.current;
    if (!node) return;
    node.load();
    setPlaying(false);
    setCurrentTime(0);
    if (!autoPlay) return;
    void node.play().catch(() => {
      setPlaying(false);
    });
  }, [src, autoPlay]);

  function togglePlay() {
    const node = audioRef.current;
    if (!node) return;
    if (!node.paused) {
      node.pause();
      return;
    }
    pauseOtherAudio(node);
    void node.play().catch(() => {
      setPlaying(false);
    });
  }

  function seek(event: React.ChangeEvent<HTMLInputElement>) {
    const node = audioRef.current;
    if (!node) return;
    node.currentTime = Number(event.target.value);
  }

  return (
    <div className="rounded-2xl border border-line bg-panel p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={playing ? `Pause ${label}` : `Play ${label}`}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition ${
            playing
              ? "bg-accent text-on-accent"
              : "bg-foreground/10 text-foreground hover:bg-accent hover:text-on-accent"
          }`}
        >
          <PlayIcon playing={playing} />
        </button>
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-sm font-medium">{label}</p>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.01}
            value={currentTime}
            onChange={seek}
            className="w-full"
            aria-label={`${label} position`}
          />
          <p className="font-mono text-xs text-muted">
            {formatTime(currentTime)} / {formatTime(duration)}
          </p>
        </div>
        <a
          href={src}
          download={downloadName}
          title="Download MP3"
          aria-label="Download MP3"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-foreground transition hover:border-accent hover:bg-accent/10 hover:text-accent"
        >
          <DownloadIcon />
        </a>
      </div>
      <audio
        ref={audioRef}
        className="hidden"
        src={src}
        preload="metadata"
        onPlay={(event) => {
          pauseOtherAudio(event.currentTarget);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
      />
    </div>
  );
}
