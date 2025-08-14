import PanchangCalculator from '../index';
import { formatTimeInTimezone, formatTimeRangeInTimezone } from '../utils/index';
import { Location, FormattedDateInfo, getFormattedDateInfo } from '../index';

/**
 * Quick function to get a formatted Panchang report.
 * @param date Date for calculation - must be the exact input date/time.
 * @param latitude Latitude in degrees.
 * @param longitude Longitude in degrees.
 * @param timezone Timezone identifier.
 * @param locationName Optional location name for display.
 * @param useLocalTimezone Whether to display times in local timezone (default: false uses UTC).
 * @returns Formatted text report.
 */
export function getPanchangReport(
  date: Date,
  latitude: number,
  longitude: number,
  timezone: string,
  locationName?: string,
  useLocalTimezone: boolean = false
): string {
  const calculator = new PanchangCalculator();
  try {
    return calculator.generatePanchangReport(
      {
        date: date,
        location: { latitude, longitude, timezone, name: locationName }
      },
      useLocalTimezone
    );
  } finally {
    calculator.cleanup();
  }
}
