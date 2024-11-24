const { getWeekday } = require("../assets/utils");

const calculateGulikaKalam = (date, latitude, longitude, timezone) => {
    const weekday = getWeekday(date, timezone);

    const gulikaTimings = {
        Sunday: "06:00-07:30",
        Monday: "07:30-09:00",
        Tuesday: "09:00-10:30",
        Wednesday: "10:30-12:00",
        Thursday: "12:00-13:30",
        Friday: "13:30-15:00",
        Saturday: "15:00-16:30",
    };

    return gulikaTimings[weekday];
};

module.exports = calculateGulikaKalam;
