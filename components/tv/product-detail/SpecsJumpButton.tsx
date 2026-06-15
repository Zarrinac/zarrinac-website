'use client';

// Quick-jump pill that smooth-scrolls the page to the specs section.
// Specs live at the bottom of the detail page; this surfaces them near the
// title so users don't have to scroll the whole page to reach them.
import { HiArrowDown } from 'react-icons/hi2';
import { smoothScrollToId } from '@/lib/scrollToElement';

type SpecsJumpButtonProps = {
  targetId: string;
  lang: 'fa' | 'en';
};

const SpecsJumpButton = ({ targetId, lang }: SpecsJumpButtonProps) => {
  const handleClick = () => smoothScrollToId(targetId);

  return (
    <div className="flex justify-center w-full px-4 mx-auto max-w-360">
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition rounded-full shadow-sm hover:opacity-90 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-(--brand-color) sm:text-base"
        style={{ backgroundImage: 'var(--brand-gradient)' }}
      >
        <span>{lang === 'fa' ? 'مشاهده مشخصات فنی' : 'View specifications'}</span>
        <HiArrowDown aria-hidden className="w-4 h-4" />
      </button>
    </div>
  );
};

export default SpecsJumpButton;
