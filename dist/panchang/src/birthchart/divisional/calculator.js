"use strict";
/**
 * Divisional Chart (Varga) Calculator
 * Computes planet positions in any of the 16 Shodashvarga divisional charts.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDivisionalChart = void 0;
const constants_1 = require("../core/constants");
const charts_1 = require("./charts");
// ── Helpers ─────────────────────────────────────────────────────────────────
/** Normalise a sign number to 1-12. */
function normSign(n) {
    return ((n - 1) % 12 + 12) % 12 + 1;
}
/** Get element of a sign: 'fire' | 'earth' | 'air' | 'water'. */
function signElement(signNumber) {
    const mod = ((signNumber - 1) % 4);
    return ['fire', 'earth', 'air', 'water'][mod];
}
/** Is sign odd (1,3,5,...) or even (2,4,6,...)? */
function isOddSign(signNumber) {
    return signNumber % 2 === 1;
}
// ── Division-specific calculators ───────────────────────────────────────────
/**
 * D2 (Hora): 2 parts of 15 deg.
 * Odd signs: 0-15 = Leo(5), 15-30 = Cancer(4)
 * Even signs: 0-15 = Cancer(4), 15-30 = Leo(5)
 */
function calcD2(sign, deg) {
    const part = deg < 15 ? 0 : 1;
    const odd = isOddSign(sign);
    let vargaSign;
    if (odd) {
        vargaSign = part === 0 ? 5 : 4; // Leo, Cancer
    }
    else {
        vargaSign = part === 0 ? 4 : 5; // Cancer, Leo
    }
    return { vargaSign, vargaDeg: deg - part * 15 };
}
/**
 * D3 (Drekkana): 3 parts of 10 deg.
 * 1st (0-10): same sign
 * 2nd (10-20): 5th sign from it
 * 3rd (20-30): 9th sign from it
 */
function calcD3(sign, deg) {
    const partIndex = Math.min(Math.floor(deg / 10), 2);
    const offsets = [0, 4, 8]; // 1st, 5th, 9th from sign
    const vargaSign = normSign(sign + offsets[partIndex]);
    return { vargaSign, vargaDeg: deg - partIndex * 10 };
}
/**
 * D4 (Chaturthamsa): 4 parts of 7.5 deg.
 * Part N (0-indexed) -> sign = original + (N * 3)
 */
function calcD4(sign, deg) {
    const partIndex = Math.min(Math.floor(deg / 7.5), 3);
    const vargaSign = normSign(sign + partIndex * 3);
    return { vargaSign, vargaDeg: deg - partIndex * 7.5 };
}
/**
 * D7 (Saptamsa): 7 parts of 4.2857 deg.
 * Odd signs: start from same sign, advance +1 per division
 * Even signs: start from 7th sign, advance +1 per division
 */
