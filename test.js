const {
    calculateSunriseSunset,
    calculateMoonriseMoonset,
    calculateAbhijeetMuhurt,
    calculateChoghadiya,

    calculateRahuKalam,
    calculateDurMuhurtam,
    calculateVarjyam,
    calculateGulikaKalam,
    calculateYamghantKalam,
} = require("./index");

// Sample data for testing
const date = "2024-11-28";
const latitude = 28.6139; // Example: New Delhi
const longitude = 77.2090;
const timezone = "Asia/Kolkata"; // Indian timezone


// Test Sunrise and Sunset
const sunriseSunset = calculateSunriseSunset(date, latitude, longitude, timezone);
console.log("Sunrise and Sunset: ", sunriseSunset);

// Test Abhijeet Muhurt
const abhijeet = calculateAbhijeetMuhurt(date, sunriseSunset.sunrise, sunriseSunset.sunset, latitude, longitude, timezone);
console.log("Abhijeet Muhurt: ", abhijeet);

// Test Moonrise and Moonset
const moonriseMoonset = calculateMoonriseMoonset(date, latitude, longitude, timezone);
console.log("Moonrise and Moonset: ", moonriseMoonset);

//Test Choghadiya
const choghadiyas = calculateChoghadiya(date, sunriseSunset.sunrise, sunriseSunset.sunset, timezone);
console.log(choghadiyas);

// Test Rahu Kalam
const rahuKalam = calculateRahuKalam(date, sunriseSunset.sunrise, sunriseSunset.sunset, timezone);
console.log("Rahu Kalam: ", rahuKalam);

// Test Dur Muhurtam
const durMuhurtam = calculateDurMuhurtam(date, sunriseSunset.sunrise, sunriseSunset.sunset, timezone);
console.log("Dur Muhurtam: ", durMuhurtam);

// Test Yamghant Kalam
const yamghantKalam = calculateYamghantKalam(date, sunriseSunset.sunrise, sunriseSunset.sunset, timezone);
console.log("Yamghant Kalam: ", yamghantKalam);

//
// // Test Varjyam
// const varjyam = calculateVarjyam(date, sunriseSunset.sunrise, sunriseSunset.sunset, timezone);
// console.log("Varjyam: ", varjyam);
//
//
// // Test Gulika Kalam
// const gulikaKalam = calculateGulikaKalam(date, latitude, longitude, timezone);
// console.log("Gulika Kalam: ", gulikaKalam);
