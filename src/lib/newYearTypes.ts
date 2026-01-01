export type NewYearType =
  | 'gregorian'
  | 'chinese'
  | 'japanese'
  | 'jewish'
  | 'islamic'
  | 'persian'
  | 'thai';

export interface NewYearInfo {
  id: NewYearType;
  nameKey: string;
  getNextNewYear: (referenceDate: Date) => Date;
  getYearLabel: (date: Date) => string;
}

// Chinese New Year dates (approximate - falls between Jan 21 and Feb 20)
// These are pre-calculated for accuracy
const chineseNewYearDates: Record<number, string> = {
  2024: '2024-02-10',
  2025: '2025-01-29',
  2026: '2026-02-17',
  2027: '2027-02-06',
  2028: '2028-01-26',
  2029: '2029-02-13',
  2030: '2030-02-03',
  2031: '2031-01-23',
  2032: '2032-02-11',
  2033: '2033-01-31',
};

// Chinese zodiac animals
const chineseZodiac = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

function getChineseZodiac(year: number): string {
  return chineseZodiac[(year - 4) % 12];
}

// Japanese New Year is same as Gregorian (Jan 1)
// but uses era names (currently Reiwa since 2019)
function getJapaneseEraYear(date: Date): string {
  const year = date.getFullYear();
  // Reiwa era started May 1, 2019
  if (year >= 2019) {
    const reiwaYear = year - 2018;
    return `Reiwa ${reiwaYear}`;
  }
  return `${year}`;
}

// Jewish New Year (Rosh Hashanah) - approximate dates
const jewishNewYearDates: Record<number, string> = {
  2024: '2024-10-03',
  2025: '2025-09-23',
  2026: '2026-09-12',
  2027: '2027-10-02',
  2028: '2028-09-21',
  2029: '2029-09-10',
  2030: '2030-09-28',
};

// Islamic New Year (1 Muharram) - approximate dates
const islamicNewYearDates: Record<number, string> = {
  2024: '2024-07-08',
  2025: '2025-06-27',
  2026: '2026-06-17',
  2027: '2027-06-07',
  2028: '2028-05-26',
  2029: '2029-05-15',
  2030: '2030-05-05',
};

// Persian New Year (Nowruz) - March 20 or 21
function getPersianNewYear(year: number): Date {
  // Nowruz typically falls on March 20 or 21
  return new Date(year, 2, 20); // March 20
}

// Thai New Year (Songkran) - April 13
function getThaiNewYear(year: number): Date {
  return new Date(year, 3, 13); // April 13
}

function findNextDate(referenceDate: Date, getDates: Record<number, string>): Date {
  const refTime = referenceDate.getTime();
  const currentYear = referenceDate.getFullYear();

  for (let year = currentYear; year <= currentYear + 2; year++) {
    const dateStr = getDates[year];
    if (dateStr) {
      const date = new Date(dateStr + 'T00:00:00');
      if (date.getTime() > refTime) {
        return date;
      }
    }
  }
  // Fallback: estimate for future years
  const lastKnownYear = Math.max(...Object.keys(getDates).map(Number));
  return new Date(getDates[lastKnownYear]);
}

export const newYearTypes: NewYearInfo[] = [
  {
    id: 'gregorian',
    nameKey: 'gregorian',
    getNextNewYear: (ref: Date) => {
      const year = ref.getFullYear();
      const nextNewYear = new Date(year + 1, 0, 1);
      if (nextNewYear.getTime() <= ref.getTime()) {
        return new Date(year + 2, 0, 1);
      }
      return nextNewYear;
    },
    getYearLabel: (date: Date) => `${date.getFullYear()}`,
  },
  {
    id: 'chinese',
    nameKey: 'chinese',
    getNextNewYear: (ref: Date) => findNextDate(ref, chineseNewYearDates),
    getYearLabel: (date: Date) => {
      const year = date.getFullYear();
      return `${year} - Year of the ${getChineseZodiac(year)}`;
    },
  },
  {
    id: 'japanese',
    nameKey: 'japanese',
    getNextNewYear: (ref: Date) => {
      const year = ref.getFullYear();
      const nextNewYear = new Date(year + 1, 0, 1);
      if (nextNewYear.getTime() <= ref.getTime()) {
        return new Date(year + 2, 0, 1);
      }
      return nextNewYear;
    },
    getYearLabel: (date: Date) => getJapaneseEraYear(date),
  },
  {
    id: 'jewish',
    nameKey: 'jewish',
    getNextNewYear: (ref: Date) => findNextDate(ref, jewishNewYearDates),
    getYearLabel: (date: Date) => {
      // Hebrew year is ~3760 years ahead
      const hebrewYear = date.getFullYear() + 3760;
      return `${hebrewYear}`;
    },
  },
  {
    id: 'islamic',
    nameKey: 'islamic',
    getNextNewYear: (ref: Date) => findNextDate(ref, islamicNewYearDates),
    getYearLabel: (date: Date) => {
      // Islamic year calculation (approximate)
      const gregorianYear = date.getFullYear();
      const islamicYear = Math.floor((gregorianYear - 622) * (33 / 32)) + 1;
      return `${islamicYear} AH`;
    },
  },
  {
    id: 'persian',
    nameKey: 'persian',
    getNextNewYear: (ref: Date) => {
      const year = ref.getFullYear();
      let nextNowruz = getPersianNewYear(year);
      if (nextNowruz.getTime() <= ref.getTime()) {
        nextNowruz = getPersianNewYear(year + 1);
      }
      return nextNowruz;
    },
    getYearLabel: (date: Date) => {
      // Persian year is ~621 years behind
      const persianYear = date.getFullYear() - 621;
      return `${persianYear}`;
    },
  },
  {
    id: 'thai',
    nameKey: 'thai',
    getNextNewYear: (ref: Date) => {
      const year = ref.getFullYear();
      let nextSongkran = getThaiNewYear(year);
      if (nextSongkran.getTime() <= ref.getTime()) {
        nextSongkran = getThaiNewYear(year + 1);
      }
      return nextSongkran;
    },
    getYearLabel: (date: Date) => {
      // Thai Buddhist Era is 543 years ahead
      const thaiYear = date.getFullYear() + 543;
      return `${thaiYear} BE`;
    },
  },
];

export function getNewYearType(id: NewYearType): NewYearInfo | undefined {
  return newYearTypes.find((t) => t.id === id);
}

export function getNextNewYearDate(type: NewYearType, referenceDate: Date, timezone?: string): Date {
  const info = getNewYearType(type);
  if (!info) return new Date();

  // If timezone is provided, adjust the reference date
  let adjustedRef = referenceDate;
  if (timezone) {
    try {
      const tzDate = new Date(referenceDate.toLocaleString('en-US', { timeZone: timezone }));
      adjustedRef = tzDate;
    } catch {
      // Fallback to original date if timezone is invalid
    }
  }

  return info.getNextNewYear(adjustedRef);
}
