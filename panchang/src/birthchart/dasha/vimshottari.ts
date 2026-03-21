/**
 * Vimshottari Dasha Calculator
 * Computes the 120-year planetary period system based on Moon's nakshatra at birth.
 * Supports up to 5 levels: Maha, Antar, Pratyantar, Sookshma, Prana.
 */

import { DASHA_YEARS, DASHA_SEQUENCE, NAKSHATRA_LORDS } from './constants';

// ── Types ───────────────────────────────────────────────────────────────────────

export interface DashaPeriod {
  planet: string;
  level: number;           // 1=Maha, 2=Antar, 3=Pratyantar, 4=Sookshma, 5=Prana
  levelName: string;       // "Maha Dasha", "Antar Dasha", etc.
  startDate: string;       // ISO date string (YYYY-MM-DD)
  endDate: string;
  durationDays: number;
  isActive: boolean;       // True if current date falls within this period
  subPeriods?: DashaPeriod[];  // Next level down
}

export interface VimshottariResult {
  birthNakshatra: string;
  birthNakshatraLord: string;
  balanceAtBirth: {
    planet: string;
    years: number;
    months: number;
    days: number;
  };
  mahaDashas: DashaPeriod[];
  currentDasha: {
    maha: string;
    antar: string;
    pratyantar: string;
    sookshma: string;
    prana: string;
  };
}

// ── Constants ───────────────────────────────────────────────────────────────────

const NAKSHATRA_SPAN = 13 + 1 / 3;  // 13°20' = 13.333...°
const TOTAL_DASHA_YEARS = 120;
const DAYS_PER_YEAR = 365.25;

const LEVEL_NAMES: Record<number, string> = {
  1: 'Maha Dasha',
  2: 'Antar Dasha',
  3: 'Pratyantar Dasha',
  4: 'Sookshma Dasha',
  5: 'Prana Dasha',
};

// ── Helpers ─────────────────────────────────────────────────────────────────────

/** Add fractional days to a Date, return a new Date. */
function addDays(date: Date, days: number): Date {
  const ms = date.getTime() + days * 86_400_000;
  return new Date(ms);
}

/** Format Date as YYYY-MM-DD. */
function toISODate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the dasha sequence starting from a given lord. */
function getSequenceFrom(startLord: string): string[] {
  const idx = DASHA_SEQUENCE.indexOf(startLord);
  if (idx === -1) {
    throw new Error(`Unknown dasha lord: ${startLord}`);
  }
  const seq: string[] = [];
  for (let i = 0; i < 9; i++) {
    seq.push(DASHA_SEQUENCE[(idx + i) % 9]);
  }
  return seq;
}

/** Check if a date (ms) falls within [start, end). */
function isDateInRange(nowMs: number, startMs: number, endMs: number): boolean {
  return nowMs >= startMs && nowMs < endMs;
}

/** Convert fractional years to { years, months, days }. */
function yearsToComponents(totalYears: number): { years: number; months: number; days: number } {
  const years = Math.floor(totalYears);
  const remainingMonths = (totalYears - years) * 12;
  const months = Math.floor(remainingMonths);
  const days = Math.round((remainingMonths - months) * 30.4375);
  return { years, months, days };
}

// ── Sub-period Generator ────────────────────────────────────────────────────────

/**
 * Recursively generate dasha sub-periods.
 * @param startLord - The lord of the parent period (sub-sequence starts here)
 * @param parentDurationDays - Duration of the parent period in days
 * @param parentStartDate - Start date of the parent period
 * @param level - Current depth level (2=Antar, 3=Pratyantar, etc.)
 * @param maxDepth - Maximum depth to generate
 * @param nowMs - Current time in ms for isActive detection
 */
function generateSubPeriods(
  startLord: string,
  parentDurationDays: number,
  parentStartDate: Date,
  level: number,
  maxDepth: number,
  nowMs: number,
): DashaPeriod[] {
  if (level > maxDepth) return [];

  const sequence = getSequenceFrom(startLord);
  const periods: DashaPeriod[] = [];
  let cursor = new Date(parentStartDate.getTime());

  for (const planet of sequence) {
    const durationDays = (parentDurationDays * DASHA_YEARS[planet]) / TOTAL_DASHA_YEARS;
    const endDate = addDays(cursor, durationDays);
    const startMs = cursor.getTime();
    const endMs = endDate.getTime();
    const active = isDateInRange(nowMs, startMs, endMs);

    const period: DashaPeriod = {
      planet,
      level,
      levelName: LEVEL_NAMES[level],
      startDate: toISODate(cursor),
      endDate: toISODate(endDate),
      durationDays: Math.round(durationDays * 100) / 100,
      isActive: active,
    };

    // Only recurse into active periods or all periods if depth allows
    // For performance, only generate deeper sub-periods for the active branch
    if (level < maxDepth && active) {
      period.subPeriods = generateSubPeriods(
        planet, durationDays, cursor, level + 1, maxDepth, nowMs,
      );
    }

    periods.push(period);
    cursor = endDate;
  }

  return periods;
}

