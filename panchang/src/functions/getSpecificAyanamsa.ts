import { Ephemeris } from '../calculations/ephemeris';

/**
 * Quick function to get a specific ayanamsa value by name or ID.
 * @param ayanamsaId Ayanamsa ID (number) or name (string).
 * @param date Date for calculation (defaults to current date).
 * @returns Ayanamsa information or null if not found.
 */
export function getSpecificAyanamsa(
  ayanamsaId: number | string,
  date: Date = new Date()
) {
  const ephemeris = new Ephemeris();
  try {
    return ephemeris.getSpecificAyanamsa(date, ayanamsaId);
  } finally {
    ephemeris.cleanup();
  }
}
