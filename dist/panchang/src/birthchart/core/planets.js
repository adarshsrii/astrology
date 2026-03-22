"use strict";
/**
 * Planetary Position Calculator
 * Calculate sidereal positions for all 9 Vedic grahas.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateAllPlanets = void 0;
const types_1 = require("../types");
const constants_1 = require("./constants");
const states_1 = require("./states");
// Nakshatra data (inline to avoid circular deps)
const NAKSHATRA_DATA = [
    { name: 'Ashwini', lord: 'Ketu' },
    { name: 'Bharani', lord: 'Venus' },
    { name: 'Krittika', lord: 'Sun' },
    { name: 'Rohini', lord: 'Moon' },
    { name: 'Mrigashira', lord: 'Mars' },
    { name: 'Ardra', lord: 'Rahu' },
    { name: 'Punarvasu', lord: 'Jupiter' },
    { name: 'Pushya', lord: 'Saturn' },
    { name: 'Ashlesha', lord: 'Mercury' },
    { name: 'Magha', lord: 'Ketu' },
    { name: 'Purva Phalguni', lord: 'Venus' },
    { name: 'Uttara Phalguni', lord: 'Sun' },
    { name: 'Hasta', lord: 'Moon' },
    { name: 'Chitra', lord: 'Mars' },
    { name: 'Swati', lord: 'Rahu' },
    { name: 'Vishakha', lord: 'Jupiter' },
    { name: 'Anuradha', lord: 'Saturn' },
    { name: 'Jyeshtha', lord: 'Mercury' },
    { name: 'Mula', lord: 'Ketu' },
    { name: 'Purva Ashadha', lord: 'Venus' },
    { name: 'Uttara Ashadha', lord: 'Sun' },
    { name: 'Shravana', lord: 'Moon' },
    { name: 'Dhanishtha', lord: 'Mars' },
    { name: 'Shatabhisha', lord: 'Rahu' },
    { name: 'Purva Bhadrapada', lord: 'Jupiter' },
    { name: 'Uttara Bhadrapada', lord: 'Saturn' },
    { name: 'Revati', lord: 'Mercury' },
];
function normalizeAngle(a) {
    let n = a % 360;
    if (n < 0)
        n += 360;
    return n;
}
function computeNakshatra(lon) {
    const oneNak = 360 / 27;
    const onePada = oneNak / 4;
    const norm = normalizeAngle(lon);
    const idx = Math.floor(norm / oneNak);
    const posInNak = norm - idx * oneNak;
    const pada = Math.min(Math.floor(posInNak / onePada) + 1, 4);
    const nk = NAKSHATRA_DATA[idx] || { name: 'Unknown', lord: 'Unknown' };
    return { name: nk.name, number: idx + 1, pada, lord: nk.lord };
}
/**
 * Calculate sidereal positions for all 9 grahas.
 */
function calculateAllPlanets(utcDate, ayanamsa, ephemeris) {
    const positions = [];
    // First, calculate Sun position (needed for combustion checks)
    let sunSiderealLon = 0;
    for (const graha of types_1.ALL_GRAHAS) {
        const pos = ephemeris.calculatePosition(utcDate, graha);
        const siderealLon = normalizeAngle(pos.longitude - ayanamsa);
        // Get speed via the Ephemeris speed method
        const speed = getGrahaSpeed(utcDate, graha, ephemeris);
        // Rahu & Ketu are always retrograde
        let retrograde;
        if (graha === 'Rahu' || graha === 'Ketu') {
            retrograde = true;
        }
        else {
            retrograde = speed < 0;
        }
        const signNumber = Math.floor(siderealLon / 30) + 1;
        const degreeInSign = siderealLon - (signNumber - 1) * 30;
        const nak = computeNakshatra(siderealLon);
        const dignity = (0, states_1.determineDignity)(graha, signNumber, degreeInSign);
        const symbol = (0, states_1.getDignitySymbol)(dignity);
        if (graha === 'Sun') {
            sunSiderealLon = siderealLon;
        }
        positions.push({
            name: graha,
            longitude: Math.round(siderealLon * 10000) / 10000,
            latitude: pos.latitude,
            speed: Math.round(speed * 10000) / 10000,
            retrograde,
            signName: constants_1.SIGN_NAMES[signNumber] || 'Unknown',
            signNumber,
            degreeInSign: Math.round(degreeInSign * 100) / 100,
            nakshatra: nak.name,
            nakshatraNumber: nak.number,
            nakshatraPada: nak.pada,
            nakshatraLord: nak.lord,
            dignity,
            isCombust: false,
            combustOrb: 0,
            symbol,
        });
    }
    // Now compute combustion for each planet (need Sun's position)
    for (const gp of positions) {
        if (gp.name === 'Sun') {
            sunSiderealLon = gp.longitude;
            break;
        }
    }
    for (const gp of positions) {
        const comb = (0, states_1.determineCombustion)(gp.name, gp.longitude, sunSiderealLon, gp.retrograde);
        gp.isCombust = comb.isCombust;
        gp.combustOrb = comb.orb;
    }
    return positions;
}
exports.calculateAllPlanets = calculateAllPlanets;
/**
 * Get the speed (degrees/day) for a graha.
 * Uses swe_calc_ut with SEFLG_SPEED.
 */
function getGrahaSpeed(utcDate, graha, ephemeris) {
    try {
        const result = ephemeris.calculatePositionWithSpeed(utcDate, graha);
        return result.speed;
    }
    catch {
        // Fallback speeds (mean daily motion)
        const defaultSpeeds = {
            Sun: 0.9856,
            Moon: 13.176,
            Mars: 0.524,
            Mercury: 1.383,
            Jupiter: 0.083,
            Venus: 1.602,
            Saturn: 0.034,
            Rahu: -0.053,
            Ketu: -0.053,
        };
        return defaultSpeeds[graha] || 0;
    }
}
