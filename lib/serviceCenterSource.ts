import type { Locale } from '@/i18n/routing';
import { prisma } from '@/lib/db';
import {
  serviceCenters,
  type ServiceCenter,
  type ServiceKind,
} from '@/content/service-centers/serviceCenters';

export type ServiceCenterFilters = {
  provinceId?: string;
  cityId?: string;
  serviceKind?: string;
};

export type NormalizedServiceCenterFilters = {
  provinceId?: string;
  cityId?: string;
  serviceKind?: ServiceKind;
};

export type ServiceCenterLocation = {
  id: string;
  label: string;
  cities: Array<{
    id: string;
    label: string;
  }>;
};

type ServiceRepresentativeRow = {
  id: string;
  provinceId: string;
  cityId: string;
  provinceNameFa: string;
  provinceNameEn: string;
  cityNameFa: string;
  cityNameEn: string;
  serviceKind: string;
  representativeNameFa: string;
  representativeNameEn: string;
  representativeCode: string;
  primaryPhone: string;
  mobilePhone: string;
  addressFa: string;
  addressEn: string;
};

type PrismaServiceRepresentativeClient = {
  serviceRepresentative: {
    count(): Promise<number>;
    findMany(args: {
      where?: {
        provinceId?: string;
        cityId?: string;
        serviceKind?: string;
      };
      orderBy: Array<{ sortOrder: 'asc' }>;
      select: Record<keyof ServiceRepresentativeRow, true>;
    }): Promise<ServiceRepresentativeRow[]>;
  };
};

const SERVICE_KINDS = new Set<ServiceKind>(['tv', 'ha', 'rac', 'cac', 'vrf']);

function getServiceRepresentativeClient(): PrismaServiceRepresentativeClient | null {
  if (!prisma) {
    return null;
  }

  return prisma;
}

function isServiceKind(value: string | undefined): value is ServiceKind {
  return Boolean(value && SERVICE_KINDS.has(value as ServiceKind));
}

function emptyToUndefined(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  return value;
}

/**
 * Kohgiluyeh and Boyer-Ahmad shipped under a misspelt province label until the
 * 2026-09-12 cleanup. The label is the source of both `provinceId` and the
 * `cityId` prefix, so correcting it moved every slug for that province. Finder
 * URLs are produced only by the form itself — none are in the sitemap and
 * nothing links to them — but a bookmarked one would otherwise return an empty
 * result set, so the old slug still resolves to the corrected province here.
 */
const LEGACY_PROVINCE_ID = 'کهکیلویه-و-بویر-احمد';
const PROVINCE_ID = 'کهگیلویه-و-بویراحمد';

function resolveLegacyLocationId(value: string | undefined) {
  if (!value) {
    return value;
  }

  if (value === LEGACY_PROVINCE_ID) {
    return PROVINCE_ID;
  }

  // City ids are `<provinceId>-<city>`, so the prefix moves with the province.
  if (value.startsWith(`${LEGACY_PROVINCE_ID}-`)) {
    return `${PROVINCE_ID}${value.slice(LEGACY_PROVINCE_ID.length)}`;
  }

  return value;
}

export function normalizeServiceCenterFilters(
  filters: ServiceCenterFilters,
): NormalizedServiceCenterFilters {
  return {
    provinceId: resolveLegacyLocationId(emptyToUndefined(filters.provinceId)),
    cityId: resolveLegacyLocationId(emptyToUndefined(filters.cityId)),
    serviceKind: isServiceKind(filters.serviceKind) ? filters.serviceKind : undefined,
  };
}

function toServiceCenter(row: ServiceRepresentativeRow): ServiceCenter {
  return {
    id: row.id,
    provinceId: row.provinceId,
    cityId: row.cityId,
    provinceName: {
      fa: row.provinceNameFa,
      en: row.provinceNameEn,
    },
    cityName: {
      fa: row.cityNameFa,
      en: row.cityNameEn,
    },
    serviceKind: isServiceKind(row.serviceKind) ? row.serviceKind : 'tv',
    representativeName: {
      fa: row.representativeNameFa,
      en: row.representativeNameEn,
    },
    representativeCode: row.representativeCode,
    primaryPhone: row.primaryPhone,
    mobilePhone: row.mobilePhone,
    address: {
      fa: row.addressFa,
      en: row.addressEn,
    },
  };
}

