'use client';

// Orchestrates top-level navigation, language-aware labels, and search/mobile overlays.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DesktopNavigation from '@/components/header/DesktopNavigation';
import MobileNavPanel from '@/components/header/MobileNavPanel';
import SearchOverlay from '@/components/header/SearchOverlay';
import {
  NAV_ITEMS,
  NAV_SECONDARY_ITEMS,
  SUB_MENU_CONTENT,
  type NavKey,
} from '@/components/header/navigationData';

type LabeledNavItem = {
  key: NavKey;
  href: string;
  label: string;
};

export default function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeMenuKey, setActiveMenuKey] = useState<NavKey | null>(null);
  const [mobileActiveMenuKey, setMobileActiveMenuKey] = useState<NavKey | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Prevent background scroll when the mobile drawer is open.
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPanelOpen]);

  const closeMobilePanel = useCallback(() => {
    setIsPanelOpen(false);
    setMobileActiveMenuKey(null);
  }, []);

  const navItems: LabeledNavItem[] = useMemo(() => {
    return NAV_ITEMS.map((item) => ({
      ...item,
      label: t(`navigation.items.${item.key}`),
    }));
  }, [t]);

  const secondryNavItems: LabeledNavItem[] = useMemo(() => {
    return NAV_SECONDARY_ITEMS.map((item) => ({
      ...item,
      label: t(`navigation.items.${item.key}`),
    }));
  }, [t]);

  const allNavItems = useMemo(
    () => [...navItems, ...secondryNavItems],
    [navItems, secondryNavItems],
  );
  const activeSubMenuItems = activeMenuKey ? SUB_MENU_CONTENT[activeMenuKey] : null;
  const mobileActiveSubMenuItems = mobileActiveMenuKey
    ? SUB_MENU_CONTENT[mobileActiveMenuKey]
    : null;

  const activeNavLabel = useMemo(() => {
    if (!activeMenuKey) {
      return '';
    }
    const match = allNavItems.find((item) => item.key === activeMenuKey);
    return match?.label ?? '';
  }, [activeMenuKey, allNavItems]);

  const mobileActiveNavLabel = useMemo(() => {
    if (!mobileActiveMenuKey) {
      return '';
    }
    const match = allNavItems.find((item) => item.key === mobileActiveMenuKey);
    return match?.label ?? '';
  }, [mobileActiveMenuKey, allNavItems]);

  const iconButtonClass =
    'inline-flex h-8 w-8 items-center justify-center rounded-full border border-(--border-color) bg-(--surface-color) text-(--text-muted-color) transition-colors hover:border-(--brand-color) hover:bg-(--surface-hover-color) hover:text-(--brand-color) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) disabled:opacity-60 sm:h-10 sm:w-10';

  const headerDirection = locale === 'fa' ? 'rtl' : 'ltr';

  return (
    <>
      <DesktopNavigation
        navItems={navItems}
        secondaryNavItems={secondryNavItems}
        locale={locale}
        activeMenuKey={activeMenuKey}
        onMenuKeyChange={setActiveMenuKey}
        activeSubMenuItems={activeSubMenuItems}
        activeNavLabel={activeNavLabel}
        iconButtonClass={iconButtonClass}
        searchLabel={t('actions.search')}
        menuLabel={t('actions.menu')}
        themeDarkLabel={t('actions.theme.dark')}
        themeLightLabel={t('actions.theme.light')}
        onOpenMobilePanel={() => setIsPanelOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        direction={headerDirection}
      />

      <MobileNavPanel
        isOpen={isPanelOpen}
        onClose={closeMobilePanel}
        locale={locale}
        iconButtonClass={iconButtonClass}
        allNavItems={allNavItems}
        mobileActiveMenuKey={mobileActiveMenuKey}
        onMobileMenuKeyChange={setMobileActiveMenuKey}
        mobileActiveNavLabel={mobileActiveNavLabel}
        mobileActiveSubMenuItems={mobileActiveSubMenuItems}
        searchLabel={t('actions.search')}
        closeLabel={t('actions.close')}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        placeholder={t('searchPlaceholder')}
        closeLabel={t('actions.close')}
        locale={locale}
      />
    </>
  );
}
