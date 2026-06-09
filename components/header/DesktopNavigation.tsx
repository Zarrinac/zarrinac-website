'use client';

// Desktop navigation shell with hoverable mega-menu and RTL support.
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent } from 'react';
import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeToggle from '@/components/theme/ThemeToggle';
import Logo from '@/public/icons/hisense-logo-full.svg';
import type { NavKey, SubMenuItem } from './navigationData';
import { buildSubmenuProductLinks } from './submenuProductLinks';
import { canonicalizeHref } from './navigationData';

type LabeledNavItem = {
  key: NavKey;
  href: string;
  label: string;
};

type DesktopNavigationProps = {
  navItems: LabeledNavItem[];
  secondaryNavItems: LabeledNavItem[];
  locale: string;
  activeMenuKey: NavKey | null;
  onMenuKeyChange: (key: NavKey | null) => void;
  activeSubMenuItems: SubMenuItem[] | null;
  activeNavLabel: string;
  iconButtonClass: string;
  searchLabel: string;
  menuLabel: string;
  onOpenMobilePanel: () => void;
  themeDarkLabel: string;
  themeLightLabel: string;
  onOpenSearch: () => void;
  direction: 'ltr' | 'rtl';
};

export default function DesktopNavigation({
  navItems,
  secondaryNavItems,
  locale,
  activeMenuKey,
  onMenuKeyChange,
  activeSubMenuItems,
  activeNavLabel,
  iconButtonClass,
  searchLabel,
  menuLabel,
  onOpenMobilePanel,
  themeDarkLabel,
  themeLightLabel,
  onOpenSearch,
  direction,
}: DesktopNavigationProps) {
  const [isHidden, setIsHidden] = useState(false);
  const navContainerRef = useRef<HTMLDivElement | null>(null);
  // const promoKey: keyof typeof PROMO_MESSAGES = activeMenuKey ?? 'default';
  // const promoCopy = locale === 'fa' ? PROMO_MESSAGES[promoKey].fa : PROMO_MESSAGES[promoKey].en;
  const localeKey = locale === 'fa' ? 'fa' : 'en';
  const logoAsset = Logo as StaticImageData;
  const toLocalePath = (path: string) => {
    const normalized = canonicalizeHref(path.startsWith('/') ? path : `/${path}`);
    return `/${locale}${normalized}`;
  };
  const orderedPrimaryNav = direction === 'rtl' ? [...navItems].reverse() : navItems;
  const orderedSecondaryNav =
    direction === 'rtl' ? [...secondaryNavItems].reverse() : secondaryNavItems;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      // Hide the bar when scrolling down unless a submenu is open.
      if (activeMenuKey) {
        setIsHidden(false);
        lastScrollY = window.scrollY;
        return;
      }
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeMenuKey]);

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    const container = navContainerRef.current;
    if (!container) {
      onMenuKeyChange(null);
      return;
    }
    if (!(nextTarget instanceof Node)) {
      onMenuKeyChange(null);
      return;
    }
    if (!container.contains(nextTarget)) {
      onMenuKeyChange(null);
    }
  };

  const submenuProductLinks = buildSubmenuProductLinks(locale);

  return (
    <div
      ref={navContainerRef}
      className={`sticky top-0 z-50 w-full transform-gpu transition-[transform,opacity] duration-500 ease-in-out ${
        isHidden ? '-translate-y-[105%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      onMouseLeave={handleMouseLeave}
      dir={direction}
    >
      <header className="relative flex h-20 items-center justify-between bg-(--surface-color) px-4 shadow-sm lg:px-11">
        <Link href="/" className="flex items-center">
          <Image
            alt="Hisense Logo"
            src={logoAsset}
            priority
            className={`block h-5 w-23 lg:h-6 lg:w-29.25 ${locale === 'fa' ? 'ml-12' : 'mr-12'}`}
          />
        </Link>

        <div className="hidden h-full w-full items-center lg:flex lg:justify-between">
          <nav
            className={`h-full items-center text-sm text-(--default-black-font) lg:flex ${direction === 'rtl' ? 'flex-row-reverse gap-6' : ''}`}
          >
            {orderedPrimaryNav.map((item) => (
              <Link
                key={item.key}
                href={toLocalePath(item.href)}
                className="header-nav-link"
                onMouseEnter={() => onMenuKeyChange(item.key)}
                onFocus={() => onMenuKeyChange(item.key)}
                aria-haspopup="true"
                aria-expanded={activeMenuKey === item.key}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <nav
            className={`h-full items-center text-sm text-(--default-black-font) lg:flex ${direction === 'rtl' ? 'flex-row-reverse gap-6' : ''}`}
          >
            {orderedSecondaryNav.map((item) => (
              <Link
                key={item.key}
                href={toLocalePath(item.href)}
                className="header-nav-link"
                onMouseEnter={() => onMenuKeyChange(item.key)}
                onFocus={() => onMenuKeyChange(item.key)}
                aria-haspopup="true"
                aria-expanded={activeMenuKey === item.key}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className={iconButtonClass}
            aria-label={searchLabel}
            title={searchLabel}
            onClick={onOpenSearch}
          >
            <SearchIcon fontSize="small" />
          </button>
          <ThemeToggle
            className={iconButtonClass}
            darkLabel={themeDarkLabel}
            lightLabel={themeLightLabel}
          />
          <LanguageSwitcher className={iconButtonClass} />
          <button
            type="button"
            className={`${iconButtonClass} lg:hidden`}
            aria-label={menuLabel}
            title={menuLabel}
            onClick={onOpenMobilePanel}
          >
            <MenuIcon fontSize="small" />
          </button>
        </div>
      </header>

      {activeSubMenuItems && (
        <div className="header-submenu-panel hidden px-4 lg:absolute lg:left-0 lg:right-0 lg:top-full lg:z-50 lg:block">
          <div className="mx-auto flex max-w-6xl gap-10 px-7 py-7">
            <div className="max-w-xs">
              <p className="text-xs uppercase tracking-[0.4em] text-(--text-subtle-color)">
                Explore
              </p>
              <p className="mt-3 text-2xl font-semibold text-(--brand-color)">{activeNavLabel}</p>

              {/* <p className="mt-2 text-sm text-(--text-muted-color)">{promoCopy}</p> */}
            </div>
            <div className="grid flex-1 grid-cols-3 gap-6">
              {activeSubMenuItems.map((subItem) => {
                const productLinks = submenuProductLinks[subItem.href] ?? [];

                return (
                  <div
                    key={subItem.title.en}
                    className="header-submenu-card focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-(--brand-color)"
                  >
                    <Link
                      href={`/${locale}${canonicalizeHref(subItem.href)}`}
                      className="text-base font-semibold text-(--default-black-font) hover:text-white"
                    >
                      {subItem.title[localeKey]}
                    </Link>
                    {productLinks.length > 0 && (
                      <ul className="mt-3 space-y-2 text-sm text-(--text-muted-color)">
                        {productLinks.map((productLink) => (
                          <li key={productLink.id}>
                            <Link
                              href={toLocalePath(productLink.href)}
                              className="transition-colors hover:text-white"
                            >
                              {productLink.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
