import { type StaticImageData } from 'next/image';

export type ImageSource = StaticImageData | string;

// Shape of the TV catalog content used by both pages and API fallbacks.
export type Locale = 'en' | 'fa';

export type CopyBlockKey =
  | 'featureIntro'
  | 'masterMoment'
  | 'intelligentProcessor'
  | 'detail'
  | 'details'
  | 'dolby'
  | 'imax'
  | 'filmMaker'
  | 'gamePlay'
  | 'autoLight'
  | 'sportsMode'
  | 'optimization'
  | 'stayConnected'
  | 'experience'
  | 'vrr'
  | 'screenTear'
  | 'vividColor'
  | 'gaming'
  | 'enhancement'
  | 'noBlur'
  | 'fuzzyImage'
  | 'brightness'
  | 'gameManagement'
  | 'movies'
  | 'biggerScreen'
  | 'sizes'
  | 'voiceCommand'
  | 'nature'
  | 'depth'
  | 'entertainment'
  | 'audio'
  | 'leaderboard'
  | 'easyFastSecure'
  | 'cast'
  | 'connect'
  | 'visual'
  | 'quickWash'
  | 'allergySteam'
  | 'stains'
  | 'selfDiagnostic'
  | 'quickWashDry'
  | 'lintClean'
  | 'slimDesign'
  | 'innerHighLiftPump'
  | 'floatSwitch'
  | 'filter'
  | 'onePaAdjustment'
  | 'premiumFlatDoor'
  | 'myFreshChoice'
  | 'tripleZone'
  | 'bigCapacity'
  | 'metalGlideDrawers'
  | 'metalCooling'
  | 'adjustableShelves'
  | 'waterDispenser'
  | 'inverterTechnology'
  | 'preciseTempControl'
  | 'metalRecessedHandle'
  | 'bigDoorBalcony'
  | 'biggerDrawers'
  | 'superCool'
  | 'doorAlarm'
  | 'iceWaterDispenser'
  | 'independentZones'
  | 'selfClosingSystem'
  | 'multiAirFlow'
  | 'digitalSensors'
  | 'sleekWaterDispenser'
  | 'durableInverter'
  | 'totalNoFrost'
  | 'largeCrisperPlus'
  | 'premiumDesign'
  | 'counterDepth'
  | 'freshZone'
  | 'removableTwistIceMaker'
  | 'electronicTouchControl'
  | 'softLedLighting'
  | 'superFreeze'
  | 'microVentsTechnology'
  | 'moistureFreshCrisper'
  | 'temperedGlassShelves'
  | 'freshBox'
  | 'preciseElectronicControl'
  | 'reversibleDoor'
  | 'lowNoise'
  | 'easyToUseDrawer'
  | 'easyOpenDrawer'
  | 'easyOpenDoorHandle'
  | 'freshCrisper'
  | 'fullWidthAirflow'
  | 'ledLighting'
  | 'pureAppearance'
  | 'adjustableLegs'
  | 'ledDisplay'
  | 'premiumAppearance'
  | 'keepFor135H'
  | 'cooling360'
  | 'ultrathinHinges'
  | 'slidingBasket'
  | 'lessIsMore'
  | 'premiumBoundlessDoor'
  | 'hoveringDoor'
  | 'mechanicalTemperatureControl'
  | 'fourInOneFilter'
  | 'accurateTemperatureControl'
  | 'iFeel'
  | 'autoSwing4d'
  | 'antiCorrosionGoldenFin'
  | 'easyCleaning'
  | 'easyInstallations'
  | 'easyMaintenance'
  | 'anionSterilization'
  | 'highEnergyEfficiency';

export type CopyBlock = {
  title?: string;
  text?: string;
};

export type TvProductCopy = {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  blocks: Partial<Record<CopyBlockKey, CopyBlock>>;
};

export type TvSectionConfig = {
  image: ImageSource;
  copyKey: CopyBlockKey;
  textPosition?: 'left' | 'right';
};

export type TvComparisonConfig = {
  before: ImageSource;
  after: ImageSource;
  copyKey: CopyBlockKey;
};

export type TvSectionGroup = {
  kind: 'content' | 'stacked' | 'overlay';
  textFirst?: boolean;
  sections: TvSectionConfig[];
};

export type TvFeatureCard = {
  title: string;
  description: string;
  image: ImageSource;
  imageBlack?: ImageSource;
  layout?: 'stacked' | 'inline';
};

export type TvBanner = {
  id: string;
  desktop: ImageSource;
  mobile?: ImageSource;
  alt: string;
};

export type TvProduct = {
  id: string;
  sku: string;
  size?: string;
  sizes?: string[];
  series: string;
  seriesLabel?: string;
  panel: string;
  resolution: string;
  refreshRate: string;
  os: string;
  sound: string;
  connectivity: string[];
  tuner: string;
  extras: string[];
  image: ImageSource;
  heroVideo?: string;
  posterImage?: ImageSource;
  topBanner?: ImageSource;
  availableColors?: Partial<Record<Locale, string[]>>;
  gallery?: ImageSource[];
  contentSections?: TvSectionConfig[];
  stackedSections?: TvSectionConfig[];
  bottomStackedSections?: TvSectionConfig[];
  sectionGroups?: TvSectionGroup[];
  comparisonSections?: TvComparisonConfig[];
  experienceSection?: TvSectionConfig;
  featureCards?: TvFeatureCard[];
  badges?: ImageSource[];
  banners?: TvBanner[];
  specs?: Record<Locale, string[]>;
  copy: Record<Locale, TvProductCopy>;
};
