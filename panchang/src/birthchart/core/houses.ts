/**
 * House Calculation
 * Assign signs to houses and planets to houses.
 */

import { GrahaName, GrahaPosition, HouseInfo, HouseSystemType } from '../types';
import { SIGN_NAMES } from './constants';

/**
 * Calculate the 12 houses given the lagna sign and house system.
 *
 * @param lagnaSignNumber - The sign number of the ascendant (1-12)
 * @param houseSystem - House system type
 * @param cusps - Optional sidereal cusp longitudes (index 1-12)
 * @returns Array of 12 HouseInfo
 */
export function calculateHouses(
  lagnaSignNumber: number,
  houseSystem: HouseSystemType,
  cusps?: number[],
): HouseInfo[] {
  const houses: HouseInfo[] = [];

  for (let h = 1; h <= 12; h++) {
    // Whole sign: house N has sign = (lagnaSign - 1 + N - 1) % 12 + 1
    const signNumber = ((lagnaSignNumber - 1 + h - 1) % 12) + 1;
    const cuspDegree = cusps && cusps[h] !== undefined ? cusps[h] : (signNumber - 1) * 30;

    houses.push({
      number: h,
      signName: SIGN_NAMES[signNumber] || 'Unknown',
      signNumber,
      cuspDegree: Math.round(cuspDegree * 100) / 100,
      planets: [],
    });
  }

  return houses;
}

/**
 * Assign planets to houses based on their sign positions.
 * For whole-sign: house = (planetSign - lagnaSign + 12) % 12 + 1
 *
 * @returns Record mapping planet name to house number (1-12)
 */
export function assignPlanetsToHouses(
  planets: GrahaPosition[],
  lagnaSignNumber: number,
  houseSystem: HouseSystemType,
): Record<string, number> {
  const assignment: Record<string, number> = {};

  for (const planet of planets) {
    if (houseSystem === 'whole_sign' || houseSystem === 'equal') {
      // Whole-sign logic: planet's sign determines the house
      const houseNum = ((planet.signNumber - lagnaSignNumber + 12) % 12) + 1;
      assignment[planet.name] = houseNum;
    } else {
      // Placidus: determine house by cusp ranges (simplified — use whole-sign fallback)
      const houseNum = ((planet.signNumber - lagnaSignNumber + 12) % 12) + 1;
      assignment[planet.name] = houseNum;
    }
  }

  return assignment;
}

/**
 * Populate the houses' planet arrays using the assignment map.
 */
export function populateHousePlanets(
  houses: HouseInfo[],
  planets: GrahaPosition[],
  assignment: Record<string, number>,
): HouseInfo[] {
  // Clear existing planet arrays
  for (const h of houses) {
    h.planets = [];
  }

  for (const planet of planets) {
    const houseNum = assignment[planet.name];
    if (houseNum >= 1 && houseNum <= 12) {
      const house = houses.find(h => h.number === houseNum);
      if (house) {
        house.planets.push(planet.name as GrahaName);
      }
    }
  }

  return houses;
}

// ── Sudarshana Chakra ────────────────────────────────────────────────────────

export interface SudarshanaView {
  reference: 'lagna' | 'moon' | 'sun';
  referenceSignNumber: number;
  referenceSignName: string;
  houses: HouseInfo[];          // the same 12 planets, counted from this reference
}

export interface SudarshanaChakra {
  lagna: SudarshanaView;
  moon: SudarshanaView;
  sun: SudarshanaView;
}

/**
 * Sudarshana Chakra — the same chart read three times: from the Lagna, from the
 * Moon's sign (Chandra lagna) and from the Sun's sign (Surya lagna). A result
 * confirmed in all three readings is the classical test of a strong promise.
 *
 * ponytail: whole-sign only, and no interpretation — this returns the three
 * house sets and stops. Reading them is the report's job.
 */
export function calculateSudarshanaChakra(
  planets: GrahaPosition[],
  lagnaSignNumber: number,
): SudarshanaChakra {
  // ponytail: Moon/Sun come out of the same planets array the caller already has,
  // so there is nothing extra to pass in. Falling back to the lagna sign keeps a
  // partial planet list from throwing; a real chart always carries both.
  const signOf = (name: GrahaName): number =>
    planets.find(p => p.name === name)?.signNumber ?? lagnaSignNumber;

  const view = (
    reference: SudarshanaView['reference'],
    referenceSignNumber: number,
  ): SudarshanaView => {
    const houses = calculateHouses(referenceSignNumber, 'whole_sign');
    const assignment = assignPlanetsToHouses(planets, referenceSignNumber, 'whole_sign');
    return {
      reference,
      referenceSignNumber,
      referenceSignName: SIGN_NAMES[referenceSignNumber] || 'Unknown',
      houses: populateHousePlanets(houses, planets, assignment),
    };
  };

  return {
    lagna: view('lagna', lagnaSignNumber),
    moon: view('moon', signOf('Moon')),
    sun: view('sun', signOf('Sun')),
  };
}
