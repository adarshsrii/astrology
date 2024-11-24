const {DateTime} = require("luxon");

const calculateChoghadiya = (date, sunrise, sunset, timezone) => {
    // Convert sunrise and sunset to Luxon DateTime objects
    const sunriseTime = DateTime.fromJSDate(new Date(`${date}T${sunrise}`)).setZone(timezone);
    const sunsetTime = DateTime.fromJSDate(new Date(`${date}T${sunset}`)).setZone(timezone);

    // Calculate the weekday based on the provided date
    const weekday = sunriseTime.toFormat('ccc'); // e.g., "Sun", "Mon", "Tue", etc.

    // Choghadiya sequences for day and night
    const dayChoghadiyaTypes = {
        Sun: ['Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg'],
        Mon: ['Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit'],
        Tue: ['Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog'],
        Wed: ['Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh'],
        Thu: ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'],
        Fri: ['Char', 'Labh', 'Amrit', 'Kaal', 'Shubh', 'Rog', 'Udveg', 'Char'],
        Sat: ['Kaal', 'Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal']
    };

    const nightChoghadiyaTypes = {
        Sun: ['Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh'],
        Mon: ['Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char'],
        Tue: ['Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal'],
        Wed: ['Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg'],
        Thu: ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'],
        Fri: ['Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog'],
        Sat: ['Labh', 'Udveg', 'Shubh', 'Amrit', 'Char', 'Rog', 'Kaal', 'Labh']
    };

    // Get the sequences for the current weekday
    const daySequence = dayChoghadiyaTypes[weekday];
    const nightSequence = nightChoghadiyaTypes[weekday];

    if (!daySequence || !nightSequence) {
        throw new Error(`Invalid weekday: ${weekday}`);
    }

    // Calculate durations
    const dayDuration = sunsetTime.diff(sunriseTime, 'minutes').minutes;
    const choghadiyaDuration = dayDuration / 8;

    const nextDaySunriseTime = sunriseTime.plus({days: 1});
    const nightDuration = nextDaySunriseTime.diff(sunsetTime, 'minutes').minutes;
    const nightChoghadiyaDuration = nightDuration / 8;

    // Initialize outputs
    const daytimeChoghadiyas = [];
    const nighttimeChoghadiyas = [];

    let currentStartTime = sunriseTime;

    // Calculate day Choghadiya timings
    for (let i = 0; i < 8; i++) {
        let startTime = currentStartTime.toFormat('HH:mm:ss');
        let endTime = currentStartTime.plus({minutes: choghadiyaDuration}).toFormat('HH:mm:ss');

        daytimeChoghadiyas.push({
            type: daySequence[i],
            start: startTime,
            end: endTime
        });

        currentStartTime = currentStartTime.plus({minutes: choghadiyaDuration});
    }

    currentStartTime = sunsetTime;

    // Calculate night Choghadiya timings
    for (let i = 0; i < 8; i++) {
        let startTime = currentStartTime.toFormat('HH:mm:ss');
        let endTime = currentStartTime.plus({minutes: nightChoghadiyaDuration}).toFormat('HH:mm:ss');

        nighttimeChoghadiyas.push({
            type: nightSequence[i],
            start: startTime,
            end: endTime
        });

        currentStartTime = currentStartTime.plus({minutes: nightChoghadiyaDuration});
    }

    return {
        daytimeChoghadiyas,
        nighttimeChoghadiyas,
        auspicious: ['Amrit', 'Shubh', 'Labh'],
        mild_auspicious: ['Char'],
        inauspicious: ['Rog', 'Kaal', 'Udveg']
    };
};

module.exports = calculateChoghadiya;
