const {
    calculateSunriseSunset,
    calculateMoonriseMoonset,
    calculateMoonPosition,
    calculateAbhijeetMuhurt,
    calculateChoghadiya,
    calculateRahuKalam,
    calculateDurMuhurtam,
    calculateYamghantKalam,
    calculateBioRhythms,
    calculateNakshatras,
    calculatePanchang,
    calculateFullPanchang,
    calculateTithi,
    calculateNakshatraV2,
    calculateYoga,
    calculateKarana,
    calculateRashi,
} = require('./index');

// Sample panchang for testing
const date = "1991-12-10";
//26.4502° N, 84.1060° E
const latitude = 26.4502; // Example: New Delhi
const longitude = 84.1060;
const timezone = "Asia/Kolkata"; // Indian timezone

// Example usage
const dob = "1991-12-10"; // Example date of birth
const result = calculateBioRhythms(date, dob, timezone, 7);
console.log("Bio Rhythms ", result);

// Test Sunrise and Sunset
const sunriseSunset = calculateSunriseSunset(date, latitude, longitude, timezone);
console.log("Sunrise and Sunset: ", sunriseSunset);

// Test Abhijeet Muhurt
const abhijeet = calculateAbhijeetMuhurt(
  date,
  sunriseSunset.sunrise,
  sunriseSunset.sunset,
  latitude,
  longitude,
  timezone
);
console.log("Abhijeet Muhurt: ", abhijeet);

// Test Moonrise and Moonset
const moonriseMoonset = calculateMoonriseMoonset(date, latitude, longitude, timezone);
console.log("Moonrise and Moonset: ", moonriseMoonset);

// Test Moon Position
const { getMoonPosition, getMoonIllumination, getMoonTimes } = calculateMoonPosition(
  date,
  latitude,
  longitude,
  timezone
);
console.log("Moon Position: ", getMoonPosition);
console.log("Moon Illumination: ", getMoonIllumination);
console.log("Moon Times: ", getMoonTimes);

// Test Nakshatras
const nakshatras = calculateNakshatras(date, latitude, longitude, timezone);
console.log("Nakshatras: ", nakshatras);

//Test Choghadiya
const choghadiyas = calculateChoghadiya(
  date,
  sunriseSunset.sunrise,
  sunriseSunset.sunset,
  timezone
);
console.log(choghadiyas);

// Test Rahu Kalam
const rahuKalam = calculateRahuKalam(
  date,
  sunriseSunset.sunrise,
  sunriseSunset.sunset,
  timezone
);
console.log("Rahu Kalam: ", rahuKalam);

// Test Dur Muhurtam
const durMuhurtam = calculateDurMuhurtam(
  date,
  sunriseSunset.sunrise,
  sunriseSunset.sunset,
  timezone
);
console.log("Dur Muhurtam: ", durMuhurtam);

// Test Yamghant Kalam
const yamghantKalam = calculateYamghantKalam(
  date,
  sunriseSunset.sunrise,
  sunriseSunset.sunset,
  timezone
);
console.log('Yamghant Kalam:', yamghantKalam);

// Panchang (legacy)
const panchang = calculatePanchang(date, latitude, longitude, timezone);
console.log('Panchang:', JSON.stringify(panchang, null, 2));

// ═══════════════════════════════════════════════════════════════
// v2 — Full Panchang (Swiss Ephemeris + validated against Drik Panchang)
// ═══════════════════════════════════════════════════════════════

console.log('\n\n═══ v2 Full Panchang ═══\n');

// Full Panchang for today's date
const today = new Date().toISOString().split('T')[0];
const fullPanchang = calculateFullPanchang(today, latitude, longitude, timezone);
console.log('Full Panchang for', today + ':');
console.log('  Tithi:', fullPanchang.tithi[0].name, '(' + fullPanchang.tithi[0].progress + '% elapsed)');
console.log('  Nakshatra:', fullPanchang.nakshatra[0].name, 'Pada', fullPanchang.nakshatra[0].pada, '(' + fullPanchang.nakshatra[0].progress + '%)');
console.log('  Yoga:', fullPanchang.yoga[0].name, '(' + fullPanchang.yoga[0].progress + '%)');
console.log('  Karana:', fullPanchang.karana[0].name);
console.log('  Vara:', fullPanchang.vara.name);
console.log('  Moon Sign:', fullPanchang.moonSign.name, fullPanchang.moonSign.degree + '°');
console.log('  Sun Sign:', fullPanchang.sunSign.name, fullPanchang.sunSign.degree + '°');
console.log('  Paksha:', fullPanchang.paksha);
console.log('  Moon Phase:', fullPanchang.moonPhase.name, fullPanchang.moonPhase.illumination + '% illuminated');
console.log('  Sunrise:', fullPanchang.sunrise, '| Sunset:', fullPanchang.sunset);
console.log('  Moonrise:', fullPanchang.moonrise, '| Moonset:', fullPanchang.moonset);

// Individual core module tests
console.log('\n═══ v2 Core Modules ═══\n');

// Tithi from raw longitudes
const tithiResult = calculateTithi(335.5, 359.8);
console.log('Tithi (raw):', tithiResult.name, '| Paksha:', tithiResult.paksha, '| Progress:', tithiResult.progress + '%');

// Nakshatra from moon longitude
const nakshatraResult = calculateNakshatraV2(355.0);
console.log('Nakshatra (moon@355°):', nakshatraResult.name, 'Pada', nakshatraResult.pada, '| Lord:', nakshatraResult.lord);

// Yoga from sun+moon
const yogaResult = calculateYoga(335.5, 359.8);
console.log('Yoga (sun+moon):', yogaResult.name, '| Progress:', yogaResult.progress + '%');

// Karana from sun-moon diff
const karanaResult = calculateKarana(335.5, 359.8);
console.log('Karana:', karanaResult.name);

// Rashi from longitude
const rashiResult = calculateRashi(355.0);
console.log('Rashi (355°):', rashiResult.name, '| Lord:', rashiResult.lord, '| Degree:', rashiResult.degree + '°');

// Multi-date validation
console.log('\n═══ Multi-Date Validation ═══\n');
const testDates = [
  { date: '2026-03-20', label: 'Mar 20 2026' },
  { date: '2025-10-20', label: 'Oct 20 2025 (Diwali)' },
  { date: '2026-01-14', label: 'Jan 14 2026 (Makar Sankranti)' },
  { date: '1947-08-15', label: 'Aug 15 1947 (Independence)' },
];

for (const { date: d, label } of testDates) {
  const p = calculateFullPanchang(d, latitude, longitude, timezone);
  console.log(`${label}: ${p.tithi[0].name} | ${p.nakshatra[0].name} Pada ${p.nakshatra[0].pada} | ${p.yoga[0].name} | ${p.vara.name} | Moon: ${p.moonSign.name} | Sun: ${p.sunSign.name}`);
}
