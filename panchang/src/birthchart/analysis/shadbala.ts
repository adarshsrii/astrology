/**
 * Shad Bala — Six-fold Planetary Strength
 *
 * Measures a planet's ability to deliver results through 6 components:
 * 1. Sthana Bala  (Positional strength)
 * 2. Dig Bala     (Directional strength)
 * 3. Kala Bala    (Temporal strength)
 * 4. Chesta Bala  (Motional strength)
 * 5. Naisargika Bala (Natural strength — fixed)
 * 6. Drik Bala    (Aspectual strength)
 *
 * Simplification note:
 * Full Shad Bala calculation requires very precise astronomical data.
 * This implementation uses simplified but correct formulas that give
 * directionally accurate results. For professional-grade accuracy,
 * Swiss Ephemeris planetary speeds and house cusps should be used.
 */

import { EXALTATION_TABLE } from '../core/constants';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ShadBalaResult {
  planet: string;
  sthana: number;      // Positional strength (0-100)
  dig: number;         // Directional strength (0-60)
  kala: number;        // Temporal strength (0-100)
  chesta: number;      // Motional strength (0-60)
  naisargika: number;  // Natural strength (fixed)
  drik: number;        // Aspectual strength (0-60)
  total: number;       // Sum of all
  required: number;    // Minimum required for effectiveness
  ratio: number;       // total / required (>1 = strong)
  isStrong: boolean;   // ratio >= 1
}

export interface ShadBalaPlanetInput {
  name: string;
  signNumber: number;
  degreeInSign: number;
  house: number;
  retrograde: boolean;
  speed: number;
  dignity: string;
}

// ── Naisargika Bala (Natural Strength — fixed values) ────────────────────────

const NAISARGIKA_BALA: Record<string, number> = {
  Sun:     60,
  Moon:    51.43,
  Mars:    17.14,
  Mercury: 25.71,
  Jupiter: 34.29,
  Venus:   42.86,
  Saturn:  8.57,
  Rahu:    8,
  Ketu:    8,
};

// ── Required minimums (Ishta Phala thresholds) ──────────────────────────────

const REQUIRED_STRENGTH: Record<string, number> = {
  Sun:     390,
  Moon:    360,
  Mars:    300,
  Mercury: 420,
  Jupiter: 390,
  Venus:   330,
  Saturn:  300,
  Rahu:    250,
  Ketu:    250,
};

// ── Dig Bala: strongest house for each planet ────────────────────────────────

const DIG_BALA_STRONGEST_HOUSE: Record<string, number> = {
  Jupiter: 1,
  Mercury: 1,
  Sun:     10,
  Mars:    10,
  Saturn:  7,
  Moon:    4,
  Venus:   4,
  Rahu:    10,   // approximate
  Ketu:    4,    // approximate
};

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Minimum distance between two house numbers on a 1-12 wheel. */
function houseDistance(from: number, to: number): number {
  const diff = Math.abs(from - to);
  return Math.min(diff, 12 - diff);
}

/** Convert absolute longitude from sign+degree to 0-360. */
function absoluteLongitude(signNumber: number, degreeInSign: number): number {
  return (signNumber - 1) * 30 + degreeInSign;
}

// ── 1. Sthana Bala (Positional Strength) ────────────────────────────────────

function calcUchchaBala(name: string, signNumber: number, degreeInSign: number): number {
  const exalt = EXALTATION_TABLE[name as keyof typeof EXALTATION_TABLE];
  if (!exalt) return 0;

  const planetLon = absoluteLongitude(signNumber, degreeInSign);
  const exaltLon = (exalt.sign - 1) * 30 + exalt.peakDegree;

  let distance = Math.abs(planetLon - exaltLon);
  if (distance > 180) distance = 360 - distance;

  return 60 * (1 - distance / 180);
}

function calcSaptavargajaBala(dignity: string): number {
  switch (dignity) {
    case 'own_sign':          return 30;
    case 'peak_exalted':
    case 'exalted':           return 25;
    case 'moolatrikona':      return 20;
    // friendly is not a current Dignity enum value, but for future extensibility
    case 'friendly':          return 15;
    case 'neutral':           return 10;
    case 'enemy':             return 5;
    case 'peak_debilitated':
    case 'debilitated':       return 0;
    default:                  return 10;
  }
}

