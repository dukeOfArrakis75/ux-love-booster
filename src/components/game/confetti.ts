const CANDY_COLORS = ["#ff6b8a", "#ffd166", "#7be0b8", "#b8a7f9", "#ff9f6e"];

export type ConfettiKind = "pop" | "levelup" | "treasure";

export async function fireConfetti(kind: ConfettiKind = "pop") {
  const confetti = (await import("canvas-confetti")).default;

  if (kind === "pop") {
    confetti({
      particleCount: 36,
      spread: 60,
      startVelocity: 28,
      origin: { y: 0.65 },
      colors: CANDY_COLORS,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
    return;
  }

  if (kind === "levelup") {
    confetti({ particleCount: 70, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: CANDY_COLORS, disableForReducedMotion: true });
    confetti({ particleCount: 70, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: CANDY_COLORS, disableForReducedMotion: true });
    return;
  }

  // treasure : pluie continue pendant ~1,2 s
  const end = Date.now() + 1200;
  (function frame() {
    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: CANDY_COLORS, disableForReducedMotion: true });
    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: CANDY_COLORS, disableForReducedMotion: true });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
