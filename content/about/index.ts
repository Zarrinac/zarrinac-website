import type { Locale } from '@/i18n/routing';
import { SITE_ID } from '@/lib/siteId';
import type { AboutHero, AboutMeta, AboutPageContent } from './types';
import faContent from './fa.json';
import enContent from './en.json';

// Central resolver for locale-specific about-page content bundles.

const ABOUT_CONTENT_MAP: Record<Locale, AboutPageContent> = {
  fa: faContent as AboutPageContent,
  en: enContent as AboutPageContent,
};

// zarrinac.com serves this page as well as hisense-ir.com, so it gets its own search
// snippet and hero (title is the page's H1): the company page of Zarrin Namaye Caspian,
// rather than hisense-ir.com's "Hisense in Iran" framing. Facts match the shared body.
const ZARRINAC_ABOUT_OVERRIDES: Record<Locale, { meta: AboutMeta; hero: Omit<AboutHero, 'ctas'> }> =
  {
    fa: {
      meta: {
        title: 'صنایع زرین نمای کاسپین | توزیع‌کننده رسمی Hisense از سال ۱۳۸۸',
        description:
          'صنایع زرین نمای کاسپین از سال ۱۳۸۸ توزیع‌کننده رسمی Hisense در ایران است؛ با شبکه‌ای بیش از ۱۳۰۰ نماینده فروش و خدمات، نمایشگاه تهران و برنامه‌های مسئولیت اجتماعی آشنا شوید.',
        keywords: [
          'زرین نمای کاسپین',
          'صنایع زرین نمای کاسپین',
          'توزیع کننده رسمی هایسنس',
          'نماینده رسمی Hisense در ایران',
          'نمایشگاه هایسنس تهران',
          'شبکه نمایندگان هایسنس',
        ],
      },
      hero: {
        eyebrow: 'درباره زرین نمای کاسپین',
        title: 'زرین نمای کاسپین؛ پل هایسنس به خانه‌های ایرانی',
        summary:
          'صنایع زرین نمای کاسپین از سال ۱۳۸۸ محصولات Hisense را به ایران می‌آورد و با شبکه‌ای بیش از ۱۳۰۰ نماینده فروش و خدمات، از عرضه و نصب تا تعمیر و تأمین قطعه، همراه خانواده‌ها و پروژه‌های ایرانی است.',
        imageKey: 'hisense',
      },
    },
    en: {
      meta: {
        title: 'Zarrin Namaye Caspian | Official Hisense Distributor since 2009',
        description:
          'Zarrin Namaye Caspian has been the official Hisense distributor in Iran since 2009. Meet the company, its 1,300+ sales and service representatives, its Tehran showroom and its CSR work.',
        keywords: [
          'Zarrin Namaye Caspian',
          'Zarrin Namaye Caspian Industries',
          'official Hisense distributor Iran',
          'Hisense representative Iran',
          'Hisense Tehran showroom',
          'Hisense service network Iran',
        ],
      },
      hero: {
        eyebrow: 'About Zarrin Namaye Caspian',
        title: 'Zarrin Namaye Caspian: bringing Hisense to Iranian homes',
        summary:
          'Since 2009, Zarrin Namaye Caspian has brought Hisense products to Iran, standing behind Iranian households and projects with more than 1,300 sales and service representatives — from supply and installation to repair and spare parts.',
        imageKey: 'hisense',
      },
    },
  };

export function getAboutContent(locale: Locale): AboutPageContent {
  const content = ABOUT_CONTENT_MAP[locale] ?? ABOUT_CONTENT_MAP.fa;
  if (SITE_ID !== 'zarrinac') return content;

  const overrides = ZARRINAC_ABOUT_OVERRIDES[locale] ?? ZARRINAC_ABOUT_OVERRIDES.fa;
  return {
    ...content,
    meta: overrides.meta,
    hero: { ...overrides.hero, ctas: content.hero.ctas },
  };
}