function calcOjayugmarasiBala(name: string, signNumber: number): number {
  const isOddSign = signNumber % 2 === 1;
  const malePlanets = ['Sun', 'Mars', 'Jupiter'];
  const femalePlanets = ['Moon', 'Venus'];

  if (name === 'Mercury') return 7.5;
  if (malePlanets.includes(name) && isOddSign) return 15;
  if (femalePlanets.includes(name) && !isOddSign) return 15;
  return 0;
}

function calcKendradiBala(house: number): number {
  const angular = [1, 4, 7, 10];
  const succedent = [2, 5, 8, 11];
  // cadent = [3, 6, 9, 12]

  if (angular.includes(house)) return 60;
  if (succedent.includes(house)) return 30;
  return 15;
}

function calcDrekkanaBala(name: string, degreeInSign: number): number {
  const malePlanets = ['Sun', 'Mars', 'Jupiter'];
  const femalePlanets = ['Moon', 'Venus'];

  const drekkana = degreeInSign < 10 ? 1 : degreeInSign < 20 ? 2 : 3;

  if (malePlanets.includes(name) && drekkana === 1) return 15;
  if (femalePlanets.includes(name) && drekkana === 2) return 15;
  if (name === 'Mercury' && drekkana === 3) return 15;
  // Saturn — traditionally neutral/male, assign 1st drekkana
  if (name === 'Saturn' && drekkana === 1) return 15;
  // Rahu/Ketu — approximate as neutral
  if ((name === 'Rahu' || name === 'Ketu') && drekkana === 3) return 15;
  return 0;
}

/**
 * Sthana Bala — sum of 5 sub-components, normalized to 0-100.
 * Raw max is approximately 60+30+15+60+15 = 180.
 */
function calcSthanaBala(
  name: string,
  signNumber: number,
  degreeInSign: number,
  house: number,
  dignity: string,
): number {
  const uchcha = calcUchchaBala(name, signNumber, degreeInSign);
  const saptavargaja = calcSaptavargajaBala(dignity);
  const ojayugma = calcOjayugmarasiBala(name, signNumber);
  const kendradi = calcKendradiBala(house);
  const drekkana = calcDrekkanaBala(name, degreeInSign);

  const raw = uchcha + saptavargaja + ojayugma + kendradi + drekkana;
  const maxRaw = 180; // theoretical max
  return Math.round((raw / maxRaw) * 100 * 100) / 100;
}

// ── 2. Dig Bala (Directional Strength) ──────────────────────────────────────

function calcDigBala(name: string, house: number): number {
  const strongestHouse = DIG_BALA_STRONGEST_HOUSE[name];
  if (strongestHouse === undefined) return 0;

  const dist = houseDistance(house, strongestHouse);
  // Max distance on a 12-house wheel is 6
  return Math.round(60 * (1 - dist / 6) * 100) / 100;
}

// ── 3. Kala Bala (Temporal Strength) — simplified ───────────────────────────

function calcKalaBala(name: string, birthHour?: number): number {
  // Default to day-born if no hour provided
  const hour = birthHour ?? 12;
  const isDayBorn = hour >= 6 && hour < 18;

  const dayPlanets = ['Sun', 'Jupiter', 'Venus'];
  const nightPlanets = ['Moon', 'Mars', 'Saturn'];

  if (name === 'Mercury') return 30; // neutral
  if (name === 'Rahu') return isDayBorn ? 20 : 40;
  if (name === 'Ketu') return isDayBorn ? 40 : 20;

  if (isDayBorn && dayPlanets.includes(name)) return 60;
  if (!isDayBorn && nightPlanets.includes(name)) return 60;

  // Opposite time — reduced strength
  if (isDayBorn && nightPlanets.includes(name)) return 10;
  if (!isDayBorn && dayPlanets.includes(name)) return 10;

  return 30;
}

// ── 4. Chesta Bala (Motional Strength) ──────────────────────────────────────

function calcChestaBala(name: string, retrograde: boolean, speed: number): number {
  // Sun and Moon never retrograde — fixed value
  if (name === 'Sun' || name === 'Moon') return 30;
  // Rahu/Ketu are always retrograde technically — fixed
  if (name === 'Rahu' || name === 'Ketu') return 30;

  if (retrograde) return 60;

  // Speed-based scoring for direct-motion planets
  const absSpeed = Math.abs(speed);
  if (absSpeed > 1.0) return 45;   // fast
  if (absSpeed > 0.3) return 30;   // average
  return 15;                        // slow
}

