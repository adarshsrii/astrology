import PanchangCalculator from '../index';
import { PanchangOutput } from '../index';

/**
 * Quick function to get comprehensive Panchang output for a given date and location.
 * @param date Date for calculation - must be the exact input date/time.
 * @param latitude Latitude in degrees.
 * @param longitude Longitude in degrees.
 * @param timezone Timezone identifier.
 * @returns Panchang output.
 */
export function getPanchang(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string
): PanchangOutput {
  const calculator = new PanchangCalculator();
  try {
    // CRITICAL: Pass the exact date without any modifications
    return calculator.calculatePanchang({
      date: date,
      location: { latitude, longitude, timezone }
    });
  } finally {
    calculator.cleanup();
  }
}
