// lib/utils.js
const { DateTime } = require("luxon");

const convertToLocalTime = (date, timezone) => {
    return DateTime.fromISO(date, { zone: timezone });
};

const formatTime = (hours, minutes) => {
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const getWeekday = (date, timezone) => {
    return convertToLocalTime(date, timezone).weekdayLong; // Returns Monday, Tuesday, etc.
};

module.exports = { convertToLocalTime, formatTime, getWeekday };
