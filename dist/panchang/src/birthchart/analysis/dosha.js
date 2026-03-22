"use strict";
/**
 * Dosha Analysis Module
 *
 * Detects and analyzes major Vedic astrology doshas:
 * - Manglik (Kuja) Dosha
 * - Kaal Sarp Dosha
 * - Ganda Moola Dosha
 * - Gandanta Analysis
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeGandanta = exports.analyzeGandaMoola = exports.analyzeKaalSarp = exports.analyzeManglik = void 0;
const MANGLIK_HOUSES = [1, 2, 4, 7, 8, 12];
const MARS_OWN_SIGNS = ['Aries', 'Scorpio'];
const MARS_EXALTATION_SIGN = 'Capricorn';
const FIRE_SIGNS = ['Aries', 'Leo', 'Sagittarius'];
/**
 * Detect Manglik (Kuja) Dosha from a birth chart.
 */
function analyzeManglik(planets, houses) {
    const mars = planets.find((p) => p.name === 'Mars');
    const jupiter = planets.find((p) => p.name === 'Jupiter');
    if (!mars) {
        return {
            isManglik: false,
            severity: 'none',
            marsHouse: 0,
            details: 'Mars position not available.',
            cancellations: [],
        };
    }
    // Find Mars house
    const marsHouse = findPlanetHouse(mars.name, houses);
    if (!MANGLIK_HOUSES.includes(marsHouse)) {
        return {
            isManglik: false,
            severity: 'none',
            marsHouse,
            details: `Mars is in house ${marsHouse}, which does not cause Manglik Dosha.`,
            cancellations: [],
        };
    }
    // Mars is in a Manglik house — check cancellations
    const cancellations = [];
    // 1. Mars in own sign (Aries, Scorpio)
    if (MARS_OWN_SIGNS.includes(mars.signName)) {
        cancellations.push(`Mars is in own sign (${mars.signName}) — Manglik cancelled.`);
    }
    // 2. Mars in exaltation (Capricorn)
    if (mars.signName === MARS_EXALTATION_SIGN) {
        cancellations.push('Mars is exalted in Capricorn — Manglik cancelled.');
    }
    // 3. Mars conjunct Jupiter in same house
    const jupiterHouse = jupiter ? findPlanetHouse(jupiter.name, houses) : 0;
    if (jupiter && jupiterHouse === marsHouse) {
        cancellations.push('Mars is conjunct Jupiter in the same house — Manglik cancelled.');
    }
    // 4. Mars aspected by Jupiter (Jupiter aspects houses 5, 7, 9 from itself)
    if (jupiter && !cancellations.some((c) => c.includes('conjunct Jupiter'))) {
        const jupiterAspects = getJupiterAspectedHouses(jupiterHouse);
        if (jupiterAspects.includes(marsHouse)) {
            cancellations.push('Mars is aspected by Jupiter — Manglik mitigated.');
        }
    }
    // 5. Mars in fire sign in 1st house
    if (marsHouse === 1 && FIRE_SIGNS.includes(mars.signName)) {
        cancellations.push(`Mars is in a fire sign (${mars.signName}) in the 1st house — Manglik cancelled.`);
    }
    // 6. Both-partner note
    cancellations.push('Note: If both partners are Manglik, the dosha is considered cancelled (cannot be verified from a single chart).');
    // Determine severity
    const hasFullCancellation = cancellations.some((c) => c.includes('cancelled') && !c.includes('both partners') && !c.includes('mitigated'));
    let severity;
    if (hasFullCancellation) {
        severity = 'none';
    }
    else if ([7, 8].includes(marsHouse)) {
        severity = 'full';
    }
    else {
        // Houses 1, 2, 4, 12 — check if Jupiter aspect mitigates
        const jupiterMitigates = cancellations.some((c) => c.includes('mitigated'));
        severity = jupiterMitigates ? 'mild' : 'full';
    }
    // If severity ended up 'none' due to cancellation, not Manglik
    const isManglik = severity !== 'none';
    const details = isManglik
        ? `Mars in house ${marsHouse} causes ${severity} Manglik Dosha.`
        : `Mars in house ${marsHouse} would cause Manglik Dosha, but it is cancelled.`;
    return {
        isManglik,
        severity,
        marsHouse,
        details,
        cancellations,
    };
}
exports.analyzeManglik = analyzeManglik;
const KAAL_SARP_TYPES = {
    1: 'Anant',
    2: 'Kulik',
    3: 'Vasuki',
    4: 'Shankhpal',
    5: 'Padma',
    6: 'Mahapadma',
    7: 'Takshak',
    8: 'Karkotak',
    9: 'Shankhchur',
    10: 'Ghatak',
    11: 'Vishdhar',
    12: 'Sheshnag',
};
/**
 * Detect Kaal Sarp Dosha.
 *
 * All 7 planets (Sun through Saturn) must be on one side of the Rahu-Ketu axis.
 */
