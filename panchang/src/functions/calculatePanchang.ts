import { getPanchang, PanchangOutput, Location } from '../index';

/**
 * Convenience function - alias for getPanchang.
 * Calculate comprehensive Panchang for a given date, location, and timezone.
 * @param date Date for calculation.
 * @param location Location object with latitude and longitude, or individual parameters.
 * @param longitudeOrTimezone Longitude in degrees or timezone string.
 * @param timezone Target timezone (defaults to 'UTC').
 * @param locationName Optional location name for display.
 * @param lang Language code (defaults to 'en').
 * @returns Complete Panchang output with timezone-aware formatting.
 */
export function calculatePanchang(
  date: Date,
  location: Location | number,
  longitudeOrTimezone?: number | string,
  timezone?: string,
  locationName?: string,
  lang: 'en' | 'hi' = 'en'
): PanchangOutput {
  if (typeof location === 'number') {
    const latitude = location;
    const longitude = longitudeOrTimezone as number;
    const tz = timezone || 'UTC';
    return getPanchang(date, latitude, longitude, tz);
  } else {
    const tz = (longitudeOrTimezone as string) || timezone || 'UTC';
    return getPanchang(date, location.latitude, location.longitude, tz);
  }
}
