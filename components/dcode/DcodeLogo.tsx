import Image from 'next/image';
import { DCODE_BRAND } from '@/lib/dcode/brand';

// The D'code logo asset is dark, so it disappears on the brand's black theme.
// Render it inverted to white for visibility on dark surfaces.
type DcodeLogoProps = {
  className?: string;
  priority?: boolean;
};

export default function DcodeLogo({ className, priority }: DcodeLogoProps) {
  return (
    <Image
      src={DCODE_BRAND.logo}
      alt={`${DCODE_BRAND.name} logo`}
      width={200}
      height={51}
      priority={priority}
      className={`${className ?? ''} [filter:brightness(0)_invert(1)]`.trim()}
    />
  );
}