function analyzeKaalSarp(planets, houses) {
    const rahu = planets.find((p) => p.name === 'Rahu');
    const ketu = planets.find((p) => p.name === 'Ketu');
    if (!rahu || !ketu) {
        return {
            hasDosha: false,
            type: null,
            rahuHouse: 0,
            ketuHouse: 0,
            allPlanetsOnOneSide: false,
            details: 'Rahu/Ketu positions not available.',
            affectedHouses: [],
        };
    }
    const rahuHouse = findPlanetHouse('Rahu', houses);
    const ketuHouse = findPlanetHouse('Ketu', houses);
    // Get the 7 main planets (exclude Rahu/Ketu)
    const mainPlanets = planets.filter((p) => p.name !== 'Rahu' && p.name !== 'Ketu');
    const mainPlanetHouses = mainPlanets.map((p) => findPlanetHouse(p.name, houses));
    // Houses from Rahu to Ketu (clockwise, i.e. ascending house numbers)
    const rahuToKetu = getHousesBetween(rahuHouse, ketuHouse);
    const ketuToRahu = getHousesBetween(ketuHouse, rahuHouse);
    const allInRahuToKetu = mainPlanetHouses.every((h) => rahuToKetu.includes(h));
    const allInKetuToRahu = mainPlanetHouses.every((h) => ketuToRahu.includes(h));
    const allOnOneSide = allInRahuToKetu || allInKetuToRahu;
    if (!allOnOneSide) {
        return {
            hasDosha: false,
            type: null,
            rahuHouse,
            ketuHouse,
            allPlanetsOnOneSide: false,
            details: 'Planets are on both sides of the Rahu-Ketu axis. No Kaal Sarp Dosha.',
            affectedHouses: [],
        };
    }
    const isKaalAmrit = allInKetuToRahu;
    const type = KAAL_SARP_TYPES[rahuHouse] || null;
    const affectedHouses = allInRahuToKetu ? rahuToKetu : ketuToRahu;
    const details = isKaalAmrit
        ? `Kaal Amrit Yoga (${type} type) — all planets between Ketu (house ${ketuHouse}) and Rahu (house ${rahuHouse}). This is considered auspicious.`
        : `Kaal Sarp Dosha (${type} type) — all planets between Rahu (house ${rahuHouse}) and Ketu (house ${ketuHouse}).`;
    return {
        hasDosha: !isKaalAmrit,
        type,
        rahuHouse,
        ketuHouse,
        allPlanetsOnOneSide: true,
        details,
        affectedHouses,
    };
}
exports.analyzeKaalSarp = analyzeKaalSarp;
const GANDA_MOOLA_NAKSHATRAS = [
    'Ashwini',
    'Ashlesha',
    'Magha',
    'Jyeshtha',
    'Moola',
    'Revati', // 27
];
// Junction nakshatras where Pada 1 = severe
const SEVERE_PADA_1 = ['Ashwini', 'Magha', 'Moola'];
// Junction nakshatras where Pada 4 = severe
const SEVERE_PADA_4 = ['Ashlesha', 'Jyeshtha', 'Revati'];
/**
 * Detect Ganda Moola Dosha based on Moon's nakshatra.
 */
function analyzeGandaMoola(planets) {
    const moon = planets.find((p) => p.name === 'Moon');
    if (!moon) {
        return {
            hasDosha: false,
            moonNakshatra: '',
            moonPada: 0,
            affectedNakshatras: [],
            details: 'Moon position not available.',
            severity: 'none',
        };
    }
    const { nakshatra, nakshatraPada } = moon;
    if (!GANDA_MOOLA_NAKSHATRAS.includes(nakshatra)) {
        return {
            hasDosha: false,
            moonNakshatra: nakshatra,
            moonPada: nakshatraPada,
            affectedNakshatras: [],
            details: `Moon is in ${nakshatra}, which is not a Ganda Moola nakshatra.`,
            severity: 'none',
        };
    }
    // Determine severity
    let severity = 'mild';
    if (SEVERE_PADA_1.includes(nakshatra) && nakshatraPada === 1) {
        severity = 'severe';
    }
    else if (SEVERE_PADA_4.includes(nakshatra) && nakshatraPada === 4) {
        severity = 'severe';
    }
    const details = severity === 'severe'
        ? `Moon in ${nakshatra} Pada ${nakshatraPada} causes severe Ganda Moola Dosha (junction point of nakshatra).`
        : `Moon in ${nakshatra} Pada ${nakshatraPada} causes mild Ganda Moola Dosha.`;
    return {
        hasDosha: true,
        moonNakshatra: nakshatra,
        moonPada: nakshatraPada,
        affectedNakshatras: [nakshatra],
        details,
        severity,
    };
}
exports.analyzeGandaMoola = analyzeGandaMoola;
/**
 * Water-Fire sign junctions (sign numbers).
 * Water sign last 3°20' or Fire sign first 3°20'.
 */
