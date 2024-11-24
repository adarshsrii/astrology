const SunCalc = require("suncalc");
const { DateTime } = require("luxon");

function calculateMoonriseMoonset(date, latitude, longitude, timezone = "UTC") {
    // Convert date string to a Date object
    const parsedDate = new Date(date);

    // Get sunrise and sunset times from SunCalc
    const times = SunCalc.getMoonTimes(parsedDate, latitude, longitude);

    // Convert the times to the provided timezone using Luxon and format them as hh:mm:ss
    const moonrise = DateTime.fromJSDate(times.rise).setZone(timezone).toFormat('HH:mm:ss');
    const moonset = DateTime.fromJSDate(times.set).setZone(timezone).toFormat('HH:mm:ss');

    return {
        moonrise,
        moonset
    };
}

module.exports = calculateMoonriseMoonset;
