// React Native compatible entry point
// Skips ts-node and panchang engine (requires swisseph native module)
// Exports pure JS utility modules + API fetch for full panchang

const calculateSunriseSunset = require('./lib/sunriseSunset');
const calculateMoonriseMoonset = require('./lib/moonriseMoonset');
const calculateAbhijeetMuhurt = require('./lib/abhijeetMuhurt');
const calculateChoghadiya = require('./lib/chaughadiya');
const calculateRahuKalam = require('./lib/rahuKalam');
const calculateDurMuhurtam = require('./lib/durMuhurtam');
const calculateYamghantKalam = require('./lib/yamghantKalam');
const calculateBioRhythms = require('./lib/bioRhythms');
const calculateMoonPosition = require('./lib/moonPosition');
const calculateNakshatras = require('./lib/nakshatra');

/**
 * Fetch full Panchang from Supabase Edge Function (requires internet).
 * This is the React Native equivalent of calculateFullPanchang().
 * Configure PANCHANG_API_URL before using.
 *
 * @param {string} date - "YYYY-MM-DD"
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} timezone - IANA timezone
 * @param {string} [apiUrl] - Override API endpoint
 * @returns {Promise<object>} PanchangResult
 */
async function fetchPanchang(date, latitude, longitude, timezone, apiUrl) {
  const url = apiUrl || process.env.PANCHANG_API_URL;
  if (!url) {
    throw new Error(
      'fetchPanchang requires a Supabase API URL. ' +
      'Set PANCHANG_API_URL env var or pass apiUrl parameter. ' +
      'For server-side use, import calculateFullPanchang from the main entry instead.'
    );
  }

  const response = await fetch(
    `${url}?date=${date}&lat=${latitude}&lon=${longitude}&tz=${encodeURIComponent(timezone)}`
  );

  if (!response.ok) {
    throw new Error(`Panchang API error: ${response.status}`);
  }

  return response.json();
}

module.exports = {
  // Legacy utility modules (work offline on device)
  calculateSunriseSunset,
  calculateMoonriseMoonset,
  calculateAbhijeetMuhurt,
  calculateChoghadiya,
  calculateRahuKalam,
  calculateDurMuhurtam,
  calculateYamghantKalam,
  calculateBioRhythms,
  calculateMoonPosition,
  calculateNakshatras,

  // v2 Panchang (requires API — Swiss Ephemeris not available on RN)
  fetchPanchang,
};
