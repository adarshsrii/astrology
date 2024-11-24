const { DateTime } = require('luxon');

const calculateRahuKalam = (date, sunrise, sunset, timezone) => {
    // Parse sunrise and sunset times into Luxon DateTime objects for the given date
    const sunriseTime = DateTime.fromFormat(`${date} ${sunrise}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });
    const sunsetTime = DateTime.fromFormat(`${date} ${sunset}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });

    // Ensure both times are valid
    if (!sunriseTime.isValid || !sunsetTime.isValid) {
        throw new Error('Invalid sunrise or sunset time format.');
    }

    // Calculate the total day duration in minutes (from sunrise to sunset)
    const dayDurationMinutes = sunsetTime.diff(sunriseTime, 'minutes').minutes;

    // Divide the day into 8 equal segments (each segment is the duration of 1 Muhurat)
    const segmentDurationMinutes = dayDurationMinutes / 8;

    // Rahu Kaal segment mapping (starting from the 1st segment)
    const rahuKalamMapping = {
        1: 2, // Monday: 2nd segment (7:30 am - 9:00 am)
        2: 7, // Tuesday: 7th segment (3:00 pm - 4:30 pm)
        3: 5, // Wednesday: 5th segment (12:00 pm - 1:30 pm)
        4: 6, // Thursday: 6th segment (1:30 pm - 3:00 pm)
        5: 4, // Friday: 4th segment (10:30 am - 12:00 pm)
        6: 3, // Saturday: 3rd segment (9:00 am - 10:30 am)
        7: 8, // Sunday: 7th segment (4:30 pm - 6:00 pm)
    };

    // Get the day of the week for the provided date (0: Sunday, 6: Saturday)
    const weekday = sunriseTime.weekday;

    // Get the Rahu Kalam segment number for the given weekday
    const rahuSegment = rahuKalamMapping[weekday];

    // Calculate the start time of Rahu Kalam (based on the segment)
    const rahuStartTime = sunriseTime.plus({ minutes: segmentDurationMinutes * (rahuSegment - 1) });

    // Calculate the end time of Rahu Kalam
    const rahuEndTime = rahuStartTime.plus({ minutes: segmentDurationMinutes });

    // Return the Rahu Kalam times as formatted strings
    return {
        start: rahuStartTime.toFormat('HH:mm:ss'),
        end: rahuEndTime.toFormat('HH:mm:ss')
    };
};

// Export the function for use in other modules
module.exports = calculateRahuKalam;
