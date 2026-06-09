import { useLocalContent } from '@/lib/contentSource';

export const mediaUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (useLocalContent) {
    return normalized.startsWith('/media/') ? normalized.replace(/^\/media/, '') : normalized;
  }

  const base = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? '').replace(/\/$/, '');
  if (!base) return normalized;

  if (base.startsWith('/') && normalized.startsWith(`${base}/`)) {
    return normalized;
  }

  return `${base}${normalized}`;
};
