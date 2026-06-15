// Shared slow, eased page scroll used by the specs jump button and the
// feature-card grid. Uses a custom rAF animation (not native `scroll-behavior`)
// so the motion is deliberately gentle and the destination is recomputed each
// frame — lazy-loaded media above the target can shift layout mid-scroll.

// Offset (px) so the target isn't hidden behind the sticky desktop header.
const HEADER_OFFSET = 96;
// Duration scales with distance (ms per px) so long pages don't whip past at a
// high peak speed — clamped so short/long jumps both feel gentle.
const MS_PER_PX = 0.7;
const MIN_DURATION = 1400;
const MAX_DURATION = 5000;

// easeInOutCubic — slow start/end, smooth middle.
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Eased rAF scroll to a live destination (recomputed each frame so layout shifts
// above the target — lazy media, reveal animations — don't leave us short).
function animateScrollTo(destinationNow: () => number): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, destinationNow());
    return;
  }

  const start = window.scrollY;
  const duration = Math.min(
    Math.max(Math.abs(destinationNow() - start) * MS_PER_PX, MIN_DURATION),
    MAX_DURATION,
  );
  let startTime: number | null = null;

  const step = (now: number) => {
    startTime ??= now;
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, start + (destinationNow() - start) * easeInOutCubic(progress));
    if (progress < 1) window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);
}

export function smoothScrollToId(targetId: string): void {
  const target = document.getElementById(targetId);
  if (!target) return;
  animateScrollTo(() => target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET);
}

export function smoothScrollToTop(): void {
  animateScrollTo(() => 0);
}
