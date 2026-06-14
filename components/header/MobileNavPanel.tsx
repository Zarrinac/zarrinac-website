import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import { HiChevronRight, HiChevronLeft } from 'react-icons/hi2';
import Logo from '@/public/icons/hisense-logo-full.svg';
import type { NavKey, SubMenuItem } from './navigationData';
import { buildSubmenuProductLinks } from './submenuProductLinks';
import { canonicalizeHref } from './navigationData';

// Mobile navigation drawer with nested submenus and deep links into TV models.

type LabeledNavItem = {
  key: NavKey;
  href: string;
  label: string;
};

type MobileNavPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  iconButtonClass: string;
  allNavItems: LabeledNavItem[];
  mobileActiveMenuKey: NavKey | null;
  onMobileMenuKeyChange: (key: NavKey | null) => void;
  mobileActiveNavLabel: string;
  mobileActiveSubMenuItems: SubMenuItem[] | null;
  searchLabel: string;
  closeLabel: string;
  onOpenSearch: () => void;
};

export default function MobileNavPanel({
  isOpen,
  onClose,
  locale,
  iconButtonClass,
  allNavItems,
  mobileActiveMenuKey,
  onMobileMenuKeyChange,
  mobileActiveNavLabel,
  mobileActiveSubMenuItems,
  searchLabel,
  closeLabel,
  onOpenSearch,
}: MobileNavPanelProps) {
  if (!isOpen) {
    return null;
  }
  const localeKey = locale === 'fa' ? 'fa' : 'en';
  const logoAsset = Logo as StaticImageData;
  const toLocalePath = (path: string) => {
    const normalized = canonicalizeHref(path.startsWith('/') ? path : `/${path}`);
    return `/${locale}${normalized}`;
  };

  const submenuProductLinks = buildSubmenuProductLinks(locale);
  const handleNavigate = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex" dir={locale === 'fa' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 bg-(--overlay-color)" onClick={onClose} aria-hidden="true" />
      <aside className="relative ml-auto flex h-full w-full max-w-md flex-col bg-(--surface-color) p-6 shadow-(--panel-shadow)">
        <div className="flex items-start justify-between">
          <Image alt="Hisense Logo" src={logoAsset} className="h-5 w-23" priority />
          <button
            type="button"
            className={iconButtonClass}
            onClick={onClose}
            aria-label={closeLabel}
            title={closeLabel}
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        <div className="relative flex-1 mt-10 overflow-hidden">
          <nav
            className={`absolute inset-0 flex flex-col gap-6 overflow-y-auto text-lg font-semibold text-(--default-black-font) transition-transform duration-300 ease-out ${
              mobileActiveMenuKey ? '-translate-x-full' : 'translate-x-0'
            }`}
            aria-hidden={mobileActiveMenuKey ? 'true' : 'false'}
          >
            {allNavItems.map((item) => (
              <button
                type="button"
                key={item.key}
                className="flex items-center justify-between border-b border-(--border-color) pb-4 text-left transition-colors hover:text-(--brand-color)"
                onClick={() => onMobileMenuKeyChange(item.key)}
              >
                <span className="text-(--default-black-font)">{item.label}</span>
                {locale === 'fa' ? <HiChevronLeft /> : <HiChevronRight />}
              </button>
            ))}
          </nav>

          <div
            className={`absolute inset-0 flex h-full flex-col overflow-y-auto transition-transform duration-300 ease-out ${
              mobileActiveMenuKey ? 'translate-x-0' : 'translate-x-full'
            }`}
            aria-hidden={mobileActiveMenuKey ? 'false' : 'true'}
          >
            <button
              type="button"
              className="flex items-center gap-2 text-left text-lg font-semibold text-(--text-muted-color)"
              onClick={() => onMobileMenuKeyChange(null)}
            >
              {locale === 'fa' ? <HiChevronRight /> : <HiChevronLeft />}
              <span className="text-(--default-black-font)">{mobileActiveNavLabel}</span>
            </button>

            <div className="flex flex-col gap-4 pb-10 mt-6">
              {mobileActiveSubMenuItems?.map((subItem) => {
                const productLinks = submenuProductLinks[subItem.href] ?? [];

                return (
                  <div
                    key={subItem.title.en}
                    className="rounded-2xl border border-(--border-color) bg-(--surface-muted-color) p-4 transition hover:border-(--brand-color) hover:bg-(--surface-hover-color)"
                  >
                    <Link
                      href={toLocalePath(subItem.href)}
                      onClick={handleNavigate}
                      className="text-base font-semibold text-(--default-black-font) hover:text-(--brand-color)"
                    >
                      {subItem.title[localeKey]}
                    </Link>
                    {productLinks.length > 0 ? (
                      <ul className="mt-2 space-y-2 text-sm text-(--text-muted-color)">
                        {productLinks.map((productLink) => (
                          <li key={productLink.id}>
                            <Link
                              href={toLocalePath(productLink.href)}
                              onClick={handleNavigate}
                              className="transition-colors hover:text-(--brand-color)"
                            >
                              {productLink.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-1 text-sm text-(--text-muted-color)">
                        {subItem.description[localeKey]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="pt-10 mt-auto">
          <button
            type="button"
            className="flex w-full items-center justify-center rounded-full border border-(--border-color) px-4 py-3 text-sm font-semibold text-(--text-muted-color) transition-colors hover:border-(--brand-color) hover:text-(--brand-color)"
            onClick={() => {
              onClose();
              onOpenSearch();
            }}
          >
            {searchLabel}
          </button>
        </div>
      </aside>
    </div>
  );
}
