/**
 * Transit (Gochar) Module — Daily Horoscope Engine
 *
 * Provides Vedic daily horoscope calculations based on:
 * - Classical Gochar (transit) rules from Phaladeepika
 * - Vedha (obstruction) system
 * - Planet-in-house interpretations in English and Hindi
 * - Life area predictions (career, finance, health, relationships, spiritual)
 *
 * Usage:
 *   import { calculateDailyHoroscope, getDailyHoroscope } from './transit';
 *
 *   // Simple: just date + moon sign number
 *   const horoscope = getDailyHoroscope(new Date(), 1); // Aries Moon
 *
 *   // Full control
 *   const horoscope = calculateDailyHoroscope({
 *     date: new Date(),
 *     moonSignNumber: 4, // Cancer Moon
 *   });
 */

export { calculateDailyHoroscope } from './gochar';
export type { GocharInput } from './gochar';

export type {
  DailyHoroscope,
  PlanetTransit,
  LifeAreaPrediction,
  TransitInterpretation,
  TransitEffect,
  LifeArea,
  TransitRule,
} from './types';

export {
  TRANSIT_RULES,
  TRANSIT_INTERPRETATIONS,
  PLANET_WEIGHTS,
  RASHI_NAMES,
} from './constants';

// ── Convenience wrapper ─────────────────────────────────────────────────────

import { calculateDailyHoroscope as _calc } from './gochar';
import type { DailyHoroscope } from './types';

/**
 * Quick daily horoscope — just pass date and moon sign number.
 *
 * @param date - Date for horoscope
 * @param moonSignNumber - 1=Aries, 2=Taurus, ..., 12=Pisces
 * @returns Complete daily horoscope
 */
export function getDailyHoroscope(date: Date, moonSignNumber: number): DailyHoroscope {
  return _calc({ date, moonSignNumber });
}