// ── 5. Naisargika Bala ──────────────────────────────────────────────────────

function calcNaisargikaBala(name: string): number {
  return NAISARGIKA_BALA[name] ?? 0;
}

// ── 6. Drik Bala (Aspectual Strength) — simplified ──────────────────────────

const BENEFICS = ['Jupiter', 'Venus', 'Mercury'];
const MALEFICS = ['Saturn', 'Mars', 'Sun', 'Rahu', 'Ketu'];
// Moon is benefic when waxing — simplified: treat as mildly benefic

function calcDrikBala(
  name: string,
  house: number,
  allPlanets: ShadBalaPlanetInput[],
): number {
  let score = 30; // start at midpoint

  for (const other of allPlanets) {
    if (other.name === name) continue;

    // Check if other planet aspects this planet's house.
    // Simplified: all planets aspect the 7th house from their position.
    // Special aspects: Mars (4,8), Jupiter (5,9), Saturn (3,10).
    const aspectedHouses = getAspectedHouses(other.name, other.house);

    if (aspectedHouses.includes(house)) {
      if (BENEFICS.includes(other.name)) {
        score += 10;
      } else if (MALEFICS.includes(other.name)) {
        score -= 10;
      } else if (other.name === 'Moon') {
        // Moon — mildly benefic
        score += 5;
      }
    }
  }

  return Math.max(0, Math.min(60, Math.round(score * 100) / 100));
}

/** Return the house numbers (1-12) that a planet aspects from its house. */
function getAspectedHouses(planetName: string, fromHouse: number): number[] {
  const houses: number[] = [];

  // All planets aspect 7th from their position
  houses.push(wrapHouse(fromHouse + 6));

  switch (planetName) {
    case 'Mars':
      houses.push(wrapHouse(fromHouse + 3));  // 4th aspect
      houses.push(wrapHouse(fromHouse + 7));  // 8th aspect
      break;
    case 'Jupiter':
      houses.push(wrapHouse(fromHouse + 4));  // 5th aspect
      houses.push(wrapHouse(fromHouse + 8));  // 9th aspect
      break;
    case 'Saturn':
      houses.push(wrapHouse(fromHouse + 2));  // 3rd aspect
      houses.push(wrapHouse(fromHouse + 9));  // 10th aspect
      break;
    case 'Rahu':
      houses.push(wrapHouse(fromHouse + 4));  // 5th aspect
      houses.push(wrapHouse(fromHouse + 8));  // 9th aspect
      break;
    case 'Ketu':
      houses.push(wrapHouse(fromHouse + 4));  // 5th aspect
      houses.push(wrapHouse(fromHouse + 8));  // 9th aspect
      break;
  }

  return houses;
}

/** Wrap house number to 1-12 range. */
function wrapHouse(h: number): number {
  return ((h - 1) % 12 + 12) % 12 + 1;
}

// ── Main Calculation ────────────────────────────────────────────────────────

/**
 * Calculate Shad Bala (six-fold planetary strength) for all planets.
 *
 * @param planets - Array of planet positions with house, dignity, speed info
 * @param lagnaSignNumber - Sign number (1-12) of the ascendant
 * @param birthHour - Hour of birth (0-23) for Kala Bala; defaults to 12 (day)
 */
export function calculateShadBala(
  planets: ShadBalaPlanetInput[],
  lagnaSignNumber: number,
  birthHour?: number,
): ShadBalaResult[] {
  return planets.map((p) => {
    const sthana = calcSthanaBala(p.name, p.signNumber, p.degreeInSign, p.house, p.dignity);
    const dig = calcDigBala(p.name, p.house);
    const kala = calcKalaBala(p.name, birthHour);
    const chesta = calcChestaBala(p.name, p.retrograde, p.speed);
    const naisargika = calcNaisargikaBala(p.name);
    const drik = calcDrikBala(p.name, p.house, planets);

    const total = Math.round((sthana + dig + kala + chesta + naisargika + drik) * 100) / 100;
    const required = REQUIRED_STRENGTH[p.name] ?? 300;
    const ratio = Math.round((total / required) * 100) / 100;

    return {
      planet: p.name,
      sthana,
      dig,
      kala,
      chesta,
      naisargika,
      drik,
      total,
      required,
      ratio,
      isStrong: ratio >= 1,
    };
  });
}
