const { DateTime } = require('luxon');

// Helper function to add minutes to a given time
const addMinutesToTime = (time, minutes) => {
    return time.plus({ minutes });
};

// Helper function to add hours and minutes to a given time
const addTime = (time, hours, minutes) => {
    return time.plus({ hours, minutes });
};

// Function to get Dur Muhurtam times based on the day of the week
const calculateDurMuhurtam = (date, sunrise, sunset, timezone) => {
    // Convert sunrise and sunset to DateTime objects with the given timezone
    const sunRiseTime = DateTime.fromFormat(`${date} ${sunrise}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });
    const sunSetTime = DateTime.fromFormat(`${date} ${sunset}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });

    // Get the day of the week using Luxon (0 - Sunday, 6 - Saturday)
    const dayOfWeek = sunRiseTime.weekday;  // Use Luxon's `weekday` property (1 - Monday, 7 - Sunday)

    // Object mapping days to their Dur Muhurtam time configurations
    const dayConfig = {
        7: [{ start: addTime(sunRiseTime, 10, 24), duration: 48 }], // Sunday
        1: [
            { start: addTime(sunRiseTime, 6, 24), duration: 48 },   // Monday 1st period
            { start: addTime(sunRiseTime, 8, 48), duration: 48 },   // Monday 2nd period
        ],
        2: [
            { start: addTime(sunRiseTime, 2, 24), duration: 48 },   // Tuesday 1st period
            { start: addTime(sunSetTime, 5, 36), duration: 48 },    // Tuesday 2nd period
        ],
        3: [{ start: addTime(sunRiseTime, 5, 36), duration: 48 }], // Wednesday
        4: [
            { start: addTime(sunRiseTime, 4, 0), duration: 48 },    // Thursday 1st period
            { start: addTime(sunRiseTime, 8, 48), duration: 48 },   // Thursday 2nd period
        ],
        5: [
            { start: addTime(sunRiseTime, 2, 24), duration: 48 },   // Friday 1st period
            { start: addTime(sunRiseTime, 8, 48), duration: 48 },   // Friday 2nd period
        ],
        6: [{ start: sunRiseTime, duration: 96 }], // Saturday (1 hour 36 minutes)
    };

    // If it's Saturday (dayOfWeek = 6), we calculate the end time separately
    if (dayOfWeek === 6) {
        const startTime = sunRiseTime;
        const endTime = addMinutesToTime(startTime, 96); // 1 hour 36 minutes
        return [{ start: startTime.toISO(), end: endTime.toISO() }];
    }

    // Otherwise, calculate the start and end times for each period
    const periods = dayConfig[dayOfWeek].map(({ start, duration }) => {
        const endTime = addMinutesToTime(start, duration);
        return { start: start.toISO(), end: endTime.toISO() };
    });

    return periods;
};

// Export the function
module.exports = calculateDurMuhurtam;
