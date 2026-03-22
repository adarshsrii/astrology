"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAngle = exports.getFormattedDateInfo = exports.formatTimeRangeUTC = exports.formatTimeRangeInTimezone = exports.formatTimeInTimezone = exports.formatDateInTimezone = exports.formatTimeUTC = exports.formatDateUTC = void 0;
/**
 * Utility functions for astronomical calculations
 */
const date_fns_tz_1 = require("date-fns-tz");
/**
 * Format date as UTC string (ISO format)
 * @param date Date to format
 * @returns UTC string in ISO format
 */
function formatDateUTC(date) {
    if (!date)
        return 'N/A';
    return date.toISOString();
}
exports.formatDateUTC = formatDateUTC;
/**
 * Format time as UTC time string
 * @param date Date to format
 * @returns UTC time string (HH:MM:SS format)
 */
function formatTimeUTC(date) {
    if (!date)
        return 'N/A';
    return date.toISOString().substring(11, 19); // Extract HH:MM:SS from ISO string
}
exports.formatTimeUTC = formatTimeUTC;
/**
 * Format date/time in any timezone using date-fns-tz
 * @param date Date to format
 * @param timezone IANA timezone identifier (e.g., 'America/Vancouver', 'Asia/Kolkata')
 * @param formatPattern Format pattern (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns Formatted date string in the specified timezone
 */
function formatDateInTimezone(date, timezone = 'UTC', formatPattern = 'yyyy-MM-dd HH:mm:ss') {
    if (!date)
        return 'N/A';
    try {
        return (0, date_fns_tz_1.formatInTimeZone)(date, timezone, formatPattern);
    }
    catch (error) {
        // Fallback to UTC if timezone is invalid
        return (0, date_fns_tz_1.formatInTimeZone)(date, 'UTC', formatPattern);
    }
}
exports.formatDateInTimezone = formatDateInTimezone;
/**
 * Format time only in any timezone
 * @param date Date to format
 * @param timezone IANA timezone identifier
 * @param formatPattern Time format pattern (default: 'HH:mm:ss')
 * @returns Formatted time string in the specified timezone
 */
function formatTimeInTimezone(date, timezone = 'UTC', formatPattern = 'HH:mm:ss') {
    if (!date)
        return 'N/A';
    try {
        return (0, date_fns_tz_1.formatInTimeZone)(date, timezone, formatPattern);
    }
    catch (error) {
        return (0, date_fns_tz_1.formatInTimeZone)(date, 'UTC', formatPattern);
    }
}
exports.formatTimeInTimezone = formatTimeInTimezone;
/**
 * Format date range in any timezone
 * @param startDate Start date
 * @param endDate End date
 * @param timezone IANA timezone identifier
 * @param formatPattern Format pattern for times (default: 'HH:mm:ss')
 * @returns Formatted time range string in the specified timezone
 */
function formatTimeRangeInTimezone(startDate, endDate, timezone = 'UTC', formatPattern = 'HH:mm:ss') {
    if (!startDate || !endDate)
        return 'N/A';
    const start = formatTimeInTimezone(startDate, timezone, formatPattern);
    const end = formatTimeInTimezone(endDate, timezone, formatPattern);
    return `${start} - ${end}`;
}
exports.formatTimeRangeInTimezone = formatTimeRangeInTimezone;
/**
 * Format date range as UTC strings (backward compatibility)
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted UTC time range string
 */
function formatTimeRangeUTC(startDate, endDate) {
    return formatTimeRangeInTimezone(startDate, endDate, 'UTC');
}
exports.formatTimeRangeUTC = formatTimeRangeUTC;
function getFormattedDateInfo(date, primaryTimezone = 'UTC') {
    if (!date)
        return null;
    return {
        original: date,
        utc: date.toISOString(),
        local: formatDateInTimezone(date, primaryTimezone, 'yyyy-MM-dd HH:mm:ss zzz'),
        localTime: formatTimeInTimezone(date, primaryTimezone, 'HH:mm:ss'),
        localDate: formatDateInTimezone(date, primaryTimezone, 'yyyy-MM-dd'),
        timezone: primaryTimezone,
        timestamp: date.getTime(),
        year: parseInt((0, date_fns_tz_1.formatInTimeZone)(date, primaryTimezone, 'yyyy')),
        month: parseInt((0, date_fns_tz_1.formatInTimeZone)(date, primaryTimezone, 'MM')),
        day: parseInt((0, date_fns_tz_1.formatInTimeZone)(date, primaryTimezone, 'dd'))
    };
}
exports.getFormattedDateInfo = getFormattedDateInfo;
function normalizeAngle(angle) {
    let normalized = angle % 360;
    if (normalized < 0) {
        normalized += 360;
    }
    return normalized;
}
exports.normalizeAngle = normalizeAngle;
