import type { Locale } from '@/i18n/routing';
import { prisma } from '@/lib/db';
import { useLocalContent } from '@/lib/contentSource';
import { getLocationDisplayName, iranProvinces, type IranProvince } from '@/lib/iranLocations';

type LocationDataSource = 'database' | 'fallback';
type IranProvinceQueryRow = {
  id: string;
  nameFa: string;
  nameEn: string;
  cities: IranCityQueryRow[];
};

type IranCityQueryRow = {
  id: string;
  nameFa: string;
  nameEn: string;
};

type IranCityDisplayRow = {
  nameFa: string;
  nameEn: string;
  province: {
    nameFa: string;
    nameEn: string;
  };
};

type PrismaIranLocationClient = {
  iranProvince: {
    findMany(args: {
      orderBy: { sortOrder: 'asc' | 'desc' };
      include: {
        cities: {
          orderBy: { sortOrder: 'asc' | 'desc' };
        };
      };
    }): Promise<IranProvinceQueryRow[]>;
  };
  iranCity: {
    findFirst(args: {
      where: {
        id: string;
        provinceId: string;
      };
      select: {
        nameFa: true;
        nameEn: true;
        province: {
          select: {
            nameFa: true;
            nameEn: true;
          };
        };
      };
    }): Promise<IranCityDisplayRow | null>;
  };
};

function getIranLocationClient(): PrismaIranLocationClient | null {
  if (!prisma) {
    return null;
  }

  return prisma;
}

function toProvinceRecord(province: IranProvinceQueryRow): IranProvince {
  return {
    id: province.id,
    labels: {
      fa: province.nameFa,
      en: province.nameEn,
    },
    cities: province.cities.map((city) => ({
      id: city.id,
      labels: {
        fa: city.nameFa,
        en: city.nameEn,
      },
    })),
  };
}

export async function loadIranProvinces(): Promise<{
  provinces: IranProvince[];
  source: LocationDataSource;
}> {
  const locationClient = getIranLocationClient();

  if (!useLocalContent && locationClient) {
    try {
      const provinces = await locationClient.iranProvince.findMany({
        orderBy: { sortOrder: 'asc' },
        include: {
          cities: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      if (provinces.length > 0) {
        return {
          provinces: provinces.map(toProvinceRecord),
          source: 'database',
        };
      }
    } catch (error) {
      console.error('[iran-locations] database fetch failed', error);
    }
  }

  return {
    provinces: iranProvinces,
    source: 'fallback',
  };
}

export async function getIranLocationDisplayName(
  locale: Locale,
  provinceId: string,
  cityId: string,
): Promise<string | null> {
  const locationClient = getIranLocationClient();

  if (!useLocalContent && locationClient) {
    try {
      const city = await locationClient.iranCity.findFirst({
        where: {
          id: cityId,
          provinceId,
        },
        select: {
          nameFa: true,
          nameEn: true,
          province: {
            select: {
              nameFa: true,
              nameEn: true,
            },
          },
        },
      });

      if (city) {
        const provinceLabel = locale === 'fa' ? city.province.nameFa : city.province.nameEn;
        const cityLabel = locale === 'fa' ? city.nameFa : city.nameEn;
        return `${provinceLabel} / ${cityLabel}`;
      }
    } catch (error) {
      console.error('[iran-locations] database lookup failed', error);
    }
  }

  return getLocationDisplayName(locale, provinceId, cityId);
}
