/**
 * Lagna (Ascendant) Calculation
 * Uses Swiss Ephemeris swe_houses to compute the ascendant and house cusps.
 */

import { Ephemeris } from '../../calculations/ephemeris';
import { LagnaInfo, HouseSystemType } from '../types';
import { HOUSE_SYSTEM_CODES, SIGN_NAMES } from './constants';

export interface HouseCuspsResult {
  ascendant: number;        // tropical ascendant longitude
  mc: number;               // midheaven
  cusps: number[];           // cusps[1..12] (index 0 unused)
}

/**
 * Calculate the ascendant (lagna) for a birth moment.
 *
 * @param utcDate - The birth moment in UTC
 * @param latitude - Birth latitude
 * @param longitude - Birth longitude
 * @param ayanamsa - Ayanamsa value to convert tropical → sidereal
 * @param houseSystem - House system type
 * @param ephemeris - Ephemeris instance
 */
export function calculateLagna(
  utcDate: Date,
  latitude: number,
  longitude: number,
  ayanamsa: number,
  houseSystem: HouseSystemType,
  ephemeris: Ephemeris,
): { lagna: LagnaInfo; cusps: number[] } {
  const cuspsResult = calculateHouseCuspsViaEphemeris(
    utcDate, latitude, longitude, houseSystem, ephemeris,
  );

  // Convert tropical ascendant to sidereal
  let siderealAsc = cuspsResult.ascendant - ayanamsa;
  if (siderealAsc < 0) siderealAsc += 360;
  if (siderealAsc >= 360) siderealAsc -= 360;

  const signNumber = Math.floor(siderealAsc / 30) + 1;
  const degreeInSign = siderealAsc - (signNumber - 1) * 30;

  // Nakshatra from ascendant longitude
  const nakshatraInfo = computeNakshatraFromLon(siderealAsc);

  // Convert cusps to sidereal
  const siderealCusps: number[] = [0]; // index 0 unused
  for (let i = 1; i <= 12; i++) {
    let sc = (cuspsResult.cusps[i] || 0) - ayanamsa;
    if (sc < 0) sc += 360;
    if (sc >= 360) sc -= 360;
    siderealCusps.push(sc);
  }

  const lagna: LagnaInfo = {
    longitude: Math.round(siderealAsc * 10000) / 10000,
    signName: SIGN_NAMES[signNumber] || 'Unknown',
    signNumber,
    degreeInSign: Math.round(degreeInSign * 100) / 100,
    nakshatra: nakshatraInfo.name,
    nakshatraNumber: nakshatraInfo.number,
    nakshatraPada: nakshatraInfo.pada,
    nakshatraLord: nakshatraInfo.lord,
  };

  return { lagna, cusps: siderealCusps };
}

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Call Swiss Ephemeris swe_houses via the Ephemeris class.
 */
function calculateHouseCuspsViaEphemeris(
  utcDate: Date,
  latitude: number,
  longitude: number,
  houseSystem: HouseSystemType,
  ephemeris: Ephemeris,
): HouseCuspsResult {
  try {
    const result = ephemeris.calculateHouseCusps(utcDate, latitude, longitude, houseSystem);
    return result;
  } catch (err) {
    // Fallback: simple equal-house calculation based on Sun's longitude
    console.warn('House cusp calculation failed, using simple fallback:', err);
    return fallbackHouseCusps(utcDate, ephemeris);
  }
}

function fallbackHouseCusps(utcDate: Date, ephemeris: Ephemeris): HouseCuspsResult {
  // Use Sun position as a very rough ascendant proxy
  const sunPos = ephemeris.calculatePosition(utcDate, 'Sun');
  const asc = sunPos.longitude;
  const cusps: number[] = [0];
  for (let i = 0; i < 12; i++) {
    cusps.push((asc + i * 30) % 360);
  }
  return { ascendant: asc, mc: (asc + 270) % 360, cusps };
}

// ── Nakshatra helper (inline to avoid circular deps) ─────────────────────────

const NAKSHATRA_DATA: Array<{ name: string; lord: string }> = [
  { name: 'Ashwini',           lord: 'Ketu' },
  { name: 'Bharani',           lord: 'Venus' },
  { name: 'Krittika',          lord: 'Sun' },
  { name: 'Rohini',            lord: 'Moon' },
  { name: 'Mrigashira',        lord: 'Mars' },
  { name: 'Ardra',             lord: 'Rahu' },
  { name: 'Punarvasu',         lord: 'Jupiter' },
  { name: 'Pushya',            lord: 'Saturn' },
  { name: 'Ashlesha',          lord: 'Mercury' },
  { name: 'Magha',             lord: 'Ketu' },
  { name: 'Purva Phalguni',    lord: 'Venus' },
  { name: 'Uttara Phalguni',   lord: 'Sun' },
  { name: 'Hasta',             lord: 'Moon' },
  { name: 'Chitra',            lord: 'Mars' },
  { name: 'Swati',             lord: 'Rahu' },
  { name: 'Vishakha',          lord: 'Jupiter' },
  { name: 'Anuradha',          lord: 'Saturn' },
  { name: 'Jyeshtha',          lord: 'Mercury' },
  { name: 'Mula',              lord: 'Ketu' },
  { name: 'Purva Ashadha',     lord: 'Venus' },
  { name: 'Uttara Ashadha',    lord: 'Sun' },
  { name: 'Shravana',          lord: 'Moon' },
  { name: 'Dhanishtha',        lord: 'Mars' },
  { name: 'Shatabhisha',       lord: 'Rahu' },
  { name: 'Purva Bhadrapada',  lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati',            lord: 'Mercury' },
];

function computeNakshatraFromLon(lon: number): {
  name: string; number: number; pada: number; lord: string;
} {
  const oneNakshatra = 360 / 27;
  const onePada = oneNakshatra / 4;
  const normalised = ((lon % 360) + 360) % 360;
  const idx = Math.floor(normalised / oneNakshatra);
  const posInNak = normalised - idx * oneNakshatra;
  const pada = Math.min(Math.floor(posInNak / onePada) + 1, 4);
  const nk = NAKSHATRA_DATA[idx] || { name: 'Unknown', lord: 'Unknown' };
  return { name: nk.name, number: idx + 1, pada, lord: nk.lord };
}
