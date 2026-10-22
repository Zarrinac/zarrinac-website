import { mediaUrl } from '@/lib/mediaUrl';

// Self-hosted video block used for the category ambient loop and the About brand
// film. Both are first-party files under the media store, which is what lets the
// page claim them in VideoObject JSON-LD (a third-party hotlink cannot be).
//
// `ambient` autoplays muted on loop with no controls — decorative motion, so it
// must stay silent and carry no information the page does not also state in text.
// `feature` is a real film: controls, audio, and preload="none" so its bytes are
// only fetched when a visitor chooses to watch.
type MediaVideoSectionProps = {
  /** Media-store path, e.g. `/about/hisense-brand-film.mp4`. Wrapped in mediaUrl here. */
  src: string;
  /** Media-store path to the poster frame. */
  poster: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Describes the footage for assistive tech; required because <video> has no alt. */
  label: string;
  mode: 'ambient' | 'feature';
};

export default function MediaVideoSection({
  src,
  poster,
  eyebrow,
  title,
  description,
  label,
  mode,
}: MediaVideoSectionProps) {
  const isAmbient = mode === 'ambient';
  const hasHeader = [eyebrow, title, description].some(Boolean);
  const videoSrc = mediaUrl(src);
  const posterSrc = mediaUrl(poster);

  return (
    <section className="w-full px-4 mx-auto max-w-480 sm:px-6 lg:px-10">
      {hasHeader && (
        <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-8">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.45em] text-(--text-subtle-color) sm:text-xs sm:tracking-[0.6em]">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-(--default-black-font) sm:text-3xl">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-4 text-sm leading-relaxed text-(--text-muted-color) sm:text-base">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl bg-black shadow-(--panel-shadow) ring-1 ring-(--border-color)">
        <div className="relative w-full aspect-video">
          {isAmbient ? (
            <video
              className="object-cover w-full h-full"
              poster={posterSrc}
              aria-label={label}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          ) : (
            <video
              className="object-cover w-full h-full"
              poster={posterSrc}
              aria-label={label}
              controls
              playsInline
              preload="none"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          )}
        </div>
      </div>
    </section>
  );
}
