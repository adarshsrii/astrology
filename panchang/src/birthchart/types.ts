/**
 * Birth Chart (Kundli) Types
 * All TypeScript interfaces for birth chart calculations.
 */

// ── Graha Names ──────────────────────────────────────────────────────────────

export type GrahaName =
  | 'Sun'
  | 'Moon'
  | 'Mars'
  | 'Mercury'
  | 'Jupiter'
  | 'Venus'
  | 'Saturn'
  | 'Rahu'
  | 'Ketu';

export const ALL_GRAHAS: GrahaName[] = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
];

// ── Dignity / Planetary States ───────────────────────────────────────────────

export type Dignity =
  | 'peak_exalted'
  | 'exalted'
  | 'moolatrikona'
  | 'own_sign'
  | 'neutral'
  | 'debilitated'
  | 'peak_debilitated';

// ── House & Ayanamsa Systems ─────────────────────────────────────────────────

export type HouseSystemType = 'whole_sign' | 'equal' | 'placidus';

export type AyanamsaType = 'lahiri' | 'kp';

// ── Birth Data ───────────────────────────────────────────────────────────────

export interface BirthData {
  date: string;          // "2000-01-01"
  time: string;          // "04:30"
  latitude: number;
  longitude: number;
  timezone: string;      // "Asia/Kolkata"
  name?: string;         // optional person name
}

// ── Graha Position ───────────────────────────────────────────────────────────

export interface GrahaPosition {
  name: GrahaName;
  longitude: number;         // sidereal longitude 0-360
  latitude: number;
  speed: number;             // degrees/day (negative = retrograde)
  retrograde: boolean;
  signName: string;          // "Aries", "Taurus", etc.
  signNumber: number;        // 1-12
  degreeInSign: number;      // 0-30
  nakshatra: string;
  nakshatraNumber: number;
  nakshatraPada: number;
  nakshatraLord: string;
  dignity: Dignity;
  isCombust: boolean;
  combustOrb: number;        // degrees from Sun
  symbol: string;            // dignity emoji/symbol
}

// ── House Info ────────────────────────────────────────────────────────────────

export interface HouseInfo {
  number: number;           // 1-12
  signName: string;
  signNumber: number;       // 1-12
  cuspDegree: number;       // cusp longitude (sidereal)
  planets: GrahaName[];     // planets occupying this house
}

// ── Chart Layout (for rendering) ─────────────────────────────────────────────

export interface ChartBox {
  houseNumber: number;
  signNumber: number;
  signName: string;
  planets: GrahaName[];
}

export interface ChartLayout {
  style: 'north_indian' | 'south_indian' | 'western';
  boxes: ChartBox[];       // 12 boxes
}

// ── Lagna (Ascendant) ────────────────────────────────────────────────────────

export interface LagnaInfo {
  longitude: number;        // sidereal ascendant degree
  signName: string;
  signNumber: number;       // 1-12
  degreeInSign: number;
  nakshatra: string;
  nakshatraNumber: number;
  nakshatraPada: number;
  nakshatraLord: string;
}

// ── Birth Chart Result ───────────────────────────────────────────────────────

export interface BirthChartResult {
  birthData: BirthData;
  ayanamsa: {
    type: AyanamsaType;
    degree: number;
  };
  lagna: LagnaInfo;
  planets: GrahaPosition[];
  houses: HouseInfo[];
  layout: {
    northIndian: ChartLayout;
    southIndian: ChartLayout;
    western: ChartLayout;
  };
  meta: {
    calculatedAt: string;    // ISO date string
    houseSystem: HouseSystemType;
    julianDay: number;
    utcDate: string;         // the UTC moment used
  };
}
