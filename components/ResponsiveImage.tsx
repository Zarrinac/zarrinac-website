import { getImageProps, type ImageProps } from 'next/image';

type ResponsiveImageProps = Pick<ImageProps, 'src' | 'alt' | 'sizes' | 'className'> & {
  mobileSrc?: ImageProps['src'];
  priority?: boolean;
};

// Art direction is selected by the browser before hydration. Both variants
// retain Next's image optimization without downloading the desktop image first.
export default function ResponsiveImage({
  src,
  mobileSrc,
  alt,
  sizes = '100vw',
  className,
  priority = false,
}: ResponsiveImageProps) {
  const shared = {
    alt,
    sizes,
    fill: true,
    className,
    loading: priority ? ('eager' as const) : ('lazy' as const),
    fetchPriority: priority ? ('high' as const) : ('auto' as const),
  };
  const { props } = getImageProps({ ...shared, src });
  const mobile = mobileSrc ? getImageProps({ ...shared, src: mobileSrc }).props : undefined;

  return (
    <picture>
      {mobile && (
        <source media="(max-width: 767px)" srcSet={mobile.srcSet ?? mobile.src} sizes={sizes} />
      )}
      {/* getImageProps supplies optimized sources for picture art direction. */}
      <img {...props} alt={alt} />
    </picture>
  );
}
