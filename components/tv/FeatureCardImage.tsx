'use client';

// Chooses a light/dark asset variant for feature cards based on the active theme.
import Image from 'next/image';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { ImageSource } from '@/types/tv';

type FeatureCardImageProps = {
  title: string;
  image: ImageSource;
  imageBlack?: ImageSource;
  className: string;
};

export default function FeatureCardImage({
  title,
  image,
  imageBlack,
  className,
}: FeatureCardImageProps) {
  const { theme, isReady } = useTheme();
  const showDarkVariant = isReady && theme === 'dark' && imageBlack;
  const src = showDarkVariant ? imageBlack : image;
  const resolvedSrc = typeof src === 'string' ? src : src.src;
  const isSvg = resolvedSrc.split('?')[0].toLowerCase().endsWith('.svg');

  return (
    <Image
      src={src}
      alt={title}
      width={320}
      height={320}
      className={className}
      unoptimized={isSvg}
    />
  );
}
