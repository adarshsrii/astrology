import { calculateFullPanchang } from './panchang-v2';
import { MonthlyPanchangResult, DailySummary, PanchangResult } from './types';

/**
 * Calculate Panchang for every day of a given month.
 *
 * @param year   Gregorian year  (e.g. 2026)
 * @param month  Gregorian month (1-12)
 * @param latitude   Location latitude in degrees
 * @param longitude  Location longitude in degrees
 * @param timezone   IANA timezone string (e.g. "Asia/Kolkata")
 * @returns MonthlyPanchangResult with a DailySummary for each day
 */
export function calculateMonthlyPanchang(
  year: number,
  month: number,
  latitude: number,
  longitude: number,
  timezone: string,
): MonthlyPanchangResult {
  // Number of days in this month (day 0 of next month = last day of this month)
  const daysInMonth = new Date(year, month, 0).getDate();

  const days: DailySummary[] = [];
  let prevSunSign: string | null = null;

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const panchang: PanchangResult = calculateFullPanchang(dateStr, latitude, longitude, timezone);

    const tithi = panchang.tithi[0];
    const nakshatra = panchang.nakshatra[0];
    const yoga = panchang.yoga[0];
    const karana = panchang.karana[0];

    // Derive tithi number within paksha (1-15)
    const tithiNumber = tithi.number;
    const paksha = panchang.paksha;

    // Detect special days
    const specialDays: string[] = [];

    const isPurnima = tithi.name === 'Purnima';
    const isAmavasya = tithi.name === 'Amavasya';
    const isEkadashi = tithiNumber === 11;

    if (isPurnima) specialDays.push('Purnima');
    if (isAmavasya) specialDays.push('Amavasya');
    if (isEkadashi) specialDays.push('Ekadashi');
    if (tithiNumber === 13) specialDays.push('Pradosh');
    if (tithiNumber === 4) specialDays.push('Chaturthi');
    if (tithiNumber === 14 && paksha === 'Krishna') specialDays.push('Shivaratri');

    // Sankranti: sun sign changed from previous day
    const currentSunSign = panchang.sunSign.name;
    if (prevSunSign !== null && currentSunSign !== prevSunSign) {
      specialDays.push('Sankranti');
    }
    prevSunSign = currentSunSign;

    const weekday = new Date(year, month - 1, day).toLocaleDateString('en-US', { weekday: 'long' });

    // Format sunrise/sunset to 12-hour AM/PM style
    const sunrise12 = convertTo12Hour(panchang.sunrise);
    const sunset12 = convertTo12Hour(panchang.sunset);

    days.push({
      date: dateStr,
      weekday,
      sunrise: sunrise12,
      sunset: sunset12,
      tithi: {
        name: tithi.name,
        paksha,
        progress: tithi.progress,
      },
      nakshatra: {
        name: nakshatra.name,
        pada: nakshatra.pada,
        lord: nakshatra.lord,
      },
      yoga: { name: yoga.name },
      karana: { name: karana.name },
      moonSign: panchang.moonSign.name,
      sunSign: currentSunSign,
      moonPhase: panchang.moonPhase.name,
      moonIllumination: panchang.moonPhase.illumination,
      specialDays,
      isPurnima,
      isAmavasya,
      isEkadashi,
    });
  }

  return {
    year,
    month,
    location: { lat: latitude, lon: longitude, timezone },
    days,
  };
}

/**
 * Convert 24-hour "HH:MM" string to "H:MM AM/PM" format.
 * Returns the original string if it doesn't match expected format.
 */
function convertTo12Hour(time: string): string {
  if (!time) return time;
  const match = time.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return time;
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const ampm = hour >= 12 ? 'PM' : 'AM';
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${hour}:${minute} ${ampm}`;
}