// ── Main Calculator ─────────────────────────────────────────────────────────────

/**
 * Calculate Vimshottari Dasha for a birth chart.
 * @param birthDate - Date object of birth
 * @param moonNakshatra - Name of Moon's nakshatra
 * @param moonNakshatraDegree - Moon's degree within the nakshatra (0-13.333)
 * @param depth - How many levels to calculate (1-5, default 5)
 */
export function calculateVimshottariDasha(
  birthDate: Date,
  moonNakshatra: string,
  moonNakshatraDegree: number,
  depth: number = 5,
): VimshottariResult {
  // Validate inputs
  const startLord = NAKSHATRA_LORDS[moonNakshatra];
  if (!startLord) {
    throw new Error(`Unknown nakshatra: ${moonNakshatra}`);
  }
  if (moonNakshatraDegree < 0 || moonNakshatraDegree > NAKSHATRA_SPAN) {
    throw new Error(
      `moonNakshatraDegree must be between 0 and ${NAKSHATRA_SPAN}, got ${moonNakshatraDegree}`,
    );
  }
  const maxDepth = Math.max(1, Math.min(5, depth));

  // ── Step 1: Balance of first dasha at birth ─────────────────────────────────
  const proportionElapsed = moonNakshatraDegree / NAKSHATRA_SPAN;
  const proportionRemaining = 1 - proportionElapsed;
  const balanceYears = DASHA_YEARS[startLord] * proportionRemaining;
  const balanceDays = balanceYears * DAYS_PER_YEAR;

  // ── Step 2: Generate Maha Dasha sequence ────────────────────────────────────
  const sequence = getSequenceFrom(startLord);
  const now = new Date();
  const nowMs = now.getTime();
  const mahaDashas: DashaPeriod[] = [];
  let cursor = new Date(birthDate.getTime());

  for (let i = 0; i < sequence.length; i++) {
    const planet = sequence[i];
    // First dasha uses balance, rest use full duration
    const durationDays = i === 0
      ? balanceDays
      : DASHA_YEARS[planet] * DAYS_PER_YEAR;

    const endDate = addDays(cursor, durationDays);
    const startMs = cursor.getTime();
    const endMs = endDate.getTime();
    const active = isDateInRange(nowMs, startMs, endMs);

    const maha: DashaPeriod = {
      planet,
      level: 1,
      levelName: LEVEL_NAMES[1],
      startDate: toISODate(cursor),
      endDate: toISODate(endDate),
      durationDays: Math.round(durationDays * 100) / 100,
      isActive: active,
    };

    // Generate sub-periods (Antar and deeper)
    if (maxDepth >= 2) {
      if (active) {
        // Full sub-period tree for active maha dasha
        maha.subPeriods = generateSubPeriods(
          planet, durationDays, cursor, 2, maxDepth, nowMs,
        );
      } else {
        // Only Antar level for inactive maha dashas (no deep recursion)
        maha.subPeriods = generateSubPeriods(
          planet, durationDays, cursor, 2, 2, nowMs,
        );
      }
    }

    mahaDashas.push(maha);
    cursor = endDate;
  }

  // ── Step 3: Determine current dasha at each level ───────────────────────────
  const currentDasha = {
    maha: '',
    antar: '',
    pratyantar: '',
    sookshma: '',
    prana: '',
  };

  const levelKeys: (keyof typeof currentDasha)[] = [
    'maha', 'antar', 'pratyantar', 'sookshma', 'prana',
  ];

  // Walk down the active branch
  let activePeriods: DashaPeriod[] | undefined = mahaDashas;
  for (let lvl = 0; lvl < maxDepth && activePeriods; lvl++) {
    const activePeriod = activePeriods.find(p => p.isActive);
    if (activePeriod) {
      currentDasha[levelKeys[lvl]] = activePeriod.planet;
      activePeriods = activePeriod.subPeriods;
    } else {
      break;
    }
  }

  return {
    birthNakshatra: moonNakshatra,
    birthNakshatraLord: startLord,
    balanceAtBirth: {
      planet: startLord,
      ...yearsToComponents(balanceYears),
    },
    mahaDashas,
    currentDasha,
  };
}
