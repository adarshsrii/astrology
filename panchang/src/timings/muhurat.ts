/**
 * Muhurat (auspicious timing) calculations for Panchang v2.
 * Wraps existing lib/ functions and adds computed muhurats.
 */

export interface MuhuratEntry {
  name: string;
  startTime: string; // HH:mm
  endTime: string;
  description: string;
}

/**
 * Parse "HH:mm" or "HH:mm:ss" into total minutes from midnight.
 */
function parseTimeToMinutes(time: string): number {
  const parts = time.split(':').map(Number);
  return parts[0] * 60 + parts[1];
}

/**
 * Convert total minutes from midnight to "HH:mm" string.
 * Handles wrap-around past midnight (mod 1440).
 */
function minutesToHHMM(minutes: number): string {
  let m = Math.round(minutes) % 1440;
  if (m < 0) m += 1440;
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

/**
 * Strip seconds from "HH:mm:ss" -> "HH:mm", or return as-is if already "HH:mm".
 */
function toHHMM(time: string): string {
  const parts = time.split(':');
  return `${parts[0]}:${parts[1]}`;
}

/**
 * Calculate all auspicious muhurats for a given date.
 *
 * @param sunrise - "HH:mm" format
 * @param sunset  - "HH:mm" format
 * @param date    - "yyyy-MM-dd" format
 * @param lat     - latitude
 * @param lon     - longitude
 * @param tz      - IANA timezone
 */
export function calculateMuhurats(
  sunrise: string,
  sunset: string,
  date: string,
  lat: number,
  lon: number,
  tz: string,
): MuhuratEntry[] {
  const sunriseMin = parseTimeToMinutes(sunrise);
  const sunsetMin = parseTimeToMinutes(sunset);
  const dayDuration = sunsetMin - sunriseMin; // minutes of daytime
  const muhurtaDuration = dayDuration / 15;   // one daytime muhurta

  // Night duration (sunset to next sunrise, approximated as 24h - dayDuration)
  const nightDuration = 1440 - dayDuration;

  const muhurats: MuhuratEntry[] = [];

  // 1. Brahma Muhurta — 2 muhurtas before sunrise (1h 36min before, lasts 48 min)
  const brahmaStart = sunriseMin - (muhurtaDuration * 2);
  const brahmaEnd = sunriseMin - muhurtaDuration;
  muhurats.push({
    name: 'Brahma Muhurta',
    startTime: minutesToHHMM(brahmaStart),
    endTime: minutesToHHMM(brahmaEnd),
    description: 'Most auspicious time for meditation & spiritual practice, 2 muhurtas before sunrise',
  });

  // 2. Pratah Sandhya — from ~1h12m (1.5 muhurtas) before sunrise to sunrise
  // Drik Panchang uses: start = sunrise - (nightMuhurta * 1.5), end = sunrise
  const nightMuhurta = nightDuration / 15;
  const pratahStart = sunriseMin - (nightMuhurta * 1.5);
  muhurats.push({
    name: 'Pratah Sandhya',
    startTime: minutesToHHMM(pratahStart),
    endTime: minutesToHHMM(sunriseMin),
    description: 'Morning twilight period, ideal for Sandhyavandanam',
  });

  // 3. Abhijit Muhurat — use existing lib function
  try {
    const calculateAbhijeetMuhurt = require('../../../lib/abhijeetMuhurt');
    // The lib expects sunrise/sunset with seconds
    const sunriseWithSec = sunrise.length === 5 ? sunrise + ':00' : sunrise;
    const sunsetWithSec = sunset.length === 5 ? sunset + ':00' : sunset;
    const abhijit = calculateAbhijeetMuhurt(date, sunriseWithSec, sunsetWithSec, lat, lon, tz);
    muhurats.push({
      name: 'Abhijit Muhurat',
      startTime: toHHMM(abhijit.start),
      endTime: toHHMM(abhijit.end),
      description: 'Midday auspicious period ruled by Lord Vishnu, ideal for important tasks',
    });
  } catch {
    // Fallback: compute manually (muhurta #8, i.e. index 7-8 after sunrise)
    const abhijitStart = sunriseMin + muhurtaDuration * 7;
    const abhijitEnd = sunriseMin + muhurtaDuration * 9;
    muhurats.push({
      name: 'Abhijit Muhurat',
      startTime: minutesToHHMM(abhijitStart),
      endTime: minutesToHHMM(abhijitEnd),
      description: 'Midday auspicious period ruled by Lord Vishnu, ideal for important tasks',
    });
  }

  // 4. Vijaya Muhurat — the muhurta spanning the midpoint between Abhijit and sunset
  // Drik Panchang: roughly the 11th muhurta (index 10) from sunrise
  const vijayaStart = sunriseMin + muhurtaDuration * 10;
  const vijayaEnd = sunriseMin + muhurtaDuration * 11;
  muhurats.push({
    name: 'Vijaya Muhurat',
    startTime: minutesToHHMM(vijayaStart),
    endTime: minutesToHHMM(vijayaEnd),
    description: 'Afternoon auspicious period for victory & success in endeavors',
  });

  // 5. Godhuli Muhurat — starts ~1 min before sunset, lasts ~24 min (sunset-1 to sunset+23)
  // Drik Panchang pattern: from ~sunset to sunset + half a nightMuhurta
  muhurats.push({
    name: 'Godhuli Muhurat',
    startTime: minutesToHHMM(sunsetMin - 1),
    endTime: minutesToHHMM(sunsetMin + 22),
    description: 'Cow-dust time around sunset, auspicious for marriages & ceremonies',
  });

  // 6. Sayahna Sandhya — from sunset to sunset + 1.5 night muhurtas
  // Mirrors Pratah Sandhya: Pratah = 1.5 night muhurtas before sunrise, Sayahna = 1.5 after sunset
  const sayahnaEnd = sunsetMin + (nightMuhurta * 1.5);
  muhurats.push({
    name: 'Sayahna Sandhya',
    startTime: minutesToHHMM(sunsetMin),
    endTime: minutesToHHMM(sayahnaEnd),
    description: 'Evening twilight period, ideal for evening prayers & Sandhyavandanam',
  });

  // 7. Nishita Muhurat — midnight +/- 24 min
  // Midnight = midpoint between sunset and next sunrise
  const midnightMin = sunsetMin + nightDuration / 2;
  muhurats.push({
    name: 'Nishita Muhurat',
    startTime: minutesToHHMM(midnightMin - 24),
    endTime: minutesToHHMM(midnightMin + 24),
    description: 'Midnight auspicious period, sacred for worship of Lord Shiva',
  });

  return muhurats;
}