function calcD7(sign, deg) {
    const partSize = 30 / 7;
    const partIndex = Math.min(Math.floor(deg / partSize), 6);
    const startSign = isOddSign(sign) ? sign : normSign(sign + 6);
    const vargaSign = normSign(startSign + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D9 (Navamsa): 9 parts of 3.333 deg.
 * Fire signs (1,5,9): start from Aries (1)
 * Earth signs (2,6,10): start from Capricorn (10)
 * Air signs (3,7,11): start from Libra (7)
 * Water signs (4,8,12): start from Cancer (4)
 */
function calcD9(sign, deg) {
    const partSize = 30 / 9;
    const partIndex = Math.min(Math.floor(deg / partSize), 8);
    const elem = signElement(sign);
    const startMap = { fire: 1, earth: 10, air: 7, water: 4 };
    const vargaSign = normSign(startMap[elem] + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D10 (Dasamsa): 10 parts of 3 deg.
 * Odd signs: start from same sign
 * Even signs: start from 9th sign
 */
function calcD10(sign, deg) {
    const partSize = 3;
    const partIndex = Math.min(Math.floor(deg / partSize), 9);
    const startSign = isOddSign(sign) ? sign : normSign(sign + 8);
    const vargaSign = normSign(startSign + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D12 (Dwadasamsa): 12 parts of 2.5 deg.
 * Start from same sign, advance +1 per division.
 */
function calcD12(sign, deg) {
    const partSize = 2.5;
    const partIndex = Math.min(Math.floor(deg / partSize), 11);
    const vargaSign = normSign(sign + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D16 (Shodasamsa): 16 parts of 1.875 deg.
 * Fire signs: start Aries(1), Earth: Leo(5), Air: Sagittarius(9), Water: Aries(1)
 */
function calcD16(sign, deg) {
    const partSize = 30 / 16;
    const partIndex = Math.min(Math.floor(deg / partSize), 15);
    const elem = signElement(sign);
    const startMap = { fire: 1, earth: 5, air: 9, water: 1 };
    const vargaSign = normSign(startMap[elem] + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D20 (Vimsamsa): 20 parts of 1.5 deg.
 * Fire signs: start Aries(1), Earth: Sagittarius(9), Air: Leo(5)
 * Water signs: follow the fire cycle → Aries(1)
 */
function calcD20(sign, deg) {
    const partSize = 1.5;
    const partIndex = Math.min(Math.floor(deg / partSize), 19);
    const elem = signElement(sign);
    const startMap = { fire: 1, earth: 9, air: 5, water: 1 };
    const vargaSign = normSign(startMap[elem] + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D24 (Chaturvimsamsa): 24 parts of 1.25 deg.
 * Odd signs: start Leo(5), Even signs: start Cancer(4)
 */
function calcD24(sign, deg) {
    const partSize = 30 / 24;
    const partIndex = Math.min(Math.floor(deg / partSize), 23);
    const startSign = isOddSign(sign) ? 5 : 4;
    const vargaSign = normSign(startSign + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D27 (Saptavimsamsa/Bhamsa): 27 parts of 1.111 deg.
 * Fire: Aries(1), Earth: Cancer(4), Air: Libra(7), Water: Capricorn(10)
 */
function calcD27(sign, deg) {
    const partSize = 30 / 27;
    const partIndex = Math.min(Math.floor(deg / partSize), 26);
    const elem = signElement(sign);
    const startMap = { fire: 1, earth: 4, air: 7, water: 10 };
    const vargaSign = normSign(startMap[elem] + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D30 (Trimsamsa): Irregular division (not equal parts).
 * Odd signs: 0-5 Mars(Aries/1), 5-10 Saturn(Aquarius/11), 10-18 Jupiter(Sagittarius/9),
 *            18-25 Mercury(Gemini/3), 25-30 Venus(Taurus/2)
 * Even signs: 0-5 Venus(Taurus/2), 5-12 Mercury(Virgo/6), 12-20 Jupiter(Pisces/12),
 *             20-25 Saturn(Capricorn/10), 25-30 Mars(Scorpio/8)
 */
function calcD30(sign, deg) {
    if (isOddSign(sign)) {
        if (deg < 5)
            return { vargaSign: 1, vargaDeg: deg };
        if (deg < 10)
            return { vargaSign: 11, vargaDeg: deg - 5 };
        if (deg < 18)
            return { vargaSign: 9, vargaDeg: deg - 10 };
        if (deg < 25)
            return { vargaSign: 3, vargaDeg: deg - 18 };
        return { vargaSign: 2, vargaDeg: deg - 25 };
    }
    else {
        if (deg < 5)
            return { vargaSign: 2, vargaDeg: deg };
        if (deg < 12)
            return { vargaSign: 6, vargaDeg: deg - 5 };
        if (deg < 20)
            return { vargaSign: 12, vargaDeg: deg - 12 };
        if (deg < 25)
            return { vargaSign: 10, vargaDeg: deg - 20 };
        return { vargaSign: 8, vargaDeg: deg - 25 };
    }
}
/**
 * D40 (Khavedamsa): 40 parts of 0.75 deg.
 * Odd signs: start Aries(1), Even signs: start Libra(7)
 */
function calcD40(sign, deg) {
    const partSize = 0.75;
    const partIndex = Math.min(Math.floor(deg / partSize), 39);
    const startSign = isOddSign(sign) ? 1 : 7;
    const vargaSign = normSign(startSign + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D45 (Akshavedamsa): 45 parts of 0.667 deg.
 * Fire: Aries(1), Earth: Leo(5), Air: Sagittarius(9), Water: Aries(1)
 */
function calcD45(sign, deg) {
    const partSize = 30 / 45;
    const partIndex = Math.min(Math.floor(deg / partSize), 44);
    const elem = signElement(sign);
    const startMap = { fire: 1, earth: 5, air: 9, water: 1 };
    const vargaSign = normSign(startMap[elem] + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
/**
 * D60 (Shashtiamsa): 60 parts of 0.5 deg.
 * Start from same sign, advance +1 per division.
 */
function calcD60(sign, deg) {
    const partSize = 0.5;
    const partIndex = Math.min(Math.floor(deg / partSize), 59);
    const vargaSign = normSign(sign + partIndex);
    return { vargaSign, vargaDeg: deg - partIndex * partSize };
}
const DIVISION_CALCULATORS = {
    2: calcD2,
    3: calcD3,
    4: calcD4,
    7: calcD7,
    9: calcD9,
    10: calcD10,
    12: calcD12,
    16: calcD16,
    20: calcD20,
    24: calcD24,
    27: calcD27,
    30: calcD30,
    40: calcD40,
    45: calcD45,
    60: calcD60,
};
/**
 * Compute a single planet's varga position for a given division.
 */
function computeVargaPosition(division, sign, deg) {
    // D1 is the birth chart itself
    if (division === 1) {
        return { vargaSign: sign, vargaDeg: deg };
    }
    const calc = DIVISION_CALCULATORS[division];
    if (!calc) {
        throw new Error(`Unsupported divisional chart: D${division}`);
    }
    return calc(sign, deg);
}
// ── Public API ──────────────────────────────────────────────────────────────
/**
 * Calculate a divisional chart for a given division number.
 * @param division - The division number (1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60)
 * @param planets - Array of {name, signNumber (1-12), degreeInSign (0-30)}
 * @param lagnaSignNumber - Lagna sign number (1-12)
 * @param lagnaDegree - Lagna degree in sign (0-30)
 */
function calculateDivisionalChart(division, planets, lagnaSignNumber, lagnaDegree) {
    const chartInfo = (0, charts_1.getChartInfo)(division);
    const chartName = chartInfo
        ? `${chartInfo.name} (${chartInfo.shortName})`
        : `D${division}`;
    // Calculate lagna position in this varga
    const lagnaVarga = computeVargaPosition(division, lagnaSignNumber, lagnaDegree);
    // Calculate each planet
    const positions = planets.map(p => {
        const result = computeVargaPosition(division, p.signNumber, p.degreeInSign);
        return {
            planet: p.name,
            d1SignNumber: p.signNumber,
            d1Degree: p.degreeInSign,
            vargaSignNumber: result.vargaSign,
            vargaSignName: constants_1.SIGN_NAMES[result.vargaSign] || `Sign-${result.vargaSign}`,
            vargaDegree: result.vargaDeg,
        };
    });
    return {
        name: chartName,
        division,
        planets: positions,
        lagnaSign: {
            number: lagnaVarga.vargaSign,
            name: constants_1.SIGN_NAMES[lagnaVarga.vargaSign] || `Sign-${lagnaVarga.vargaSign}`,
        },
    };
}
exports.calculateDivisionalChart = calculateDivisionalChart;
