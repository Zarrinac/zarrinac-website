import Link from 'next/link';
import Image, { type StaticImageData } from 'next/image';
import { HiArrowLongRight } from 'react-icons/hi2';

// Category spotlight grid linking to major product lines.

export type SpotlightCard = {
  id: string;
  title: string;
  eyebrow?: string;
  description: string;
  cta: string;
  href: string;
  image: StaticImageData | string;
};

type CategorySpotlightsProps = {
  eyebrow?: string;
  title: string;
  items: SpotlightCard[];
  locale?: string;
};

export default function CategorySpotlights({
  eyebrow,
  title,
  items,
  locale,
}: CategorySpotlightsProps) {
  if (!items.length) {
    return null;
  }

  const isRTL = locale === 'fa';
  const renderTitle = (text: string) => {
    const parts = text.trim().split(' ');
    if (parts.length === 0) return null;
    if (parts.length === 1) {
      return <span className="text-(--brand-color)">{text}</span>;
    }
    const last = parts.pop();
    const leading = parts.join(' ');
    return (
      <>
        <span>{leading}</span> <span className="text-(--brand-color)">{last}</span>
      </>
    );
  };

  return (
    <section className="bg-(--background-color) py-16 text-(--default-black-font) lg:py-24">
      <div className="mx-auto flex flex-col gap-10 md:px-12">
        <header className="text-center">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-(--text-muted-color)">
              {eyebrow}
            </p>
          )}
          <h2
            className="mt-3 font-bold tracking-tight"
            style={{
              fontSize: 'clamp(32px, calc(32px + (20) * ((100vw - 1024px) / 416)), 52px)',
              lineHeight: '1.1',
            }}
          >
            {renderTitle(title)}
          </h2>
        </header>

        <div className="flex flex-col">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="mb-2.5 group relative block focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-(--brand-color)"
              aria-label={`${item.cta} - ${item.title}`}
            >
              <div className="relative w-full overflow-hidden bg-black aspect-25/32 md:aspect-56/25">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                  sizes="100vw"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 group-hover:from-black/60 group-hover:via-black/20" />

                <div className="relative z-10 flex h-full flex-col justify-between text-white p-4 lg:p-8 2xl:p-10">
                  <h3 className="text-xl font-semibold sm:text-2xl lg:text-4xl text-center">
                    {item.title}
                  </h3>
                  <div className="flex flex-col gap-4 2xl:gap-6 5xl:gap-10">
                    <p className="max-w-2xl text-base text-white/90 md:font-semibold md:text-lg xl:text-2xl 2xl:text-3xl 5xl:text-4xl">
                      {item.description}
                    </p>
                    <span
                      className={`inline-flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} w-fit items-center gap-2 rounded-full bg-transparent px-3 4xl:px-5 py-2 4xl:py-3 text-xs 4xl:text-base 5xl:text-xl font-semibold uppercase tracking-wide border-2 border-(--default-white-font) text-(--default-white-font) transition hover:bg-white hover:text-black dark:hover:text-black`}
                    >
                      {item.cta}
                      <HiArrowLongRight
                        className="h-4 w-4 2xl:h-5 2xl:w-5 5xl:h-7 5xl:w-7"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
