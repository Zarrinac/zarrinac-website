import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Locale-aware navigation helpers for client components.

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);
