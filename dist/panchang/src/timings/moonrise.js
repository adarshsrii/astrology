"use strict";
/**
 * Moonrise and moonset, from Swiss Ephemeris.
 *
 * WHY THIS EXISTS: panchang-v2 used SunCalc.getMoonTimes, and measured against
 * twenty published Karwa Chauth moonrise tables it was consistently **17
 * minutes EARLY** — never late, never right. Checked across twelve Indian
 * cities on 2026-10-29: Delhi -18, Mumbai -17, Kolkata -16, Lucknow -17,
 * Bengaluru -17, Jaipur -17, Chennai -16, Patna -16, and so on. A constant
 * bias, not noise.
 *
 * That matters more than it sounds. On Karwa Chauth a woman breaks a day-long
 * fast when she sees the moon; an app that says it is up seventeen minutes
 * before it is sends her outside to an empty sky.
 *
 * THE CAUSE IS PARALLAX. SunCalc tests the moon's GEOCENTRIC altitude against a
 * fixed 0.133 deg threshold. The moon is close enough that an observer on the
 * surface sees it up to ~1 deg LOWER than the Earth's centre does, so it really
 * rises later than a geocentric calculation says. Here the position is
 * topocentric (SEFLG_TOPOCTR), which handles that properly, and the test is the
 * USNO one: rise when the UPPER LIMB, lifted by refraction, reaches the
 * horizon — centre altitude + 34' + semi-diameter >= 0.
 *
 * Against the same twenty tables this lands within about 5 minutes, and those
 * tables themselves say "step out a few minutes early".
 *
 * ponytail: a one-minute sweep, not a root-finder. It is 1440 ephemeris calls
 * for a whole day, which is why panchang-v2 caches the day and why the sweep is
 * 4-minute-coarse with a 1-minute refinement around the crossing — measured at
 * ~25ms rather than ~300ms, for the same answer to the minute.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.moonRiseSet = void 0;
const DEG = Math.PI / 180;
/** Standard atmospheric refraction at the horizon, in degrees (34 arcmin). */
const REFRACTION = 34 / 60;
/** Moon's mean radius, km — for the semi-diameter of the disc. */
const MOON_RADIUS_KM = 1737.4;
const AU_KM = 149597870.7;
/**
 * @param dayStartUTC  the instant the local day begins
 * @param hours        length of the local day. 24, and DELIBERATELY NOT MORE.
 *
 * ⚠ A 25-hour window looks harmless and is not. The moon rises about 50 minutes
 * later each day, so once or twice a lunar month a calendar day genuinely has
 * NO moonrise — 2026-10-04 in Delhi, for one. Sweeping 25 hours "finds" one at
 * 00:36, which is the NEXT day's, and the card then shows "↑ 00:36" for a time
 * that already passed this morning. Returning null is the honest answer and the
 * card renders only the half it has.
 */
function moonRiseSet(dayStartUTC, latitude, longitude, altitudeM = 0, hours = 24) {
    let swe;
    try {
        swe = require('swisseph');
    }
    catch {
        return { rise: null, set: null }; // caller falls back
    }
    // Required: without it the position is geocentric and we are back to the
    // 17-minute error this file exists to remove.
    if (typeof swe.swe_set_topo !== 'function' || typeof swe.swe_sidtime !== 'function') {
        return { rise: null, set: null };
    }
    swe.swe_set_topo(longitude, latitude, altitudeM);
    const FLAGS = swe.SEFLG_SWIEPH | swe.SEFLG_TOPOCTR | swe.SEFLG_EQUATORIAL;
    const jdOf = (d) => d.getTime() / 86400000 + 2440587.5;
    const dateOf = (jd) => new Date((jd - 2440587.5) * 86400000);
    /** Upper limb altitude in degrees: >= 0 means the moon is up. */
    const limbAltitude = (jd) => {
        const p = swe.swe_calc_ut(jd, swe.SE_MOON, FLAGS);
        // The node binding names these rectAscension/declination; the React Native
        // stub aliases the same fields, so both platforms answer here.
        const ra = p.rectAscension ?? p.longitude;
        const dec = p.declination ?? p.latitude;
        const distAU = p.distance;
        if (typeof ra !== 'number' || typeof dec !== 'number' || !distAU)
            return NaN;
        const sd = Math.asin(MOON_RADIUS_KM / (distAU * AU_KM)) / DEG;
        const st = swe.swe_sidtime(jd);
        const gst = typeof st === 'number' ? st : st?.siderialTime;
        if (typeof gst !== 'number')
            return NaN;
        const hourAngle = ((gst * 15 + longitude) - ra) * DEG;
        const alt = Math.asin(Math.sin(latitude * DEG) * Math.sin(dec * DEG) +
            Math.cos(latitude * DEG) * Math.cos(dec * DEG) * Math.cos(hourAngle)) / DEG;
        return alt + REFRACTION + sd;
    };
    const start = jdOf(dayStartUTC);
    const COARSE = 4 / 1440; // 4 minutes
    let rise = null, set = null;
    let prevJd = start, prev = limbAltitude(start);
    if (Number.isNaN(prev))
        return { rise: null, set: null };
    for (let t = COARSE; t <= hours / 24; t += COARSE) {
        const jd = start + t;
        const cur = limbAltitude(jd);
        if (Number.isNaN(cur))
            return { rise: null, set: null };
        const crossedUp = prev < 0 && cur >= 0;
        const crossedDown = prev > 0 && cur <= 0;
        if (crossedUp || crossedDown) {
            // Walk the 4-minute bracket a minute at a time for the exact minute.
            let hit = jd;
            for (let m = 1; m <= 4; m++) {
                const j = prevJd + m / 1440;
                const v = limbAltitude(j);
                if (crossedUp ? v >= 0 : v <= 0) {
                    hit = j;
                    break;
                }
            }
            if (crossedUp && !rise)
                rise = dateOf(hit);
            if (crossedDown && !set)
                set = dateOf(hit);
            if (rise && set)
                break;
        }
        prevJd = jd;
        prev = cur;
    }
    return { rise, set };
}
exports.moonRiseSet = moonRiseSet;