function serviceCenterSelect(): Record<keyof ServiceRepresentativeRow, true> {
  return {
    id: true,
    provinceId: true,
    cityId: true,
    provinceNameFa: true,
    provinceNameEn: true,
    cityNameFa: true,
    cityNameEn: true,
    serviceKind: true,
    representativeNameFa: true,
    representativeNameEn: true,
    representativeCode: true,
    primaryPhone: true,
    mobilePhone: true,
    addressFa: true,
    addressEn: true,
  };
}

function applyFilters(
  centers: ServiceCenter[],
  filters: NormalizedServiceCenterFilters,
): ServiceCenter[] {
  return centers.filter((center) => {
    if (filters.provinceId && center.provinceId !== filters.provinceId) return false;
    if (filters.cityId && center.cityId !== filters.cityId) return false;
    if (filters.serviceKind && center.serviceKind !== filters.serviceKind) return false;
    return true;
  });
}

function filterLocalServiceCenters(filters: NormalizedServiceCenterFilters) {
  return applyFilters(serviceCenters, filters);
}

function sortServiceCenters(locale: Locale, centers: ServiceCenter[]) {
  return [...centers].sort((firstCenter, secondCenter) => {
    const provinceCompare = firstCenter.provinceName[locale].localeCompare(
      secondCenter.provinceName[locale],
      locale,
    );
    if (provinceCompare !== 0) return provinceCompare;

    const cityCompare = firstCenter.cityName[locale].localeCompare(
      secondCenter.cityName[locale],
      locale,
    );
    if (cityCompare !== 0) return cityCompare;

    const serviceKindCompare = firstCenter.serviceKind.localeCompare(secondCenter.serviceKind);
    if (serviceKindCompare !== 0) return serviceKindCompare;

    return firstCenter.representativeName[locale].localeCompare(
      secondCenter.representativeName[locale],
      locale,
    );
  });
}

export function getServiceCenterLocations(locale: Locale, centers: ServiceCenter[]) {
  const locationMap = new Map<
    string,
    {
      id: string;
      label: string;
      cityMap: Map<string, { id: string; label: string }>;
    }
  >();

  centers.forEach((center) => {
    if (!locationMap.has(center.provinceId)) {
      locationMap.set(center.provinceId, {
        id: center.provinceId,
        label: center.provinceName[locale],
        cityMap: new Map(),
      });
    }

    locationMap.get(center.provinceId)?.cityMap.set(center.cityId, {
      id: center.cityId,
      label: center.cityName[locale],
    });
  });

  return Array.from(locationMap.values())
    .map((location) => ({
      id: location.id,
      label: location.label,
      cities: Array.from(location.cityMap.values()).sort((firstCity, secondCity) =>
        firstCity.label.localeCompare(secondCity.label, locale),
      ),
    }))
    .sort((firstLocation, secondLocation) =>
      firstLocation.label.localeCompare(secondLocation.label, locale),
    );
}

export async function loadServiceCenterData(
  locale: Locale,
  filters: ServiceCenterFilters,
  includeCenters = true,
): Promise<{
  centers: ServiceCenter[];
  locations: ServiceCenterLocation[];
  totalCount: number;
  source: 'database' | 'fallback';
}> {
  const serviceRepresentativeClient = getServiceRepresentativeClient();
  const normalizedFilters = normalizeServiceCenterFilters(filters);

  if (serviceRepresentativeClient) {
    try {
      const allRows = await serviceRepresentativeClient.serviceRepresentative.findMany({
        orderBy: [{ sortOrder: 'asc' }],
        select: serviceCenterSelect(),
      });

      if (allRows.length > 0) {
        const allCenters = sortServiceCenters(locale, allRows.map(toServiceCenter));
        const filteredCenters = includeCenters ? applyFilters(allCenters, normalizedFilters) : [];

        return {
          centers: filteredCenters,
          locations: getServiceCenterLocations(locale, allCenters),
          totalCount: allRows.length,
          source: 'database',
        };
      }
    } catch (error) {
      console.error('[service-centers] database fetch failed', error);
    }
  }

  return {
    centers: includeCenters
      ? sortServiceCenters(locale, filterLocalServiceCenters(normalizedFilters))
      : [],
    locations: getServiceCenterLocations(locale, serviceCenters),
    totalCount: serviceCenters.length,
    source: 'fallback',
  };
}