const GANDANTA_JUNCTIONS = [
    { water: 4, fire: 5 },
    { water: 8, fire: 9 },
    { water: 12, fire: 1 }, // Pisces → Aries
];
const GANDANTA_ORB = 3 + 20 / 60; // 3°20' = one nakshatra pada
const SIGN_NAMES = {
    1: 'Aries', 2: 'Taurus', 3: 'Gemini', 4: 'Cancer',
    5: 'Leo', 6: 'Virgo', 7: 'Libra', 8: 'Scorpio',
    9: 'Sagittarius', 10: 'Capricorn', 11: 'Aquarius', 12: 'Pisces',
};
/**
 * Analyze Gandanta positions for all planets and Lagna.
 */
function analyzeGandanta(planets, lagna) {
    const affected = [];
    // Check all planets
    for (const planet of planets) {
        const result = checkGandanta(planet.name, planet.signNumber, planet.degreeInSign);
        if (result) {
            affected.push(result);
        }
    }
    // Check Lagna
    const lagnaResult = checkGandanta('Lagna', lagna.signNumber, lagna.degreeInSign);
    if (lagnaResult) {
        affected.push(lagnaResult);
    }
    return {
        hasGandanta: affected.length > 0,
        planets: affected,
    };
}
exports.analyzeGandanta = analyzeGandanta;
function checkGandanta(name, signNumber, degreeInSign) {
    for (const junction of GANDANTA_JUNCTIONS) {
        // Water sign: last 3°20' (i.e., degree >= 30 - 3.333...)
        if (signNumber === junction.water && degreeInSign >= 30 - GANDANTA_ORB) {
            return {
                name,
                signName: SIGN_NAMES[signNumber],
                degree: degreeInSign,
                type: 'rashi_gandanta',
                details: `${name} at ${degreeInSign.toFixed(2)}° in ${SIGN_NAMES[signNumber]} is in Gandanta zone (last ${GANDANTA_ORB.toFixed(2)}° of water sign, junction with ${SIGN_NAMES[junction.fire]}).`,
            };
        }
        // Fire sign: first 3°20'
        if (signNumber === junction.fire && degreeInSign <= GANDANTA_ORB) {
            return {
                name,
                signName: SIGN_NAMES[signNumber],
                degree: degreeInSign,
                type: 'rashi_gandanta',
                details: `${name} at ${degreeInSign.toFixed(2)}° in ${SIGN_NAMES[signNumber]} is in Gandanta zone (first ${GANDANTA_ORB.toFixed(2)}° of fire sign, junction with ${SIGN_NAMES[junction.water]}).`,
            };
        }
    }
    return null;
}
// ── Helpers ────────────────────────────────────────────────────────────────────
/**
 * Find which house a planet occupies from the houses array.
 */
function findPlanetHouse(planetName, houses) {
    for (const house of houses) {
        if (house.planets.includes(planetName)) {
            return house.number;
        }
    }
    return 0;
}
/**
 * Get houses between two houses (exclusive of both endpoints),
 * moving clockwise (ascending house numbers wrapping at 12).
 */
function getHousesBetween(fromHouse, toHouse) {
    const result = [];
    let current = fromHouse;
    while (true) {
        current = current === 12 ? 1 : current + 1;
        if (current === toHouse)
            break;
        result.push(current);
    }
    return result;
}
/**
 * Get houses that Jupiter aspects from a given house.
 * Jupiter has special aspects on 5th, 7th, and 9th houses from itself.
 */
function getJupiterAspectedHouses(jupiterHouse) {
    return [5, 7, 9].map((offset) => ((jupiterHouse - 1 + offset) % 12) + 1);
}
