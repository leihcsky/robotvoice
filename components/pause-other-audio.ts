export function pauseOtherAudio(current: HTMLMediaElement) {
  document.querySelectorAll("audio").forEach((node) => {
    if (node !== current && !node.paused) {
      node.pause();
    }
  });
}
