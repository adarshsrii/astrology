"use strict";
/**
 * Tattva (Element) Balance Analysis
 *
 * Calculates the elemental distribution of planets across the four tattvas:
 * Fire (Agni), Earth (Prithvi), Air (Vayu), Water (Jala).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTattvaBalance = void 0;
const SIGN_TATTVA = {
    1: 'Fire',
    2: 'Earth',
    3: 'Air',
    4: 'Water',
    5: 'Fire',
    6: 'Earth',
    7: 'Air',
    8: 'Water',
    9: 'Fire',
    10: 'Earth',
    11: 'Air',
    12: 'Water', // Pisces
};
// ── Calculator ───────────────────────────────────────────────────────────────
function calculateTattvaBalance(placements) {
    const buckets = {
        Fire: [],
        Earth: [],
        Air: [],
        Water: [],
    };
    for (const p of placements) {
        const tattva = SIGN_TATTVA[p.signNumber];
        if (tattva) {
            buckets[tattva].push(p.name);
        }
    }
    const total = placements.length || 1; // avoid division by zero
    const toInfo = (planets) => ({
        count: planets.length,
        planets,
        percentage: Math.round((planets.length / total) * 100),
    });
    const elements = [
        { name: 'Fire', count: buckets.Fire.length },
        { name: 'Earth', count: buckets.Earth.length },
        { name: 'Air', count: buckets.Air.length },
        { name: 'Water', count: buckets.Water.length },
    ];
    // Sort descending by count; ties broken by declaration order
    const sorted = [...elements].sort((a, b) => b.count - a.count);
    const dominant = sorted[0].name;
    const deficient = sorted[sorted.length - 1].name;
    return {
        fire: toInfo(buckets.Fire),
        earth: toInfo(buckets.Earth),
        air: toInfo(buckets.Air),
        water: toInfo(buckets.Water),
        dominant,
        deficient,
    };
}
exports.calculateTattvaBalance = calculateTattvaBalance;
