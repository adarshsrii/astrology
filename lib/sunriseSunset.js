const SunCalc = require("suncalc");
const { DateTime } = require("luxon");

function calculateSunriseSunset(date, latitude, longitude, timezone = "UTC") {
    // Convert date string to a Date object
    const parsedDate = new Date(date);

    // Get sunrise and sunset times from SunCalc
    const times = SunCalc.getTimes(parsedDate, latitude, longitude);

    // Convert the times to the provided timezone using Luxon and format them as hh:mm:ss
    const sunrise = DateTime.fromJSDate(times.sunrise).setZone(timezone).toFormat('HH:mm:ss');
    const sunset = DateTime.fromJSDate(times.sunset).setZone(timezone).toFormat('HH:mm:ss');

    return {
        sunrise,
        sunset
    };
}

module.exports = calculateSunriseSunset;
