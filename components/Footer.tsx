'use client';

// Footer renders localized navigation, contact info, and theme-aware branding.
import Image from 'next/image';
import Link from 'next/link';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useLocale, useTranslations } from 'next-intl';
import { useTheme } from '@/components/theme/ThemeProvider';
import ZarrinLogoBlack from '@/public/icons/Zarrin-Logo-Black.png';
import ZarrinLogoWhite from '@/public/icons/Zarrin-Logo-White.png';

type FooterLinkSection = {
  title: string;
  links: Array<{
    label: string;
    href: string;
  }>;
};

const FOOTER_SECTIONS: Array<{
  titleKey: string;
  linkKeys: Array<{ key: string; href: string }>;
}> = [
  {
    titleKey: 'about.title',
    linkKeys: [
      { key: 'about', href: '/about' },
      { key: 'contact', href: '/contact-us' },
    ],
  },
  {
    titleKey: 'products.title',
    linkKeys: [
      { key: 'ventilation', href: '/rac' },
      { key: 'industrialVentilation', href: '/cac' },
      { key: 'refrigerator', href: '/refrigerator' },
      { key: 'television', href: '/products/tvs' },
      { key: 'washingMachine', href: '/products/wms' },
    ],
  },
  {
    titleKey: 'support.title',
    linkKeys: [
      { key: 'faq', href: '/faq' },
      { key: 'warranty', href: '/warranty-and-guarantee' },
      { key: 'hisenseRepair', href: '/hisense-repair' },
      { key: 'dealerList', href: '/find-service-center' },
      { key: 'complaint', href: '/complaint' },
      { key: 'feedback', href: '/survey' },
      { key: 'dealerPortal', href: '/portal' },
      { key: 'becomeDealer', href: '/request-representation' },
    ],
  },
];

const CONTACT_ITEMS = [
  { icon: LocationOnOutlinedIcon, key: 'address' },
  { icon: LocalPhoneOutlinedIcon, key: 'phone' },
  { icon: EmailOutlinedIcon, key: 'email' },
  { icon: AccessTimeOutlinedIcon, key: 'hours' },
  { icon: AccessTimeOutlinedIcon, key: 'holidays' },
];

const SOCIAL_LINKS = [
  { icon: WhatsAppIcon, key: 'whatsappSales', href: 'https://wa.me/989123456789' },
  { icon: WhatsAppIcon, key: 'whatsappService', href: 'https://wa.me/989123456780' },
  { icon: InstagramIcon, key: 'instagram', href: 'https://instagram.com/yourbrand' },
];

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();
  const { theme } = useTheme();
  const logoSource = theme === 'dark' ? ZarrinLogoWhite : ZarrinLogoBlack;
  const homeHref = `/${locale}`;
  const toLocalePath = (path: string) => {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `/${locale}${normalized}`;
  };

  const sections: FooterLinkSection[] = FOOTER_SECTIONS.map((section) => ({
    title: t(section.titleKey),
    links: section.linkKeys.map((item) => ({
      label: t(`links.${item.key}`),
      href: toLocalePath(item.href),
    })),
  }));

  return (
    <footer className="bg-(--surface-accent-color)">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row">
        <div className="flex flex-col gap-4 lg:w-1/3">
          <Link href={homeHref} className="w-fit">
            <Image
              src={logoSource}
              alt={t('branding.title')}
              className="h-auto w-[80%] max-w-55"
              sizes="(max-width: 1024px) 60vw, 240px"
              priority
            />
          </Link>
          <p className="text-sm text-(--text-muted-color)">{t('branding.tagline')}</p>
          <div className="space-y-3">
            {CONTACT_ITEMS.map(({ icon: Icon, key }) => (
              <div key={key} className="flex items-start gap-3 text-sm text-(--text-muted-color)">
                <Icon fontSize="small" className="mt-0.5 text-(--brand-color)" />
                <p>{t(`contact.${key}`)}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            {SOCIAL_LINKS.map(({ icon: Icon, key, href }) => (
              <Link
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-(--border-color) px-3 py-1.5 text-xs font-semibold text-(--text-muted-color) transition hover:border-(--brand-color) hover:text-(--brand-color)"
              >
                <Icon fontSize="small" />
                <span>{t(`social.${key}`)}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 xs:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-(--default-black-font)">
                {section.title}
              </p>
              <ul className="grid mt-3 space-y-2 text-sm text-(--text-muted-color) grid-cols-1 2xs:grid-cols-2 xs:grid-cols-1 gap-6">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition hover:text-(--brand-color)">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-(--border-color) bg-(--surface-color)">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-(--text-muted-color) lg:flex-row lg:items-center lg:justify-between">
          <p>{t('legal.notice')}</p>
          {/* Legal links (privacy/cookies/terms) removed: those pages do not
              exist yet and were returning 404. Re-add as locale-prefixed links
              (e.g. `${homeHref}/privacy`) once the pages are created. */}
          <div className="flex flex-wrap gap-4">
            <Link href="/sitemap.xml" className="transition hover:text-(--brand-color)">
              {t('legal.sitemap')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
