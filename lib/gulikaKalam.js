const { DateTime } = require('luxon');

const calculateGulikaKalam = (date, sunrise, sunset, timezone) => {
    // Parse sunrise and sunset
    const sunriseTime = DateTime.fromFormat(`${date} ${sunrise}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });
    const sunsetTime = DateTime.fromFormat(`${date} ${sunset}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });

    if (!sunriseTime.isValid || !sunsetTime.isValid) {
        throw new Error('Invalid sunrise or sunset time format.');
    }

    // Divide day into 8 equal segments
    const dayDurationMinutes = sunsetTime.diff(sunriseTime, 'minutes').minutes;
    const segmentDurationMinutes = dayDurationMinutes / 8;

    // Gulika Kalam segment mapping (weekday → segment number)
    // Sunday=7, Monday=6, Tuesday=5, Wednesday=4, Thursday=3, Friday=2, Saturday=1
    const gulikaMapping = {
        7: 7, // Sunday: 7th segment
        1: 6, // Monday: 6th segment
        2: 5, // Tuesday: 5th segment
        3: 4, // Wednesday: 4th segment
        4: 3, // Thursday: 3rd segment
        5: 2, // Friday: 2nd segment
        6: 1, // Saturday: 1st segment
    };

    const weekday = sunriseTime.weekday; // 1=Monday, 7=Sunday
    const gulikaSegment = gulikaMapping[weekday];

    const gulikaStartTime = sunriseTime.plus({ minutes: segmentDurationMinutes * (gulikaSegment - 1) });
    const gulikaEndTime = gulikaStartTime.plus({ minutes: segmentDurationMinutes });

    return {
        start: gulikaStartTime.toFormat('HH:mm:ss'),
        end: gulikaEndTime.toFormat('HH:mm:ss')
    };
};

module.exports = calculateGulikaKalam;
