// Role-based access matrix for the admin portal. Pure data + helpers, no DB or
// Node APIs — safe to import from the edge middleware (proxy.ts) as well as
// server components and server actions.

export const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'SERVICE_MANAGER',
  'CIC_MANAGER',
  'EDITOR',
] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export const ADMIN_SECTIONS = [
  'dashboard',
  'products',
  'complaints',
  'surveys',
  'serviceCenters',
  'settings',
  'users',
] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

// The matrix. Keep in sync with the table in DOCS.md → Admin → Access control.
export const ROLE_SECTIONS: Record<AdminRole, readonly AdminSection[]> = {
  SUPER_ADMIN: [
    'dashboard',
    'products',
    'complaints',
    'surveys',
    'serviceCenters',
    'settings',
    'users',
  ],
  ADMIN: ['dashboard', 'products', 'complaints', 'surveys', 'serviceCenters', 'settings'],
  SERVICE_MANAGER: ['dashboard', 'complaints', 'surveys', 'serviceCenters'],
  // CIC_MANAGER mirrors SERVICE_MANAGER's access — only the title differs.
  CIC_MANAGER: ['dashboard', 'complaints', 'surveys', 'serviceCenters'],
  EDITOR: ['dashboard', 'complaints', 'surveys'],
};

// Manager roles that get the trimmed dashboard (no intro copy / foundation card).
export function hasTrimmedDashboard(role: string | undefined | null): boolean {
  const normalized = normalizeRole(role);

  return normalized === 'SERVICE_MANAGER' || normalized === 'CIC_MANAGER';
}

// Unknown/legacy roles fall back to the least-privileged role.
export function normalizeRole(role: string | undefined | null): AdminRole {
  return (ADMIN_ROLES as readonly string[]).includes(role ?? '') ? (role as AdminRole) : 'EDITOR';
}

export function canAccessSection(role: string | undefined | null, section: AdminSection): boolean {
  return ROLE_SECTIONS[normalizeRole(role)].includes(section);
}

export function canManageUsers(role: string | undefined | null): boolean {
  return normalizeRole(role) === 'SUPER_ADMIN';
}

// Maps an /admin pathname to the section that gates it (null = unguarded,
// e.g. the login page). Order matters: check specific prefixes before the
// bare /admin dashboard.
export function sectionForPath(pathname: string): AdminSection | null {
  if (pathname === '/admin/login') {
    return null;
  }

  if (pathname.startsWith('/admin/products')) return 'products';
  if (pathname.startsWith('/admin/complaints')) return 'complaints';
  if (pathname.startsWith('/admin/surveys')) return 'surveys';
  // The combined submissions view shows complaints + surveys; gate it on the
  // complaints section (every role that sees surveys also sees complaints).
  if (pathname.startsWith('/admin/submissions')) return 'complaints';
  if (pathname.startsWith('/admin/service-centers')) return 'serviceCenters';
  if (pathname.startsWith('/admin/settings')) return 'settings';
  if (pathname.startsWith('/admin/users')) return 'users';

  if (pathname === '/admin' || pathname === '/admin/') return 'dashboard';

  return null;
}
