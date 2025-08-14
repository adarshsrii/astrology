import { Ephemeris } from '../calculations/ephemeris';

/**
 * Quick function to get all ayanamsa systems with their degrees for a given date.
 * @param date Date for ayanamsa calculation (defaults to current date).
 * @returns Array of ayanamsa information including name, ID, degree, and description.
 */
export function getAyanamsa(date: Date = new Date()) {
  const ephemeris = new Ephemeris();
  try {
    return ephemeris.getAyanamsa(date);
  } finally {
    ephemeris.cleanup();
  }
}
