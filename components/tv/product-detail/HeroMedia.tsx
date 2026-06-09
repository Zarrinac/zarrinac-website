import Image from 'next/image';
import type { ImageSource } from '@/types/tv';

// Renders the hero media block only when a video URL exists, using the poster/image as fallback media.
type HeroMediaProps = {
  image: ImageSource;
  posterImage?: ImageSource;
  heroVideo?: string;
  alt: string;
};

const toSrc = (value: ImageSource) => (typeof value === 'string' ? value : value.src);

const HeroMedia = ({ image, posterImage, heroVideo, alt }: HeroMediaProps) =>
  heroVideo && (
    <div className="w-full mx-auto max-w-360">
      <div className="relative overflow-hidden bg-black shadow-2xl ring-1 ring-(--border-color)">
        <div className="relative w-full aspect-video">
          {heroVideo ? (
            <video
              className="object-cover w-full h-full"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster={toSrc(posterImage ?? image)}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
        </div>
      </div>
    </div>
  );

export default HeroMedia;
