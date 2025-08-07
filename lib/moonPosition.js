const SunCalc = require("suncalc");
const { DateTime } = require("luxon");

/**
 * Calculate moon position, illumination, and rise/set times for a given date and location.
 *
 * @param {string|Date} date - Date string or Date object for which to calculate moon data.
 * @param {number} latitude - Geographic latitude.
 * @param {number} longitude - Geographic longitude.
 * @param {string} [timezone='UTC'] - IANA timezone identifier for formatted output.
 * @returns {object} An object containing getMoonPosition, getMoonIllumination, and getMoonTimes.
 */
function calculateMoonPosition(date, latitude, longitude, timezone = "UTC") {
    const parsedDate = new Date(date);

    // Get raw moon position and illumination from SunCalc
    const getMoonPosition = SunCalc.getMoonPosition(parsedDate, latitude, longitude);
    const getMoonIllumination = SunCalc.getMoonIllumination(parsedDate);

    // Get moon rise and set times and format to timezone
    const times = SunCalc.getMoonTimes(parsedDate, latitude, longitude);
    const getMoonTimes = {
        rise: DateTime.fromJSDate(times.rise).setZone(timezone).toFormat('HH:mm:ss'),
        set: DateTime.fromJSDate(times.set).setZone(timezone).toFormat('HH:mm:ss')
    };

    return { getMoonPosition, getMoonIllumination, getMoonTimes };
}

module.exports = calculateMoonPosition;
