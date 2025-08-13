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
    calculatePanchang
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

// Panchang
const panchang = calculatePanchang(date, latitude, longitude, timezone);
console.log('Panchang:', JSON.stringify(panchang, null, 2));
