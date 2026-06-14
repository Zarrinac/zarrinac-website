'use client';

// Draggable before/after comparison slider with RTL and keyboard support.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import Image, { type StaticImageData } from 'next/image';

type BeforeAfterSliderProps = {
  before: StaticImageData | string;
  after: StaticImageData | string;
  beforeLabel?: string;
  afterLabel?: string;
  isRTL?: boolean;
};

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel,
  afterLabel,
  isRTL = false,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const percent = ((clientX - rect.left) / rect.width) * 100;
    setPosition(clampPercent(percent));
  }, []);

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (event: PointerEvent) => {
      updatePosition(event.clientX);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging, updatePosition]);

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(true);
    updatePosition(event.clientX);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      setPosition((prev) => clampPercent(prev - 5));
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      setPosition((prev) => clampPercent(prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl"
      style={{ aspectRatio: '1 / 1' }}
    >
      {/* After image is the base layer; Before image is clipped to the drag position */}
      <Image
        src={after}
        alt={afterLabel ?? 'After'}
        fill
        className="object-cover"
        sizes="(min-width: 1024px) 720px, 100vw"
        priority
      />
      <div
        className="absolute inset-0 overflow-hidden"
        style={
          isRTL
            ? { width: '100%', clipPath: `inset(0 ${100 - position}% 0 0)` }
            : { width: `${position}%` }
        }
      >
        <Image
          src={before}
          alt={beforeLabel ?? 'Before'}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 720px, 100vw"
          priority
        />
      </div>

      <div
        className="absolute inset-y-0 w-px bg-white/80"
        style={{
          left: `${position}%`,
          boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 0 12px rgba(0,0,0,0.15)',
        }}
      />

      <button
        type="button"
        aria-label="Drag to compare"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 flex -translate-y-1/2 translate-x-[-50%] items-center justify-center rounded-full bg-(--brand-color) text-white shadow-xl ring-4 ring-(--brand-color-light) ring-offset-0 focus:outline-none"
        style={{ left: `${position}%`, width: '48px', height: '48px' }}
      >
        <span className="pointer-events-none select-none text-lg font-bold">↔</span>
      </button>

      {beforeLabel && position > 6 && (
        <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {beforeLabel}
        </div>
      )}
      {afterLabel && position < 94 && (
        <div className="pointer-events-none absolute right-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {afterLabel}
        </div>
      )}
    </div>
  );
}
