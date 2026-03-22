"use strict";
/**
 * Birth Chart Orchestrator
 * The main entry point that ties together all birth chart modules.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateBirthChart = void 0;
const ephemeris_1 = require("../calculations/ephemeris");
const ascendant_1 = require("./core/ascendant");
const planets_1 = require("./core/planets");
const houses_1 = require("./core/houses");
const chart_layout_1 = require("./layout/chart-layout");
/**
 * Calculate a complete birth chart (Kundli).
 *
 * @param birthData - Birth date, time, location, timezone
 * @param options - Ayanamsa and house system preferences
 * @returns Complete BirthChartResult
 */
function calculateBirthChart(birthData, options) {
    const ayanamsaType = options?.ayanamsa || 'lahiri';
    const houseSystem = options?.houseSystem || 'whole_sign';
    // 1. Parse birth date/time to UTC
    const utcDate = parseBirthDateTime(birthData.date, birthData.time, birthData.timezone);
    // 2. Create Ephemeris instance
    const ephemeris = new ephemeris_1.Ephemeris();
    try {
        // 3. Get ayanamsa value
        const ayanamsa = getAyanamsaValue(utcDate, ayanamsaType, ephemeris);
        // 4. Calculate Julian Day for metadata
        const jd = dateToJulianDay(utcDate);
        // 5. Calculate ascendant + house cusps
        const { lagna, cusps } = (0, ascendant_1.calculateLagna)(utcDate, birthData.latitude, birthData.longitude, ayanamsa, houseSystem, ephemeris);
        // 6. Calculate all 9 planet positions
        const planets = (0, planets_1.calculateAllPlanets)(utcDate, ayanamsa, ephemeris);
        // 7. Build houses
        let houses = (0, houses_1.calculateHouses)(lagna.signNumber, houseSystem, cusps);
        // 8. Assign planets to houses
        const assignment = (0, houses_1.assignPlanetsToHouses)(planets, lagna.signNumber, houseSystem);
        houses = (0, houses_1.populateHousePlanets)(houses, planets, assignment);
        // 9. Generate chart layouts
        const layouts = (0, chart_layout_1.generateChartLayouts)(houses);
        // 10. Assemble result
        const result = {
            birthData,
            ayanamsa: {
                type: ayanamsaType,
                degree: Math.round(ayanamsa * 10000) / 10000,
            },
            lagna,
            planets,
            houses,
            layout: {
                northIndian: layouts.northIndian,
                southIndian: layouts.southIndian,
                western: layouts.western,
            },
            meta: {
                calculatedAt: new Date().toISOString(),
                houseSystem,
                julianDay: jd,
                utcDate: utcDate.toISOString(),
            },
        };
        return result;
    }
    finally {
        ephemeris.cleanup();
    }
}
exports.calculateBirthChart = calculateBirthChart;
// ── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Parse birth date + time + timezone into a UTC Date object.
 *
 * Input: "2000-01-01", "04:30", "Asia/Kolkata"
 * Asia/Kolkata is UTC+5:30, so UTC = 2000-01-01 04:30 - 5:30 = 1999-12-31 23:00
 */
function parseBirthDateTime(dateStr, timeStr, timezone) {
    // Build a local datetime string
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute] = timeStr.split(':').map(Number);
    // Try to use Intl to resolve the timezone offset
    try {
        // Create a date in UTC first
        const tentativeUtc = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
        // Get the offset of the target timezone at this tentative moment
        const offsetMinutes = getTimezoneOffsetMinutes(tentativeUtc, timezone);
        // Adjust: local time = UTC + offset, so UTC = local - offset
        const utcMs = tentativeUtc.getTime() - offsetMinutes * 60000;
        return new Date(utcMs);
    }
    catch {
        // Fallback: treat as UTC
        console.warn(`Could not resolve timezone "${timezone}", treating as UTC`);
        return new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0));
    }
}
/**
 * Get timezone offset in minutes (positive = east of UTC).
 * Uses Intl.DateTimeFormat to resolve IANA timezone names.
 */
function getTimezoneOffsetMinutes(refDate, timezone) {
    try {
        // Format the date in the target timezone and in UTC, then diff
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        });
        const parts = formatter.formatToParts(refDate);
        const get = (type) => {
            const p = parts.find(p => p.type === type);
            return p ? parseInt(p.value, 10) : 0;
        };
        const localYear = get('year');
        const localMonth = get('month');
        const localDay = get('day');
        let localHour = get('hour');
        // Handle midnight edge case (hour12:false gives '24' in some locales)
        if (localHour === 24)
            localHour = 0;
        const localMinute = get('minute');
        const localSecond = get('second');
        const localMs = Date.UTC(localYear, localMonth - 1, localDay, localHour, localMinute, localSecond);
        const utcMs = Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth(), refDate.getUTCDate(), refDate.getUTCHours(), refDate.getUTCMinutes(), refDate.getUTCSeconds());
        return Math.round((localMs - utcMs) / 60000);
    }
    catch {
        // Common offsets fallback
        const offsets = {
            'Asia/Kolkata': 330,
            'Asia/Calcutta': 330,
            'UTC': 0,
            'America/New_York': -300,
            'America/Los_Angeles': -480,
            'Europe/London': 0,
        };
        return offsets[timezone] || 0;
    }
}
/**
 * Get ayanamsa degree for the given date and type.
 */
function getAyanamsaValue(utcDate, type, ephemeris) {
    if (type === 'lahiri') {
        return ephemeris.calculate_lahiri_ayanamsa(utcDate);
    }
    // KP (Krishnamurti) — id = 5
    const kpInfo = ephemeris.getSpecificAyanamsa(utcDate, 5);
    if (kpInfo) {
        return kpInfo.degree;
    }
    // Fallback to Lahiri
    return ephemeris.calculate_lahiri_ayanamsa(utcDate);
}
/**
 * Convert a Date to Julian Day number.
 */
function dateToJulianDay(date) {
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day + hour / 24 + b - 1524.5;
}
