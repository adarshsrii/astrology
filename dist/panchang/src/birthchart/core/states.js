"use strict";
/**
 * Planetary Dignity & Combustion
 * Determines the state of a graha based on its position.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineCombustion = exports.getDignitySymbol = exports.determineDignity = void 0;
const constants_1 = require("./constants");
// ── Dignity ──────────────────────────────────────────────────────────────────
/**
 * Determine the dignity (state) of a planet in a given sign and degree.
 * Priority order: peak_exalted > peak_debilitated > exalted > debilitated > moolatrikona > own_sign > neutral
 */
function determineDignity(planet, signNumber, degreeInSign) {
    const exalt = constants_1.EXALTATION_TABLE[planet];
    const debi = constants_1.DEBILITATION_TABLE[planet];
    const moola = constants_1.MOOLATRIKONA_TABLE[planet];
    const ownSigns = constants_1.OWN_SIGNS[planet];
    // Peak exaltation: exact sign + within 1° of peak degree
    if (signNumber === exalt.sign && Math.abs(degreeInSign - exalt.peakDegree) < 1) {
        return 'peak_exalted';
    }
    // Peak debilitation: exact sign + within 1° of peak degree
    if (signNumber === debi.sign && Math.abs(degreeInSign - debi.peakDegree) < 1) {
        return 'peak_debilitated';
    }
    // Exalted: anywhere in the exaltation sign
    if (signNumber === exalt.sign) {
        return 'exalted';
    }
    // Debilitated: anywhere in the debilitation sign
    if (signNumber === debi.sign) {
        return 'debilitated';
    }
    // Moolatrikona: in the moolatrikona sign and within the degree range
    if (signNumber === moola.sign &&
        degreeInSign >= moola.fromDegree &&
        degreeInSign <= moola.toDegree) {
        return 'moolatrikona';
    }
    // Own sign
    if (ownSigns.includes(signNumber)) {
        return 'own_sign';
    }
    return 'neutral';
}
exports.determineDignity = determineDignity;
/**
 * Get the display symbol for a dignity state.
 */
function getDignitySymbol(dignity) {
    return constants_1.DIGNITY_SYMBOLS[dignity] || '';
}
exports.getDignitySymbol = getDignitySymbol;
/**
 * Determine if a planet is combust (too close to the Sun).
 * Sun, Rahu, and Ketu are never combust.
 *
 * @param planet - The graha name
 * @param planetLon - Sidereal longitude of the planet (0-360)
 * @param sunLon - Sidereal longitude of the Sun (0-360)
 * @param isRetrograde - Whether the planet is retrograde
 */
function determineCombustion(planet, planetLon, sunLon, isRetrograde) {
    // Sun, Rahu, Ketu are never combust
    if (constants_1.NEVER_COMBUST.includes(planet)) {
        return { isCombust: false, orb: 0 };
    }
    const orbEntry = constants_1.COMBUSTION_ORBS[planet];
    if (!orbEntry) {
        return { isCombust: false, orb: 0 };
    }
    // Calculate angular distance (shortest arc)
    let diff = Math.abs(planetLon - sunLon);
    if (diff > 180) {
        diff = 360 - diff;
    }
    const threshold = isRetrograde ? orbEntry.retrograde : orbEntry.direct;
    return {
        isCombust: diff <= threshold,
        orb: Math.round(diff * 100) / 100,
    };
}
exports.determineCombustion = determineCombustion;
