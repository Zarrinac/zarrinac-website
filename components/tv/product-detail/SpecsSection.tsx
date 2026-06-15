// Simple specs list; labels switch between FA/EN.
type SpecsSectionProps = {
  items: string[];
  lang: 'fa' | 'en';
  id?: string;
};

const SpecsSection = ({ items, lang, id }: SpecsSectionProps) => (
  <div
    id={id}
    // scroll-mt offsets the sticky desktop header when jumped to via anchor.
    className="w-full mx-auto space-y-8 scroll-mt-24 sm:space-y-10 md:space-y-12 max-w-360"
  >
    <div className="space-y-4 rounded-3xl border border-(--border-color) bg-(--surface-color) p-4 shadow-sm sm:p-6 md:p-8">
      <h2 className="text-xl font-bold text-center sm:text-2xl md:text-3xl">
        {lang === 'fa' ? 'مشخصات فنی' : 'Specifications'}
      </h2>
      <ul className="grid gap-2.5 text-sm text-(--default-black-font) sm:grid-cols-2 md:text-base">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 rounded-xl bg-(--surface-color-2) px-3 py-2"
          >
            <span aria-hidden className="mt-2 h-2 w-2 rounded-full bg-(--brand-color)" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default SpecsSection;
