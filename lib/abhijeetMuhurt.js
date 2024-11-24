const { DateTime } = require("luxon");

const calculateAbhijeetMuhurt = (date, sunrise, sunset, latitude, longitude, timezone) => {
    // Parse the date and convert sunrise/sunset to Luxon DateTime objects
    const sunriseTime = DateTime.fromJSDate(new Date(`${date}T${sunrise}`)).setZone(timezone);
    const sunsetTime = DateTime.fromJSDate(new Date(`${date}T${sunset}`)).setZone(timezone);

    // Calculate the time difference in minutes between sunrise and sunset
    const timeDiff = sunsetTime.diff(sunriseTime, 'minutes').minutes;

    // Calculate the duration of each Muhurat (total time divided by 15)
    const muhurtDuration = timeDiff / 15;

    // Calculate the start time of Abhijeet Muhurat (7th interval after sunrise)
    const abhijeetStartTime = sunriseTime.plus({ minutes: muhurtDuration * 7 });

    // Calculate the end time of Abhijeet Muhurat (9th interval after sunrise)
    const abhijeetEndTime = sunriseTime.plus({ minutes: muhurtDuration * 9 });

    return {
        start: abhijeetStartTime.toFormat('HH:mm:ss'),
        end: abhijeetEndTime.toFormat('HH:mm:ss')
    };
}

module.exports = calculateAbhijeetMuhurt;
