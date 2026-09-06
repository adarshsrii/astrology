const {DateTime} = require("luxon");

const calculateChoghadiya = (date, sunrise, sunset, timezone) => {
    // Read the clock times AS they stand in `timezone`. Using `new Date(str)` here
    // parsed them in the machine's own zone and setZone then shifted the instant, so
    // the same sunrise produced different Choghadiya on a phone in Nepal (correct),
    // India (+15 min) and the US (+9h45m). Reported by a jatak whose printed patro
    // disagreed with the app. fromISO with an explicit zone interprets, not converts.
    const sunriseTime = DateTime.fromISO(`${date}T${sunrise}`, {zone: timezone});
    const sunsetTime = DateTime.fromISO(`${date}T${sunset}`, {zone: timezone});

    if (!sunriseTime.isValid || !sunsetTime.isValid) {
        throw new Error(`Invalid sunrise/sunset for ${date} in ${timezone}`);
    }

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

    // ponytail: tomorrow's sunrise is assumed to fall at the same clock time as
    // today's. It drifts about a minute a day, so night slots can be ~1 min out.
    // Upgrade path: take next-day sunrise as an argument when a caller has it.
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
