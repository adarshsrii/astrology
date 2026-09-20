"use strict";
/**
 * Rashi (sign) lordship — THE single source of truth.
 *
 * This table used to live privately in two places that could drift apart:
 * SIGN_LORD in analysis/yogas.ts and RASHI_LORD in analysis/ashtakoot.ts.
 * Both now import from here; do not re-declare it anywhere else.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignName = exports.getHouseLords = exports.getSignLord = exports.SIGN_LORDS = void 0;
const constants_1 = require("./constants");
const houses_1 = require("./houses");
/** Sign number (1 = Aries) → ruling graha. */
exports.SIGN_LORDS = {
    1: 'Mars',
    2: 'Venus',
    3: 'Mercury',
    4: 'Moon',
    5: 'Sun',
    6: 'Mercury',
    7: 'Venus',
    8: 'Mars',
    9: 'Jupiter',
    10: 'Saturn',
    11: 'Saturn',
    12: 'Jupiter', // Pisces
};
/**
 * Lord of a sign. Accepts any integer and wraps it to 1-12, so callers doing
 * their own "+6 signs from here" arithmetic cannot hand us a 13 and get undefined.
 *
 * ponytail: classical (Parashari) lordship only — Rahu/Ketu are co-lords of
 * Aquarius/Scorpio in some schools and that is a content decision, not a fix.
 */
function getSignLord(signNumber) {
    return exports.SIGN_LORDS[(((signNumber - 1) % 12) + 12) % 12 + 1];
}
exports.getSignLord = getSignLord;
/**
 * For each of the 12 houses: its sign, its lord, and where that lord is placed
 * (house, sign, degree, dignity, retrograde, combust).
 *
 * This is the backbone of house-by-house prediction: "the 10th lord sits in the
 * 6th, debilitated and combust" is the sentence every kundli report is built on.
 *
 * @param houses  the 12 houses from calculateHouses()
 * @param planets the 9 grahas from calculateAllPlanets()
 */
function getHouseLords(houses, planets) {
    const lagna = houses.find(h => h.number === 1);
    const lagnaSignNumber = lagna ? lagna.signNumber : 1;
    // ponytail: reuse the one whole-sign placement routine rather than repeating
    // its modulo here — a second copy is exactly how SIGN_LORD got duplicated.
    const placement = (0, houses_1.assignPlanetsToHouses)(planets, lagnaSignNumber, 'whole_sign');
    return houses.map(h => {
        const lord = getSignLord(h.signNumber);
        const p = planets.find(x => x.name === lord);
        return {
            house: h.number,
            signName: h.signName,
            signNumber: h.signNumber,
            lord,
            lordHouse: p ? placement[p.name] : null,
            lordSignName: p ? p.signName : null,
            lordSignNumber: p ? p.signNumber : null,
            lordDegreeInSign: p ? p.degreeInSign : null,
            lordDignity: p ? p.dignity : null,
            lordRetrograde: p ? p.retrograde : null,
            lordCombust: p ? p.isCombust : null,
        };
    });
}
exports.getHouseLords = getHouseLords;
/** Sign name for a sign number, wrapping 1-12 (convenience for report code). */
function getSignName(signNumber) {
    return constants_1.SIGN_NAMES[(((signNumber - 1) % 12) + 12) % 12 + 1] || 'Unknown';
}
exports.getSignName = getSignName;
