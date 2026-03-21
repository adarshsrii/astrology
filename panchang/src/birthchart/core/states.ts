/**
 * Planetary Dignity & Combustion
 * Determines the state of a graha based on its position.
 */

import { GrahaName, Dignity } from '../types';
import {
  EXALTATION_TABLE,
  DEBILITATION_TABLE,
  OWN_SIGNS,
  MOOLATRIKONA_TABLE,
  COMBUSTION_ORBS,
  NEVER_COMBUST,
  DIGNITY_SYMBOLS,
} from './constants';

// ── Dignity ──────────────────────────────────────────────────────────────────

/**
 * Determine the dignity (state) of a planet in a given sign and degree.
 * Priority order: peak_exalted > peak_debilitated > exalted > debilitated > moolatrikona > own_sign > neutral
 */
export function determineDignity(
  planet: GrahaName,
  signNumber: number,
  degreeInSign: number,
): Dignity {
  const exalt = EXALTATION_TABLE[planet];
  const debi = DEBILITATION_TABLE[planet];
  const moola = MOOLATRIKONA_TABLE[planet];
  const ownSigns = OWN_SIGNS[planet];

  // Peak exaltation: exact sign + within 1° of peak degree
  if (signNumber === exalt.sign && Math.abs(degreeInSign - exalt.peakDegree) < 1) {
    return 'peak_exalted';
  }

  // Peak debilitation: exact sign + within 1° of peak degree
  if (signNumber === debi.sign && Math.abs(degreeInSign - debi.peakDegree) < 1) {
    return 'peak_debilitated';
  }

  // Exalted: anywhere in the exaltation sign
  if (signNumber === exalt.sign) {
    return 'exalted';
  }

  // Debilitated: anywhere in the debilitation sign
  if (signNumber === debi.sign) {
    return 'debilitated';
  }

  // Moolatrikona: in the moolatrikona sign and within the degree range
  if (
    signNumber === moola.sign &&
    degreeInSign >= moola.fromDegree &&
    degreeInSign <= moola.toDegree
  ) {
    return 'moolatrikona';
  }

  // Own sign
  if (ownSigns.includes(signNumber)) {
    return 'own_sign';
  }

  return 'neutral';
}

/**
 * Get the display symbol for a dignity state.
 */
export function getDignitySymbol(dignity: Dignity): string {
  return DIGNITY_SYMBOLS[dignity] || '';
}

// ── Combustion ───────────────────────────────────────────────────────────────

export interface CombustionResult {
  isCombust: boolean;
  orb: number; // angular distance from Sun in degrees
}

/**
 * Determine if a planet is combust (too close to the Sun).
 * Sun, Rahu, and Ketu are never combust.
 *
 * @param planet - The graha name
 * @param planetLon - Sidereal longitude of the planet (0-360)
 * @param sunLon - Sidereal longitude of the Sun (0-360)
 * @param isRetrograde - Whether the planet is retrograde
 */
export function determineCombustion(
  planet: GrahaName,
  planetLon: number,
  sunLon: number,
  isRetrograde: boolean,
): CombustionResult {
  // Sun, Rahu, Ketu are never combust
  if (NEVER_COMBUST.includes(planet)) {
    return { isCombust: false, orb: 0 };
  }

  const orbEntry = COMBUSTION_ORBS[planet];
  if (!orbEntry) {
    return { isCombust: false, orb: 0 };
  }

  // Calculate angular distance (shortest arc)
  let diff = Math.abs(planetLon - sunLon);
  if (diff > 180) {
    diff = 360 - diff;
  }

  const threshold = isRetrograde ? orbEntry.retrograde : orbEntry.direct;
  return {
    isCombust: diff <= threshold,
    orb: Math.round(diff * 100) / 100,
  };
}
