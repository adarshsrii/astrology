// React Native compatible entry point
// Uses compiled JS from dist/ — no ts-node, no raw swisseph
// swisseph calls are handled by react-native-swisseph via the bridge stub

// Legacy utility modules (pure JS, work offline)
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
const calculateGulikaKalam = require('./lib/gulikaKalam');

// v2 Panchang (compiled JS, uses SunCalc + Jean Meeus fallback)
const { calculateFullPanchang } = require('./dist/panchang/src/panchang-v2');
const { calculateMonthlyPanchang } = require('./dist/panchang/src/monthly');

// v2 Core modules (pure math, no external deps)
const { calculateTithi } = require('./dist/panchang/src/core/tithi');
const { calculateNakshatra: calculateNakshatraV2 } = require('./dist/panchang/src/core/nakshatra');
const { calculateYoga } = require('./dist/panchang/src/core/yoga');
const { calculateKarana } = require('./dist/panchang/src/core/karana');
const { calculateRashi } = require('./dist/panchang/src/core/rashi');

// Birth Chart (compiled JS, swisseph via react-native-swisseph bridge)
const { calculateBirthChart } = require('./dist/panchang/src/birthchart/birthchart');

// Birth Chart Analysis
const { calculateTattvaBalance } = require('./dist/panchang/src/birthchart/analysis/tattva');
const { calculateFriendships } = require('./dist/panchang/src/birthchart/analysis/friendships');
const { calculateAspects } = require('./dist/panchang/src/birthchart/analysis/aspects');
const { calculateShadBala } = require('./dist/panchang/src/birthchart/analysis/shadbala');
const { analyzeManglik, analyzeKaalSarp, analyzeGandaMoola, analyzeGandanta } = require('./dist/panchang/src/birthchart/analysis/dosha');
const { detectYogas } = require('./dist/panchang/src/birthchart/analysis/yogas');

// Dasha
const { calculateVimshottariDasha } = require('./dist/panchang/src/birthchart/dasha/vimshottari');

// Divisional Charts
const { calculateDivisionalChart } = require('./dist/panchang/src/birthchart/divisional/calculator');
const { SHODASHVARGA_CHARTS } = require('./dist/panchang/src/birthchart/divisional/charts');
const { calculateShodashvarga } = require('./dist/panchang/src/birthchart/divisional/shodashvarga');

// Recommendations
const { getNameSuggestions } = require('./dist/panchang/src/birthchart/recommendations/names');
const { getRemedies } = require('./dist/panchang/src/birthchart/recommendations/remedies');

// Transit (Gochar) — Daily Horoscope
const { calculateDailyHoroscope, getDailyHoroscope } = require('./dist/panchang/src/transit/index');

module.exports = {
  // Legacy
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
  calculateGulikaKalam,

  // Panchang v2
  calculateFullPanchang,
  calculateMonthlyPanchang,
  calculateTithi,
  calculateNakshatraV2,
  calculateYoga,
  calculateKarana,
  calculateRashi,

  // Birth Chart
  calculateBirthChart,

  // Analysis
  calculateTattvaBalance,
  calculateFriendships,
  calculateAspects,
  calculateShadBala,
  analyzeManglik,
  analyzeKaalSarp,
  analyzeGandaMoola,
  analyzeGandanta,
  detectYogas,

  // Dasha
  calculateVimshottariDasha,

  // Divisional Charts
  calculateDivisionalChart,
  SHODASHVARGA_CHARTS,
  calculateShodashvarga,

  // Recommendations
  getNameSuggestions,
  getRemedies,

  // Transit — Daily Horoscope
  calculateDailyHoroscope,
  getDailyHoroscope,
};
