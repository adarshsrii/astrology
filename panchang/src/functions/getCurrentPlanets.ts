import { Ephemeris } from '../calculations/ephemeris';

/**
 * Get current planetary positions with Nakshatra and Rashi information.
 * @param date Date for calculation (defaults to current date).
 * @param ayanamsaId Ayanamsa system to use (defaults to 1 - Lahiri).
 * @returns Array of planetary positions with astrological information.
 */
export function getCurrentPlanets(
  date: Date = new Date(),
  ayanamsaId: number = 1
) {
  const ephemeris = new Ephemeris();
  try {
    return ephemeris.getCurrentPlanets(date, ayanamsaId);
  } finally {
    ephemeris.cleanup();
  }
}
