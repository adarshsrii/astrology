const { DateTime } = require('luxon');

// Helper function to add minutes to a given time
const addMinutesToTime = (time, minutes) => {
    return time.plus({ minutes });
};

// Function to calculate Yama Gandam times based on the day of the week
const calculateYamaGandam = (date, sunrise, sunset, timezone) => {
    // Convert sunrise and sunset to DateTime objects with the given timezone
    const sunRiseTime = DateTime.fromFormat(`${date} ${sunrise}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });
    const sunSetTime = DateTime.fromFormat(`${date} ${sunset}`, 'yyyy-MM-dd HH:mm:ss', { zone: timezone });

    // Get the day of the week using Luxon (0 - Sunday, 6 - Saturday)
    const dayOfWeek = sunRiseTime.weekday;  // Use Luxon's `weekday` property (1 - Monday, 7 - Sunday)

    // Ensure that the dayOfWeek is valid (between 1 and 7)
    if (dayOfWeek < 1 || dayOfWeek > 7) {
        throw new Error('Invalid day of the week');
    }

    // Calculate the total duration between sunrise and sunset in minutes
    const duration = sunSetTime.diff(sunRiseTime, 'minutes').minutes;

    // Each of the 8 sections will have an equal duration
    const sectionDuration = duration / 8;

    // Object mapping days to their Yama Gandam section (1 - 8)
    const dayConfig = {
        1: 4, // Monday -> 4th section
        2: 3, // Tuesday -> 3rd section
        3: 2, // Wednesday -> 2nd section
        4: 1, // Thursday -> 1st section
        5: 7, // Friday -> 7th section
        6: 6, // Saturday -> 6th section
        7: 5, // Sunday -> 5th section
    };

    // Find the section number for the current day
    const section = dayConfig[dayOfWeek];

    // Calculate the start time of Yama Gandam by adding the appropriate section's offset to sunrise
    const sectionStartTime = sunRiseTime.plus({ minutes: (section-1) * sectionDuration });

    // Calculate the end time by adding the section duration (90 minutes) to the start time
    const endTime = addMinutesToTime(sectionStartTime, 90);

    return {
        start: sectionStartTime.toISO(),
        end: endTime.toISO()
    };
};

// Export the function
module.exports = calculateYamaGandam;
