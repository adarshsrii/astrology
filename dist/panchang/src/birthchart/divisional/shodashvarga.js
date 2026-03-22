"use strict";
/**
 * Shodashvarga Summary Table
 * Shows each planet's dignity across all 16 divisional charts
 * and computes Varga Viswa points.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateShodashvarga = void 0;
const constants_1 = require("../core/constants");
const charts_1 = require("./charts");
const calculator_1 = require("./calculator");
// ── Dignity detection for varga charts ──────────────────────────────────────
/**
 * Determine a planet's dignity in a given sign (simplified for varga scoring).
 * Returns: 'exalted' | 'moolatrikona' | 'own_sign' | 'friendly' | 'neutral' | 'enemy' | 'debilitated'
 */
function getVargaDignity(planet, signNumber) {
    const grahaName = planet;
    // Check exaltation (just sign match, ignoring exact degree for vargas)
    const exalt = constants_1.EXALTATION_TABLE[grahaName];
    if (exalt && exalt.sign === signNumber) {
        return 'exalted';
    }
    // Check debilitation
    const debi = constants_1.DEBILITATION_TABLE[grahaName];
    if (debi && debi.sign === signNumber) {
        return 'debilitated';
    }
    // Check moolatrikona (sign match only for vargas)
    const moola = constants_1.MOOLATRIKONA_TABLE[grahaName];
    if (moola && moola.sign === signNumber) {
        return 'moolatrikona';
    }
    // Check own sign
    const ownSigns = constants_1.OWN_SIGNS[grahaName];
    if (ownSigns && ownSigns.includes(signNumber)) {
        return 'own_sign';
    }
    // For simplified scoring, everything else is neutral.
    // A full implementation would check natural friendships with the sign lord.
    return 'neutral';
}
// ── Varga Viswa point values ────────────────────────────────────────────────
const DIGNITY_POINTS = {
    exalted: 20,
    moolatrikona: 15,
    own_sign: 20,
    friendly: 10,
    neutral: 5,
    enemy: 2,
    debilitated: 0,
};
// ── Public API ──────────────────────────────────────────────────────────────
/**
 * Calculate the Shodashvarga summary for all planets.
 * Returns each planet's sign and dignity in all 16 charts plus total Varga Viswa points.
 */
function calculateShodashvarga(planets, lagnaSignNumber, lagnaDegree) {
    // Pre-compute all 16 divisional charts
    const charts = charts_1.SHODASHVARGA_CHARTS.map(chartDef => (0, calculator_1.calculateDivisionalChart)(chartDef.division, planets, lagnaSignNumber, lagnaDegree));
    // Build per-planet summaries
    return planets.map(planet => {
        const scores = [];
        let totalPoints = 0;
        charts.forEach((chart, idx) => {
            const chartDef = charts_1.SHODASHVARGA_CHARTS[idx];
            const pos = chart.planets.find(p => p.planet === planet.name);
            if (pos) {
                const dignity = getVargaDignity(planet.name, pos.vargaSignNumber);
                const points = DIGNITY_POINTS[dignity] ?? 5;
                totalPoints += points;
                scores.push({
                    chart: chartDef.shortName,
                    sign: pos.vargaSignName,
                    signNumber: pos.vargaSignNumber,
                    dignity,
                });
            }
        });
        return {
            planet: planet.name,
            scores,
            totalPoints,
        };
    });
}
exports.calculateShodashvarga = calculateShodashvarga;
