// Allows importing SVG assets as StaticImageData for next/image usage.
declare module '*.svg' {
  import type { StaticImageData } from 'next/image';

  const content: StaticImageData;
  export default content;
}
