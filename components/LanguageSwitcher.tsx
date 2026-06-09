'use client';

// Locale toggle that swaps the current route to the opposite locale without full reload.
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';
import LanguageIcon from '@mui/icons-material/Language';
import { useTransition } from 'react';

type LanguageSwitcherProps = {
  className?: string;
};

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('LanguageSwitcher');
  const [isPending, startTransition] = useTransition();

  const nextLocale: Locale = locale === 'fa' ? 'en' : 'fa';

  const toggleLocale = () => {
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale });
    });
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      disabled={isPending}
      className={className}
      aria-label={`${t('label')} ${t(`options.${nextLocale}`)}`}
      title={`${t('label')} ${t(`options.${nextLocale}`)}`}
    >
      <LanguageIcon fontSize="small" />
    </button>
  );
}
