'use client';

// Floating back-to-top control. A circular ring around the arrow fills as the
// page is scrolled (a live read-progress indicator); clicking eases back to the
// top. Hidden until the user has scrolled a bit so it never covers above-the-fold
// content. Rendered once globally from the locale layout.
import { useEffect, useState } from 'react';
import { HiArrowUp } from 'react-icons/hi2';
import { smoothScrollToTop } from '@/lib/scrollToElement';

const SIZE = 48; // px — outer diameter
const STROKE = 3; // ring thickness
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SHOW_AFTER = 300; // px scrolled before the button appears

export default function ScrollToTopButton() {
  const [progress, setProgress] = useState(0); // 0 → 1 read progress
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const y = window.scrollY;
      setProgress(max > 0 ? Math.min(Math.max(y / max, 0), 1) : 0);
      setVisible(y > SHOW_AFTER);
    };
    // rAF-throttle: coalesce scroll bursts into one update per frame.
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={smoothScrollToTop}
      aria-label="Scroll back to top"
      className={`fixed bottom-24 right-5 z-40 grid place-items-center rounded-full border border-(--border-color) bg-(--surface-color) shadow-lg transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={{ width: SIZE + 12, height: SIZE + 12 }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={STROKE}
        />
        {/* progress arc */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--brand-color)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: 'stroke-dashoffset 120ms linear' }}
        />
      </svg>
      <HiArrowUp className="absolute h-5 w-5 text-(--brand-color)" aria-hidden />
    </button>
  );
}
