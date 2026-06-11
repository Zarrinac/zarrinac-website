import type { CSSProperties } from 'react';
import { DCODE_BRAND } from '@/lib/dcode/brand';

// Scoped D'code palette, exposed as CSS custom properties so children can use the
// project's Tailwind v4 `bg-(--dcode-*)` token syntax. Applied on the root of every
// /dcode section so the brand renders on its black/red theme independently of the
// site's light/dark toggle.
export const DCODE_THEME_STYLE: CSSProperties = {
  ['--dcode-black' as string]: DCODE_BRAND.colors.black,
  ['--dcode-red' as string]: DCODE_BRAND.colors.red,
  ['--dcode-surface' as string]: DCODE_BRAND.colors.surface,
  ['--dcode-surface-muted' as string]: DCODE_BRAND.colors.surfaceMuted,
  ['--dcode-border' as string]: 'rgba(255,255,255,0.10)',
  ['--dcode-text' as string]: DCODE_BRAND.colors.textPrimary,
  ['--dcode-text-muted' as string]: DCODE_BRAND.colors.textMuted,
  backgroundColor: DCODE_BRAND.colors.black,
  color: DCODE_BRAND.colors.textPrimary,
};

// Cancels the locale layout's padded container so a D'code section is full-bleed.
export const DCODE_BLEED_CLASS = '-mx-4 sm:-mx-6 lg:-mx-10';
