"use strict";
/**
 * Birth Chart Constants
 * Exaltation / debilitation tables, combustion orbs, dignity symbols.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOUSE_SYSTEM_CODES = exports.DIGNITY_SYMBOLS = exports.NEVER_COMBUST = exports.COMBUSTION_ORBS = exports.MOOLATRIKONA_TABLE = exports.OWN_SIGNS = exports.DEBILITATION_TABLE = exports.EXALTATION_TABLE = exports.SIGN_NAMES = void 0;
// ── Sign numbers (1-based) ───────────────────────────────────────────────────
exports.SIGN_NAMES = [
    '',
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
exports.EXALTATION_TABLE = {
    Sun: { sign: 1, peakDegree: 10 },
    Moon: { sign: 2, peakDegree: 3 },
    Mars: { sign: 10, peakDegree: 28 },
    Mercury: { sign: 6, peakDegree: 15 },
    Jupiter: { sign: 4, peakDegree: 5 },
    Venus: { sign: 12, peakDegree: 27 },
    Saturn: { sign: 7, peakDegree: 20 },
    Rahu: { sign: 2, peakDegree: 20 },
    Ketu: { sign: 8, peakDegree: 20 }, // Scorpio 20° (some traditions: Sagittarius)
};
exports.DEBILITATION_TABLE = {
    Sun: { sign: 7, peakDegree: 10 },
    Moon: { sign: 8, peakDegree: 3 },
    Mars: { sign: 4, peakDegree: 28 },
    Mercury: { sign: 12, peakDegree: 15 },
    Jupiter: { sign: 10, peakDegree: 5 },
    Venus: { sign: 6, peakDegree: 27 },
    Saturn: { sign: 1, peakDegree: 20 },
    Rahu: { sign: 8, peakDegree: 20 },
    Ketu: { sign: 2, peakDegree: 20 }, // Taurus 20°
};
// ── Own signs ────────────────────────────────────────────────────────────────
exports.OWN_SIGNS = {
    Sun: [5],
    Moon: [4],
    Mars: [1, 8],
    Mercury: [3, 6],
    Jupiter: [9, 12],
    Venus: [2, 7],
    Saturn: [10, 11],
    Rahu: [11],
    Ketu: [8], // Scorpio (traditional)
};
exports.MOOLATRIKONA_TABLE = {
    Sun: { sign: 5, fromDegree: 0, toDegree: 20 },
    Moon: { sign: 2, fromDegree: 3, toDegree: 30 },
    Mars: { sign: 1, fromDegree: 0, toDegree: 12 },
    Mercury: { sign: 6, fromDegree: 15, toDegree: 20 },
    Jupiter: { sign: 9, fromDegree: 0, toDegree: 10 },
    Venus: { sign: 7, fromDegree: 0, toDegree: 15 },
    Saturn: { sign: 11, fromDegree: 0, toDegree: 20 },
    Rahu: { sign: 6, fromDegree: 0, toDegree: 20 },
    Ketu: { sign: 12, fromDegree: 0, toDegree: 20 }, // Pisces (some traditions)
};
exports.COMBUSTION_ORBS = {
    Moon: { direct: 12, retrograde: 12 },
    Mars: { direct: 17, retrograde: 17 },
    Mercury: { direct: 14, retrograde: 12 },
    Jupiter: { direct: 11, retrograde: 11 },
    Venus: { direct: 10, retrograde: 8 },
    Saturn: { direct: 15, retrograde: 15 },
};
// Sun, Rahu, Ketu are never combust
exports.NEVER_COMBUST = ['Sun', 'Rahu', 'Ketu'];
// ── Dignity symbols (for display) ────────────────────────────────────────────
exports.DIGNITY_SYMBOLS = {
    peak_exalted: '(U+)',
    exalted: '(U)',
    moolatrikona: '(MT)',
    own_sign: '(Own)',
    neutral: '',
    debilitated: '(D)',
    peak_debilitated: '(D-)', // peak debilitation
};
// ── Swiss Ephemeris house system codes ───────────────────────────────────────
exports.HOUSE_SYSTEM_CODES = {
    whole_sign: 'W',
    equal: 'E',
    placidus: 'P',
};
