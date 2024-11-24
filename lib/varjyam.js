const { calculateMoonriseMoonset } = require("./moonriseMoonset");

const calculateVarjyam = (date, latitude, longitude, timezone) => {
    const { moonrise, moonset } = calculateMoonriseMoonset(date, latitude, longitude, timezone);

    // Assuming Varjyam occurs midway between moonrise and moonset
    const [moonriseHour, moonriseMinute] = moonrise.split(":").map(Number);
    const [moonsetHour, moonsetMinute] = moonset.split(":").map(Number);

    const startMinutes = (moonriseHour * 60 + moonriseMinute + moonsetHour * 60 + moonsetMinute) / 2;

    return {
        time: formatTime(Math.floor(startMinutes / 60), startMinutes % 60),
    };
};

module.exports = calculateVarjyam;
