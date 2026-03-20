import { calculateTithi } from './core/tithi';
import { calculateNakshatra } from './core/nakshatra';
import { calculateYoga } from './core/yoga';
import { calculateKarana } from './core/karana';
import { calculateRashi } from './core/rashi';
import { normalizeAngle } from './core/constants';
import { PanchangResult, Location } from './types';
import { calculateMuhurats } from './timings/muhurat';
import { calculateKalams } from './timings/kalam';

const MOON_PHASES = [
  'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
  'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];

function getMoonPhaseName(tithiIndex: number): string {
  // Derive phase from tithi number (more accurate than angular division)
  // Tithi 0 = Shukla Pratipad (just after new moon)
  // Tithi 14 = Purnima (full moon)
  // Tithi 15 = Krishna Pratipad (just after full moon)
  // Tithi 29 = Amavasya (new moon)
  if (tithiIndex <= 0) return 'New Moon';
  if (tithiIndex <= 3) return 'Waxing Crescent';
  if (tithiIndex <= 6) return 'First Quarter';
  if (tithiIndex <= 10) return 'Waxing Gibbous';
  if (tithiIndex <= 14) return 'Full Moon';
  if (tithiIndex <= 18) return 'Waning Gibbous';
  if (tithiIndex <= 21) return 'Last Quarter';
  if (tithiIndex <= 25) return 'Waning Crescent';
  return 'New Moon';
}

function formatTimeHHMM(date: Date | null, timezone: string): string {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
}

export function calculateFullPanchang(
  date: Date | string,
  latitude: number,
  longitude: number,
  timezone: string,
): PanchangResult {
  // If date string passed, use current time today (not fixed 6 AM)
  // This ensures illumination and progress values are real-time
  const inputDate = typeof date === 'string'
    ? (date === new Date().toISOString().split('T')[0] ? new Date() : new Date(date + 'T12:00:00'))
    : date;
  const location: Location = { latitude, longitude, timezone };

  // Try to use Swiss Ephemeris, fall back to SunCalc-based calculations
  let sunLon = 0, moonLon = 0;
  let sunrise: Date | null = null, sunset: Date | null = null;
  let moonrise: Date | null = null, moonset: Date | null = null;
  let ayanamsa = 24.17; // Default Lahiri approximation for 2026

  try {
    const { Ephemeris } = require('./calculations/ephemeris');
    const ephemeris = new Ephemeris();

    ayanamsa = ephemeris.calculate_lahiri_ayanamsa(inputDate);
    const sunTropical = ephemeris.calculatePosition(inputDate, 'Sun');
    const moonTropical = ephemeris.calculatePosition(inputDate, 'Moon');
    sunLon = normalizeAngle(sunTropical.longitude - ayanamsa);
    moonLon = normalizeAngle(moonTropical.longitude - ayanamsa);

    // Use SunCalc for sunrise/sunset (more accurate than ephemeris wrapper)
    const SunCalc = require('suncalc');
    const times = SunCalc.getTimes(inputDate, latitude, longitude);
    sunrise = times.sunrise;
    sunset = times.sunset;
    const moonTimes = SunCalc.getMoonTimes(inputDate, latitude, longitude);
    moonrise = moonTimes.rise ?? null;
    moonset = moonTimes.set ?? null;
  } catch (err) {
    // Fallback: use SunCalc for everything
    try {
      const SunCalc = require('suncalc');
      const times = SunCalc.getTimes(inputDate, latitude, longitude);
      sunrise = times.sunrise;
      sunset = times.sunset;
      const moonTimes = SunCalc.getMoonTimes(inputDate, latitude, longitude);
      moonrise = moonTimes.rise;
      moonset = moonTimes.set;

      // Low-precision sun/moon ecliptic longitude via Jean Meeus algorithms
      // (avoids swisseph entirely, accurate to ~1°)
      const jd = inputDate.getTime() / 86400000 + 2440587.5;
      const T = (jd - 2451545.0) / 36525;
      // Sun geometric mean longitude
      const L0 = normalizeAngle(280.46646 + 36000.76983 * T);
      // Sun mean anomaly
      const M = normalizeAngle(357.52911 + 35999.05029 * T);
      const Mrad = M * Math.PI / 180;
      // Sun equation of centre
      const C = (1.914602 - 0.004817 * T) * Math.sin(Mrad)
               + 0.019993 * Math.sin(2 * Mrad)
               + 0.000289 * Math.sin(3 * Mrad);
      const sunTropicalLon = normalizeAngle(L0 + C);
      sunLon = normalizeAngle(sunTropicalLon - ayanamsa);

      // Moon mean longitude
      const Lm = normalizeAngle(218.3165 + 481267.8813 * T);
      // Moon mean anomaly
      const Mm = normalizeAngle(134.9634 + 477198.8676 * T);
      // Moon argument of latitude
      const F = normalizeAngle(93.2721 + 483202.0175 * T);
      // Sun mean anomaly (already have M above)
      const MmRad = Mm * Math.PI / 180;
      const MRad = Mrad;
      const FRad = F * Math.PI / 180;
      // Simplified moon longitude correction
      const moonCorr = 6.289 * Math.sin(MmRad)
                     - 1.274 * Math.sin(MmRad - 2 * FRad)
                     + 0.658 * Math.sin(2 * FRad)
                     - 0.186 * Math.sin(MRad)
                     - 0.114 * Math.sin(2 * FRad)
                     + 0.059 * Math.sin(2 * MmRad)
                     - 0.057 * Math.sin(MmRad - 2 * FRad + MRad)
                     + 0.053 * Math.sin(MmRad + 2 * FRad)
                     + 0.046 * Math.sin(2 * FRad - MRad)
                     + 0.041 * Math.sin(MmRad - MRad);
      const moonTropicalLon = normalizeAngle(Lm + moonCorr);
      moonLon = normalizeAngle(moonTropicalLon - ayanamsa);
    } catch {
      // No ephemeris available at all
    }
  }

  const tithi = calculateTithi(sunLon, moonLon);
  const nakshatra = calculateNakshatra(moonLon);
  const yoga = calculateYoga(sunLon, moonLon);
  const karana = calculateKarana(sunLon, moonLon);
  const moonSign = calculateRashi(moonLon);
  const sunSign = calculateRashi(sunLon);

  // Use the date string to determine weekday (timezone-independent)
  const varaDateStr = typeof date === 'string' ? date : inputDate.toISOString().split('T')[0];
  const varaDate = new Date(varaDateStr + 'T12:00:00Z'); // Noon UTC — safe for any timezone
  const vara = {
    name: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][varaDate.getUTCDay()],
    number: varaDate.getUTCDay(),
  };

  const diff = normalizeAngle(moonLon - sunLon);
  // Use SunCalc for accurate illumination when available
  let moonIllumination = Math.round(((1 - Math.cos(diff * Math.PI / 180)) / 2) * 100);
  try {
    const SunCalc = require('suncalc');
    const illum = SunCalc.getMoonIllumination(inputDate);
    moonIllumination = Math.round(illum.fraction * 100);
  } catch {};

  const sunriseStr = formatTimeHHMM(sunrise, timezone);
  const sunsetStr = formatTimeHHMM(sunset, timezone);
  const dateStr = inputDate.toISOString().split('T')[0];

  // Calculate auspicious muhurats and inauspicious kalams
  let auspiciousMuhurats: { name: string; startTime: string; endTime: string; description?: string }[] = [];
  let inauspiciousKalams: { name: string; startTime: string; endTime: string; description?: string }[] = [];

  if (sunriseStr && sunsetStr) {
    try {
      auspiciousMuhurats = calculateMuhurats(sunriseStr, sunsetStr, dateStr, latitude, longitude, timezone);
    } catch {
      // Timing calculation failed; return empty array
    }
    try {
      inauspiciousKalams = calculateKalams(sunriseStr, sunsetStr, dateStr, latitude, longitude, timezone);
    } catch {
      // Timing calculation failed; return empty array
    }
  }

  return {
    date: dateStr,
    location: { lat: latitude, lon: longitude, timezone },
    sunrise: sunriseStr,
    sunset: sunsetStr,
    moonrise: formatTimeHHMM(moonrise, timezone),
    moonset: formatTimeHHMM(moonset, timezone),
    tithi: [{ name: tithi.name, number: tithi.number, startTime: '', endTime: '', progress: tithi.progress }],
    nakshatra: [{ name: nakshatra.name, number: nakshatra.number, pada: nakshatra.pada, lord: nakshatra.lord, deity: nakshatra.deity, startTime: '', endTime: '', progress: nakshatra.progress }],
    yoga: [{ name: yoga.name, number: yoga.number, startTime: '', endTime: '', progress: yoga.progress }],
    karana: [{ name: karana.name, number: karana.number, startTime: '', endTime: '', progress: karana.progress }],
    vara,
    moonSign,
    sunSign,
    moonPhase: { name: getMoonPhaseName(tithi.tithiIndex - 1), illumination: moonIllumination },
    paksha: tithi.paksha,
    auspiciousMuhurats,
    inauspiciousKalams,
  };
}
