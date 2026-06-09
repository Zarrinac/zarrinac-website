import { getLocale, getTranslations } from 'next-intl/server';
import RouteHero from '@/components/routes/RouteHero';
import OfficialLinksSection from '@/components/seo/OfficialLinksSection';
import UnderConstruction, { type UnderConstructionAction } from '@/components/UnderConstruction';

// Factory that produces a locale-aware route page with optional under-construction content.

type RoutePageOptions = {
  underConstruction?: boolean;
  actions?: UnderConstructionAction[];
};

export default function createRoutePage(routeKey: string, options?: RoutePageOptions) {
  return async function RoutePage() {
    const [routeTranslations, underConstructionTranslations] = await Promise.all([
      getTranslations('Routes'),
      getTranslations('UnderConstruction'),
    ]);
    const locale = (await getLocale()) ?? 'fa';
    const statusItems = [
      underConstructionTranslations('status.content'),
      underConstructionTranslations('status.links'),
    ];
    const defaultActions: UnderConstructionAction[] = [
      { label: underConstructionTranslations('actions.backHome'), href: `/${locale}` },
      {
        label: underConstructionTranslations('actions.viewProducts'),
        href: `/${locale}/products/tvs`,
      },
      {
        label: underConstructionTranslations('actions.contact'),
        href: `/${locale}/contact-us`,
      },
    ];
    const actions = options?.actions ?? defaultActions;
    const showUnderConstruction = options?.underConstruction ?? true;
    const officialLinks =
      locale === 'fa'
        ? {
            eyebrow: 'مسیرهای رسمی',
            title: 'صفحات رسمی هایسنس ایران',
            items: [
              {
                href: `/${locale}`,
                label: 'صفحه اصلی هایسنس ایران',
                description: 'مرجع اصلی برند، دسته‌بندی محصولات و مسیرهای رسمی ارتباط.',
              },
              {
                href: `/${locale}/about`,
                label: 'درباره زرین نمای کاسپین',
                description: 'اطلاعات نمایندگی رسمی، شبکه فروش و تاریخچه فعالیت برند در ایران.',
              },
              {
                href: `/${locale}/contact-us`,
                label: 'تماس با هایسنس ایران',
                description: 'شماره‌های تماس، آدرس دفتر مرکزی و کانال‌های رسمی پشتیبانی.',
              },
              {
                href: `/${locale}/hisense-repair`,
                label: 'خدمات تعمیر و پشتیبانی',
                description: 'درخواست سرویس، تعمیرات رسمی و پشتیبانی محصولات هایسنس.',
              },
            ],
          }
        : {
            eyebrow: 'Official paths',
            title: 'Official Hisense Iran pages',
            items: [
              {
                href: `/${locale}`,
                label: 'Hisense Iran homepage',
                description: 'Primary brand page for products, categories, and official channels.',
              },
              {
                href: `/${locale}/about`,
                label: 'About Zarrin Namaye Caspian',
                description:
                  'Official representative profile, network scale, and brand background.',
              },
              {
                href: `/${locale}/contact-us`,
                label: 'Contact Hisense Iran',
                description: 'Verified contact details, head office address, and support channels.',
              },
              {
                href: `/${locale}/hisense-repair`,
                label: 'Repair and support',
                description: 'Official service, maintenance, and repair request page.',
              },
            ],
          };

    return (
      <>
        <RouteHero
          eyebrow={routeTranslations(`${routeKey}.eyebrow`)}
          title={routeTranslations(`${routeKey}.title`)}
          description={routeTranslations(`${routeKey}.description`)}
        />
        {showUnderConstruction && (
          <div className="py-10 sm:py-14 lg:py-16">
            <UnderConstruction
              eyebrow={underConstructionTranslations('eyebrow')}
              title={underConstructionTranslations('title')}
              description={underConstructionTranslations('description')}
              supportingText={underConstructionTranslations('supporting')}
              locale={locale}
              statusItems={statusItems}
              actions={actions}
            />
          </div>
        )}
        <div className="pb-10 sm:pb-14 lg:pb-16">
          <OfficialLinksSection
            locale={locale}
            eyebrow={officialLinks.eyebrow}
            title={officialLinks.title}
            items={officialLinks.items}
          />
        </div>
      </>
    );
  };
}
