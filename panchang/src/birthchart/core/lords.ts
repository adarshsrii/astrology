/**
 * Rashi (sign) lordship — THE single source of truth.
 *
 * This table used to live privately in two places that could drift apart:
 * SIGN_LORD in analysis/yogas.ts and RASHI_LORD in analysis/ashtakoot.ts.
 * Both now import from here; do not re-declare it anywhere else.
 */

import { Dignity, GrahaName, GrahaPosition, HouseInfo } from '../types';
import { SIGN_NAMES } from './constants';
import { assignPlanetsToHouses } from './houses';

/** Sign number (1 = Aries) → ruling graha. */
export const SIGN_LORDS: Record<number, GrahaName> = {
  1: 'Mars',    // Aries
  2: 'Venus',   // Taurus
  3: 'Mercury', // Gemini
  4: 'Moon',    // Cancer
  5: 'Sun',     // Leo
  6: 'Mercury', // Virgo
  7: 'Venus',   // Libra
  8: 'Mars',    // Scorpio
  9: 'Jupiter', // Sagittarius
  10: 'Saturn', // Capricorn
  11: 'Saturn', // Aquarius
  12: 'Jupiter',// Pisces
};

/**
 * Lord of a sign. Accepts any integer and wraps it to 1-12, so callers doing
 * their own "+6 signs from here" arithmetic cannot hand us a 13 and get undefined.
 *
 * ponytail: classical (Parashari) lordship only — Rahu/Ketu are co-lords of
 * Aquarius/Scorpio in some schools and that is a content decision, not a fix.
 */
export function getSignLord(signNumber: number): GrahaName {
  return SIGN_LORDS[(((signNumber - 1) % 12) + 12) % 12 + 1];
}

// ── Per-house lordship ───────────────────────────────────────────────────────

export interface HouseLordInfo {
  house: number;               // 1-12
  signName: string;            // sign on the house
  signNumber: number;          // 1-12
  lord: GrahaName;             // lord of that sign
  /** Where the lord actually sits. null only if the lord is absent from `planets`. */
  lordHouse: number | null;
  lordSignName: string | null;
  lordSignNumber: number | null;
  lordDegreeInSign: number | null;
  lordDignity: Dignity | null;
  lordRetrograde: boolean | null;
  lordCombust: boolean | null;
}

/**
 * For each of the 12 houses: its sign, its lord, and where that lord is placed
 * (house, sign, degree, dignity, retrograde, combust).
 *
 * This is the backbone of house-by-house prediction: "the 10th lord sits in the
 * 6th, debilitated and combust" is the sentence every kundli report is built on.
 *
 * @param houses  the 12 houses from calculateHouses()
 * @param planets the 9 grahas from calculateAllPlanets()
 */
export function getHouseLords(
  houses: HouseInfo[],
  planets: GrahaPosition[],
): HouseLordInfo[] {
  const lagna = houses.find(h => h.number === 1);
  const lagnaSignNumber = lagna ? lagna.signNumber : 1;
  // ponytail: reuse the one whole-sign placement routine rather than repeating
  // its modulo here — a second copy is exactly how SIGN_LORD got duplicated.
  const placement = assignPlanetsToHouses(planets, lagnaSignNumber, 'whole_sign');

  return houses.map(h => {
    const lord = getSignLord(h.signNumber);
    const p = planets.find(x => x.name === lord);
    return {
      house: h.number,
      signName: h.signName,
      signNumber: h.signNumber,
      lord,
      lordHouse: p ? placement[p.name] : null,
      lordSignName: p ? p.signName : null,
      lordSignNumber: p ? p.signNumber : null,
      lordDegreeInSign: p ? p.degreeInSign : null,
      lordDignity: p ? p.dignity : null,
      lordRetrograde: p ? p.retrograde : null,
      lordCombust: p ? p.isCombust : null,
    };
  });
}

/** Sign name for a sign number, wrapping 1-12 (convenience for report code). */
export function getSignName(signNumber: number): string {
  return SIGN_NAMES[(((signNumber - 1) % 12) + 12) % 12 + 1] || 'Unknown';
}
