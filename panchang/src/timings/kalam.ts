/**
 * Kalam (inauspicious timing) calculations for Panchang v2.
 * Wraps existing lib/ functions with typed interfaces.
 */

export interface KalamEntry {
  name: string;
  startTime: string; // HH:mm
  endTime: string;
  description: string;
}

/**
 * Strip seconds from "HH:mm:ss" -> "HH:mm", or return as-is if already "HH:mm".
 */
function toHHMM(time: string): string {
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
}

/**
 * Parse ISO timestamp or "HH:mm:ss" to "HH:mm".
 */
function normalizeTime(time: string): string {
  // Handle ISO format like "2026-03-20T06:10:00.000+05:30"
  if (time.includes('T')) {
    const timePart = time.split('T')[1];
    const parts = timePart.split(':');
    return `${parts[0]}:${parts[1]}`;
  }
  return toHHMM(time);
}

/**
 * Calculate all inauspicious kalams for a given date.
 *
 * @param sunrise - "HH:mm" format
 * @param sunset  - "HH:mm" format
 * @param date    - "yyyy-MM-dd" format
 * @param lat     - latitude
 * @param lon     - longitude
 * @param tz      - IANA timezone
 */
export function calculateKalams(
  sunrise: string,
  sunset: string,
  date: string,
  lat: number,
  lon: number,
  tz: string,
): KalamEntry[] {
  const kalams: KalamEntry[] = [];

  // Ensure sunrise/sunset have seconds for lib functions that expect "HH:mm:ss"
  const sunriseWithSec = sunrise.length === 5 ? sunrise + ':00' : sunrise;
  const sunsetWithSec = sunset.length === 5 ? sunset + ':00' : sunset;

  // 1. Rahu Kalam
  try {
    const calculateRahuKalam = require('../../../lib/rahuKalam');
    const rahu = calculateRahuKalam(date, sunriseWithSec, sunsetWithSec, tz);
    kalams.push({
      name: 'Rahu Kalam',
      startTime: toHHMM(rahu.start),
      endTime: toHHMM(rahu.end),
      description: 'Inauspicious period ruled by Rahu; avoid new ventures & travel',
    });
  } catch {
    // Skip if lib unavailable
  }

  // 2. Gulika Kalam (same segment-based calculation as Rahu)
  try {
    const calculateGulikaKalam = require('../../../lib/gulikaKalam');
    const gulikaResult = calculateGulikaKalam(date, sunriseWithSec, sunsetWithSec, tz);
    if (gulikaResult && gulikaResult.start) {
      kalams.push({
        name: 'Gulika Kalam',
        startTime: toHHMM(gulikaResult.start),
        endTime: toHHMM(gulikaResult.end),
        description: 'Inauspicious period ruled by Saturn\'s son Gulika; avoid auspicious activities',
      });
    }
  } catch {
    // Skip if lib unavailable
  }

  // 3. Yamaganda (Yamghant Kalam)
  try {
    const calculateYamghantKalam = require('../../../lib/yamghantKalam');
    const yama = calculateYamghantKalam(date, sunriseWithSec, sunsetWithSec, tz);
    kalams.push({
      name: 'Yamaganda',
      startTime: toHHMM(yama.start),
      endTime: toHHMM(yama.end),
      description: 'Inauspicious period ruled by Yama; avoid important activities',
    });
  } catch {
    // Skip if lib unavailable
  }

  // 4. Varjyam — nakshatra-based timing (placeholder with note)
  kalams.push({
    name: 'Varjyam',
    startTime: '',
    endTime: '',
    description: 'Nakshatra-dependent inauspicious period (requires precise nakshatra transition times)',
  });

  // 5. Dur Muhurtam
  try {
    const calculateDurMuhurtam = require('../../../lib/durMuhurtam');
    const durPeriods: Array<{ start: string; end: string }> = calculateDurMuhurtam(
      date,
      sunriseWithSec,
      sunsetWithSec,
      tz,
    );
    durPeriods.forEach((period, index) => {
      const startTime = normalizeTime(period.start);
      const endTime = normalizeTime(period.end);
      const label = durPeriods.length > 1 ? `Dur Muhurtam ${index + 1}` : 'Dur Muhurtam';
      kalams.push({
        name: label,
        startTime,
        endTime,
        description: 'Inauspicious muhurta; avoid starting new activities during this period',
      });
    });
  } catch {
    // Skip if lib unavailable
  }

  return kalams;
}
