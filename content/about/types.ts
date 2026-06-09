// Typed contract for localized About page content consumed by the page component.
export type AboutImageKey = 'factory' | 'hisense' | 'showroom';

export type AboutHero = {
  eyebrow: string;
  title: string;
  summary: string;
  imageKey?: AboutImageKey;
  ctas?: { label: string; href: string }[];
};

export type AboutMeta = {
  title: string;
  description: string;
  keywords: string[];
};

export type AboutStat = {
  value: string;
  label: string;
  sublabel?: string;
};

export type AboutHighlight = {
  title: string;
  description: string;
};

export type AboutSection = {
  title: string;
  subtitle: string;
  body: string[];
  highlights?: AboutHighlight[];
  image: {
    key: AboutImageKey;
    alt: string;
  };
};

export type AboutContactItem = {
  label: string;
  value: string;
  href?: string;
};

export type AboutContact = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  items: AboutContactItem[];
};

export type AboutPillar = {
  title: string;
  description: string;
};

export type AboutTimelineEntry = {
  year: string;
  title: string;
  description: string;
};

export type AboutValue = {
  title: string;
  description: string;
};

export type AboutCSRHighlight = {
  title: string;
  description: string;
};

export type AboutCSR = {
  title: string;
  description: string;
  highlights: AboutCSRHighlight[];
};

export type AboutPageContent = {
  hero: AboutHero;
  meta: AboutMeta;
  stats: AboutStat[];
  sections: AboutSection[];
  contact: AboutContact;
  pillars?: AboutPillar[];
  timeline?: AboutTimelineEntry[];
  values?: AboutValue[];
  csr?: AboutCSR;
};
