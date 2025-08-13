const {DateTime} = require("luxon");

const calculateBioRhythms = (current_date, date_of_birth, timezone, daysToDisplay) => {
    // Parse input dates with the specified timezone
    const now = DateTime.fromISO(current_date, { zone: timezone });
    const dob = DateTime.fromISO(date_of_birth, { zone: timezone });

    // Calculate survival days
    const survivalDays = Math.floor(now.diff(dob, "days").days);

    // Helper function to calculate biorhythm value
    const calculateCycleValue = (days, period) => {
        return Math.sin((2 * Math.PI * days) / period);
    };

    // Helper function to scale biorhythm value to range -100 to 100
    const scaleValue = (value) => Math.round(value * 100);

    // Biorhythm panchang configuration
    const biorhythmCycles = [
        {
            label: "Physical",
            period: 23,
            borderColor: "#FF0000", // Hex color for red
            description: "Represents your physical energy, strength, and stamina."
        },
        {
            label: "Emotional",
            period: 28,
            borderColor: "#0000FF", // Hex color for blue
            description: "Reflects your emotional stability, mood, and sensitivity."
        },
        {
            label: "Intellectual",
            period: 33,
            borderColor: "#00FF00", // Hex color for green
            description: "Indicates your cognitive ability, problem-solving skills, and memory."
        },
        {
            label: "Intuitive",
            period: 38,
            borderColor: "#800080", // Hex color for purple
            description: "Shows your intuition, creativity, and instinctive decision-making."
        }
    ];

    // Generate panchang for the specified number of days
    const data = biorhythmCycles.map((cycle) => {
        const cycleData = Array.from({ length: daysToDisplay }, (_, index) => {
            const day = survivalDays + index; // Increment days for the given range
            const rawValue = calculateCycleValue(day, cycle.period);
            return {
                dayOffset: index, // Days from the current date
                value: scaleValue(rawValue)
            };
        });

        return {
            label: cycle.label,
            borderColor: cycle.borderColor,
            description: cycle.description,
            data: cycleData
        };
    });

    return {
        survivalDays,
        data
    };
};


module.exports = calculateBioRhythms;
