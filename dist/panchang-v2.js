"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFullPanchang = void 0;
const tithi_1 = require("./core/tithi");
const nakshatra_1 = require("./core/nakshatra");
const yoga_1 = require("./core/yoga");
const karana_1 = require("./core/karana");
const rashi_1 = require("./core/rashi");
const constants_1 = require("./core/constants");
const muhurat_1 = require("./timings/muhurat");
const kalam_1 = require("./timings/kalam");
const MOON_PHASES = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
];
function getMoonPhaseName(tithiIndex) {
    // Derive phase from tithi number (more accurate than angular division)
    // Tithi 0 = Shukla Pratipad (just after new moon)
    // Tithi 14 = Purnima (full moon)
    // Tithi 15 = Krishna Pratipad (just after full moon)
    // Tithi 29 = Amavasya (new moon)
    if (tithiIndex <= 0)
        return 'New Moon';
    if (tithiIndex <= 3)
        return 'Waxing Crescent';
    if (tithiIndex <= 6)
        return 'First Quarter';
    if (tithiIndex <= 10)
        return 'Waxing Gibbous';
    if (tithiIndex <= 14)
        return 'Full Moon';
    if (tithiIndex <= 18)
        return 'Waning Gibbous';
    if (tithiIndex <= 21)
        return 'Last Quarter';
    if (tithiIndex <= 25)
        return 'Waning Crescent';
    return 'New Moon';
}
const RITUS = [
    { vedic: 'Vasanta', english: 'Spring' },
    { vedic: 'Grishma', english: 'Summer' },
    { vedic: 'Varsha', english: 'Monsoon' },
    { vedic: 'Sharad', english: 'Autumn' },
    { vedic: 'Hemanta', english: 'Pre-Winter' },
    { vedic: 'Shishira', english: 'Winter' },
];
const SOLAR_MONTHS = [
    'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
    'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];
const SAMVATSARS = [
    'Prabhava', 'Vibhava', 'Shukla', 'Pramodoota', 'Prajothpatti',
    'Angirasa', 'Srimukha', 'Bhava', 'Yuva', 'Dhata',
    'Ishvara', 'Bahudhanya', 'Pramathi', 'Vikrama', 'Vrisha',
    'Chitrabhanu', 'Svabhanu', 'Tarana', 'Parthiva', 'Vyaya',
    'Sarvajit', 'Sarvadhari', 'Virodhi', 'Vikrita', 'Khara',
    'Nandana', 'Vijaya', 'Jaya', 'Manmatha', 'Durmukhi',
    'Hevilambi', 'Vilambi', 'Vikari', 'Sharvari', 'Plava',
    'Shubhakrit', 'Shobhakrit', 'Krodhi', 'Vishvavasu', 'Parabhava',
    'Plavanga', 'Kilaka', 'Saumya', 'Sadharana', 'Virodhikrit',
    'Paridhaavi', 'Pramadicha', 'Ananda', 'Rakshasa', 'Nala',
    'Pingala', 'Kalayukti', 'Siddharthi', 'Raudri', 'Durmathi',
    'Dundubhi', 'Rudhirodgari', 'Raktakshi', 'Krodhana', 'Akshaya',
];
function calculateDurations(sunriseStr, sunsetStr) {
    const [sh, sm] = sunriseStr.split(':').map(Number);
    const [eh, em] = sunsetStr.split(':').map(Number);
    const sunriseMin = sh * 60 + sm;
    const sunsetMin = eh * 60 + em;
    const dayMins = sunsetMin - sunriseMin;
    const nightMins = 1440 - dayMins;
    const midMins = sunriseMin + Math.floor(dayMins / 2);
    const fmtDuration = (mins) => {
        const h = Math.floor(mins / 60);
        const m = mins % 60;
        return `${h}h ${String(m).padStart(2, '0')}m`;
    };
    const fmtTime = (mins) => {
        const h = mins % 1440;
        const hh = Math.floor(h / 60);
        const mm = h % 60;
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };
    return {
        dinamana: fmtDuration(dayMins),
        ratrimana: fmtDuration(nightMins),
        madhyahna: fmtTime(midMins),
    };
}
function formatTimeHHMM(date, timezone) {
    if (!date)
        return '';
    return date.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
}
function calculateFullPanchang(date, latitude, longitude, timezone) {
    // Use noon local time as an initial reference for sunrise/sunset calculation.
    // After computing sunrise, we re-compute planetary positions at sunrise
    // to match Drik Panchang convention (prevailing tithi/nakshatra at sunrise).
    const noonDate = typeof date === 'string'
        ? new Date(date + 'T12:00:00')
        : date;
    const location = { latitude, longitude, timezone };
    // Helper: compute sidereal sun/moon longitudes for a given Date
    function computeLongitudes(dt, ayan) {
        try {
            const { Ephemeris } = require('./calculations/ephemeris');
            const eph = new Ephemeris();
            const sunT = eph.calculatePosition(dt, 'Sun');
            const moonT = eph.calculatePosition(dt, 'Moon');
            return {
                sunLon: (0, constants_1.normalizeAngle)(sunT.longitude - ayan),
                moonLon: (0, constants_1.normalizeAngle)(moonT.longitude - ayan),
            };
        }
        catch {
            // Fallback: Jean Meeus low-precision
            const jd = dt.getTime() / 86400000 + 2440587.5;
            const T = (jd - 2451545.0) / 36525;
            const L0 = (0, constants_1.normalizeAngle)(280.46646 + 36000.76983 * T);
            const M = (0, constants_1.normalizeAngle)(357.52911 + 35999.05029 * T);
            const Mrad = M * Math.PI / 180;
            const C = (1.914602 - 0.004817 * T) * Math.sin(Mrad)
                + 0.019993 * Math.sin(2 * Mrad)
                + 0.000289 * Math.sin(3 * Mrad);
            const sLon = (0, constants_1.normalizeAngle)((0, constants_1.normalizeAngle)(L0 + C) - ayan);
            const Lm = (0, constants_1.normalizeAngle)(218.3165 + 481267.8813 * T);
            const Mm = (0, constants_1.normalizeAngle)(134.9634 + 477198.8676 * T);
            const F = (0, constants_1.normalizeAngle)(93.2721 + 483202.0175 * T);
            const MmRad = Mm * Math.PI / 180;
            const FRad = F * Math.PI / 180;
            const moonCorr = 6.289 * Math.sin(MmRad)
                - 1.274 * Math.sin(MmRad - 2 * FRad)
                + 0.658 * Math.sin(2 * FRad)
                - 0.186 * Math.sin(Mrad)
                - 0.114 * Math.sin(2 * FRad)
                + 0.059 * Math.sin(2 * MmRad)
                - 0.057 * Math.sin(MmRad - 2 * FRad + Mrad)
                + 0.053 * Math.sin(MmRad + 2 * FRad)
                + 0.046 * Math.sin(2 * FRad - Mrad)
                + 0.041 * Math.sin(MmRad - Mrad);
            const mLon = (0, constants_1.normalizeAngle)((0, constants_1.normalizeAngle)(Lm + moonCorr) - ayan);
            return { sunLon: sLon, moonLon: mLon };
        }
    }
    // Try to use Swiss Ephemeris, fall back to SunCalc-based calculations
    let sunLon = 0, moonLon = 0;
    let sunrise = null, sunset = null;
    let moonrise = null, moonset = null;
    let ayanamsa = 24.17; // Default Lahiri approximation for 2026
    try {
        const { Ephemeris } = require('./calculations/ephemeris');
        const ephemeris = new Ephemeris();
        ayanamsa = ephemeris.calculate_lahiri_ayanamsa(noonDate);
    }
    catch {
        // Use default ayanamsa
    }
    // Get sunrise/sunset first
    try {
        const SunCalc = require('suncalc');
        const times = SunCalc.getTimes(noonDate, latitude, longitude);
        sunrise = times.sunrise;
        sunset = times.sunset;
        const moonTimes = SunCalc.getMoonTimes(noonDate, latitude, longitude);
        moonrise = moonTimes.rise ?? null;
        moonset = moonTimes.set ?? null;
    }
    catch {
        // No SunCalc available
    }
    // Compute longitudes at SUNRISE (Drik Panchang convention: prevailing tithi at sunrise)
    const sunriseDate = sunrise ?? noonDate;
    const lons = computeLongitudes(sunriseDate, ayanamsa);
    sunLon = lons.sunLon;
    moonLon = lons.moonLon;
    const tithi = (0, tithi_1.calculateTithi)(sunLon, moonLon);
    const nakshatra = (0, nakshatra_1.calculateNakshatra)(moonLon);
    const yoga = (0, yoga_1.calculateYoga)(sunLon, moonLon);
    const karana = (0, karana_1.calculateKarana)(sunLon, moonLon);
    const moonSign = (0, rashi_1.calculateRashi)(moonLon);
    const sunSign = (0, rashi_1.calculateRashi)(sunLon);
    // ── Transition detection with binary search for exact time ──────────────
    // Check sunrise vs sunset. If tithi/nakshatra/yoga/karana changed,
    // binary-search for the exact transition moment.
    function findTransitionTime(startDate, endDate, getValueFn, startValue, maxIterations = 14) {
        let lo = startDate.getTime();
        let hi = endDate.getTime();
        for (let i = 0; i < maxIterations; i++) {
            const mid = Math.floor((lo + hi) / 2);
            const midDate = new Date(mid);
            const lons = computeLongitudes(midDate, ayanamsa);
            const val = getValueFn(midDate);
            if (val === startValue) {
                lo = mid;
            }
            else {
                hi = mid;
            }
        }
        return new Date(hi);
    }
    function formatTransitionTime(dt, tz) {
        try {
            return dt.toLocaleTimeString('en-IN', {
                timeZone: tz,
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
        }
        catch {
            const h = dt.getUTCHours();
            const m = dt.getUTCMinutes();
            return `${h % 12 || 12}:${m < 10 ? '0' + m : m} ${h < 12 ? 'AM' : 'PM'}`;
        }
    }
    let tithi2 = null;
    let nakshatra2 = null;
    let yoga2 = null;
    let karana2 = null;
    let tithiTransitionTime = '';
    let nakshatraTransitionTime = '';
    let yogaTransitionTime = '';
    let karanaTransitionTime = '';
    if (sunset) {
        try {
            const sunsetLons = computeLongitudes(sunset, ayanamsa);
            const tithiAtSunset = (0, tithi_1.calculateTithi)(sunsetLons.sunLon, sunsetLons.moonLon);
            const nakshatraAtSunset = (0, nakshatra_1.calculateNakshatra)(sunsetLons.moonLon);
            const yogaAtSunset = (0, yoga_1.calculateYoga)(sunsetLons.sunLon, sunsetLons.moonLon);
            const karanaAtSunset = (0, karana_1.calculateKarana)(sunsetLons.sunLon, sunsetLons.moonLon);
            const sunriseDate = sunrise ?? noonDate;
            if (tithiAtSunset.number !== tithi.number) {
                tithi2 = tithiAtSunset;
                const transTime = findTransitionTime(sunriseDate, sunset, (dt) => {
                    const l = computeLongitudes(dt, ayanamsa);
                    return (0, tithi_1.calculateTithi)(l.sunLon, l.moonLon).number;
                }, tithi.number);
                tithiTransitionTime = formatTransitionTime(transTime, timezone);
            }
            if (nakshatraAtSunset.number !== nakshatra.number) {
                nakshatra2 = nakshatraAtSunset;
                const transTime = findTransitionTime(sunriseDate, sunset, (dt) => {
                    const l = computeLongitudes(dt, ayanamsa);
                    return (0, nakshatra_1.calculateNakshatra)(l.moonLon).number;
                }, nakshatra.number);
                nakshatraTransitionTime = formatTransitionTime(transTime, timezone);
            }
            if (yogaAtSunset.number !== yoga.number) {
                yoga2 = yogaAtSunset;
                const transTime = findTransitionTime(sunriseDate, sunset, (dt) => {
                    const l = computeLongitudes(dt, ayanamsa);
                    return (0, yoga_1.calculateYoga)(l.sunLon, l.moonLon).number;
                }, yoga.number);
                yogaTransitionTime = formatTransitionTime(transTime, timezone);
            }
            if (karanaAtSunset.number !== karana.number) {
                karana2 = karanaAtSunset;
                const transTime = findTransitionTime(sunriseDate, sunset, (dt) => {
                    const l = computeLongitudes(dt, ayanamsa);
                    return (0, karana_1.calculateKarana)(l.sunLon, l.moonLon).number;
                }, karana.number);
                karanaTransitionTime = formatTransitionTime(transTime, timezone);
            }
        }
        catch {
            // Transition detection failed, skip
        }
    }
    // Sun Nakshatra
    const sunNak = (0, nakshatra_1.calculateNakshatra)(sunLon);
    // Ayana: Uttarayana from Makara Sankranti (Sun enters Capricorn, ~270°) to Sun at ~90° (end of Gemini)
    // Sidereal: 270°→360°→0°→90° = Uttarayana; 90°→270° = Dakshinayana
    const ayana = (sunLon >= 270 || sunLon < 90) ? 'Uttarayana' : 'Dakshinayana';
    // Ritu (season) based on Sun's sidereal sign
    // Ritu mapping (North Indian): Pisces-Aries=Vasanta, Taurus-Gemini=Grishma, etc.
    // Shift by -1 from sign number: sign 12(Pisces)→0, sign 1(Aries)→0, sign 2→1, etc.
    const rituSignMap = {
        12: 0, 1: 0,
        2: 1, 3: 1,
        4: 2, 5: 2,
        6: 3, 7: 3,
        8: 4, 9: 4,
        10: 5, 11: 5, // Shishira (Capricorn, Aquarius)
    };
    const ritu = RITUS[rituSignMap[sunSign.number] ?? 0];
    // Solar month
    const solarMonth = SOLAR_MONTHS[sunSign.number - 1];
    // Samvatsar (60-year cycle)
    // Vikram new year = Chaitra Shukla Pratipad (day after Chaitra Amavasya)
    // This falls when Sun is in Pisces (Meena) and Moon is new → Shukla Pratipad
    // Approximation: if Sun is in Pisces (sign 12) and tithi is in Shukla Paksha,
    // we're in the new Vikram year. Otherwise check if we've passed the spring new moon.
    //
    // More robust: The Vikram year changes when Chaitra Shukla Paksha begins.
    // Chaitra = lunar month when Sun is in Pisces/Aries.
    // If tithi is Shukla (waxing) and Sun is in Pisces → new year has started.
    // If tithi is Krishna (waning) and Sun is in Pisces → still old year (Chaitra Krishna = Phalguna Amanta).
    const gregYear = noonDate.getFullYear();
    const sunInPisces = sunSign.number === 12; // Meena
    const sunInAries = sunSign.number === 1; // Mesha
    const isShukla = tithi.paksha === 'Shukla';
    // New year starts when: Sun in Pisces + Shukla Paksha (Chaitra Shukla)
    // OR Sun has moved past Pisces into Aries+ (definitely new year)
    const newYearStarted = (sunInPisces && isShukla) ||
        (sunSign.number >= 1 && sunSign.number <= 6); // Aries through Virgo = after spring
    // But Jan-Feb is always before new year (Sun in Capricorn/Aquarius)
    const month = noonDate.getMonth();
    const isEarlyYear = month <= 1; // Jan, Feb always before Hindu new year
    const vikramSamvat = (newYearStarted && !isEarlyYear) ? gregYear + 57 : gregYear + 56;
    const shakaSamvat = (newYearStarted && !isEarlyYear) ? gregYear - 78 : gregYear - 79;
    const samvatsarIndex = ((vikramSamvat - 51) % 60 + 60) % 60;
    const samvatsar = SAMVATSARS[samvatsarIndex];
    // Use the date string to determine weekday (timezone-independent)
    const varaDateStr = typeof date === 'string' ? date : noonDate.toISOString().split('T')[0];
    const varaDate = new Date(varaDateStr + 'T12:00:00Z'); // Noon UTC — safe for any timezone
    const vara = {
        name: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][varaDate.getUTCDay()],
        number: varaDate.getUTCDay(),
    };
    const diff = (0, constants_1.normalizeAngle)(moonLon - sunLon);
    // Use SunCalc for accurate illumination when available
    let moonIllumination = Math.round(((1 - Math.cos(diff * Math.PI / 180)) / 2) * 100);
    try {
        const SunCalc = require('suncalc');
        const illum = SunCalc.getMoonIllumination(noonDate);
        moonIllumination = Math.round(illum.fraction * 100);
    }
    catch { }
    ;
    const sunriseStr = formatTimeHHMM(sunrise, timezone);
    const sunsetStr = formatTimeHHMM(sunset, timezone);
    const dateStr = noonDate.toISOString().split('T')[0];
    // Calculate auspicious muhurats and inauspicious kalams
    let auspiciousMuhurats = [];
    let inauspiciousKalams = [];
    if (sunriseStr && sunsetStr) {
        try {
            auspiciousMuhurats = (0, muhurat_1.calculateMuhurats)(sunriseStr, sunsetStr, dateStr, latitude, longitude, timezone);
        }
        catch {
            // Timing calculation failed; return empty array
        }
        try {
            inauspiciousKalams = (0, kalam_1.calculateKalams)(sunriseStr, sunsetStr, dateStr, latitude, longitude, timezone);
        }
        catch {
            // Timing calculation failed; return empty array
        }
    }
    // Dinamana / Ratrimana / Madhyahna
    const durations = (sunriseStr && sunsetStr) ? calculateDurations(sunriseStr, sunsetStr) : { dinamana: '', ratrimana: '', madhyahna: '' };
    return {
        date: dateStr,
        location: { lat: latitude, lon: longitude, timezone },
        sunrise: sunriseStr,
        sunset: sunsetStr,
        moonrise: formatTimeHHMM(moonrise, timezone),
        moonset: formatTimeHHMM(moonset, timezone),
        tithi: [
            { name: tithi.name, number: tithi.number, startTime: '', endTime: tithiTransitionTime, progress: tithi.progress },
            ...(tithi2 ? [{ name: tithi2.name, number: tithi2.number, startTime: tithiTransitionTime, endTime: '', progress: tithi2.progress }] : []),
        ],
        nakshatra: [
            { name: nakshatra.name, number: nakshatra.number, pada: nakshatra.pada, lord: nakshatra.lord, deity: nakshatra.deity, startTime: '', endTime: nakshatraTransitionTime, progress: nakshatra.progress },
            ...(nakshatra2 ? [{ name: nakshatra2.name, number: nakshatra2.number, pada: nakshatra2.pada, lord: nakshatra2.lord, deity: nakshatra2.deity, startTime: nakshatraTransitionTime, endTime: '', progress: nakshatra2.progress }] : []),
        ],
        yoga: [
            { name: yoga.name, number: yoga.number, startTime: '', endTime: yogaTransitionTime, progress: yoga.progress },
            ...(yoga2 ? [{ name: yoga2.name, number: yoga2.number, startTime: yogaTransitionTime, endTime: '', progress: yoga2.progress }] : []),
        ],
        karana: [
            { name: karana.name, number: karana.number, startTime: '', endTime: '', progress: karana.progress },
            ...(karana2 ? [{ name: karana2.name, number: karana2.number, startTime: '', endTime: '', progress: karana2.progress }] : []),
        ],
        vara,
        moonSign,
        sunSign,
        moonPhase: { name: getMoonPhaseName(tithi.tithiIndex - 1), illumination: moonIllumination },
        paksha: tithi.paksha,
        auspiciousMuhurats,
        inauspiciousKalams,
        sunNakshatra: { name: sunNak.name, number: sunNak.number, pada: sunNak.pada, lord: sunNak.lord, deity: sunNak.deity, startTime: '', endTime: '', progress: sunNak.progress },
        ayana,
        ritu,
        solarMonth,
        dinamana: durations.dinamana,
        ratrimana: durations.ratrimana,
        madhyahna: durations.madhyahna,
        samvatsar,
        vikramSamvat: vikramSamvat,
        shakaSamvat: shakaSamvat,
    };
}
exports.calculateFullPanchang = calculateFullPanchang;
