const { DateTime } = require("luxon");

const calculateAbhijeetMuhurt = (date, sunrise, sunset, latitude, longitude, timezone) => {
    // Parse sunrise/sunset
    const sunriseTime = DateTime.fromJSDate(new Date(`${date}T${sunrise}`)).setZone(timezone);
    const sunsetTime = DateTime.fromJSDate(new Date(`${date}T${sunset}`)).setZone(timezone);

    // Day is divided into 15 muhurtas
    const timeDiff = sunsetTime.diff(sunriseTime, 'minutes').minutes;
    const muhurtDuration = timeDiff / 15;

    // Abhijit Muhurat is the 8th muhurta (index 7, one muhurta duration)
    const abhijeetStartTime = sunriseTime.plus({ minutes: muhurtDuration * 7 });
    const abhijeetEndTime = sunriseTime.plus({ minutes: muhurtDuration * 8 });

    return {
        start: abhijeetStartTime.toFormat('HH:mm:ss'),
        end: abhijeetEndTime.toFormat('HH:mm:ss')
    };
}

module.exports = calculateAbhijeetMuhurt;
