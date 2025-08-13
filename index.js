require('ts-node').register({ transpileOnly: true });

// Core Panchang engine (TypeScript entry)
const { getPanchang } = require('./panchang/src/index.ts');

// Legacy utility modules
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
 * calculatePanchang - Returns comprehensive Panchang panchang for the given instant & location
 * @param {Date|string} date Exact date/time for calculation
 * @param {number} latitude Latitude in degrees
 * @param {number} longitude Longitude in degrees
 * @param {string} timezone IANA timezone identifier
 * @param {string} [locationName] Optional human-readable place name
 * @returns {object} PanchangOutput (see panchang/src/index.ts)
 */
/**
 * calculatePanchang - Returns comprehensive Panchang for the given instant & location
 * @param {Date|string} date Exact date/time for calculation
 * @param {number} latitude Latitude in degrees
 * @param {number} longitude Longitude in degrees
 * @param {string} timezone IANA timezone identifier
 * @param {string} [locationName] Optional human-readable place name
 * @param {'en'|'hi'} [lang='en'] Language code ('en' or 'hi')
 * @returns {object} PanchangOutput (see panchang/src/index.ts)
 */
function calculatePanchang(date, latitude, longitude, timezone, locationName, lang = 'en') {
  return getPanchang(
    date instanceof Date ? date : new Date(date),
    latitude,
    longitude,
    timezone,
    lang
  );
}

module.exports = {
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
  calculatePanchang
};
