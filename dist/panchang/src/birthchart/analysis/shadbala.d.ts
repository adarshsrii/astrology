/**
 * Shad Bala — Six-fold Planetary Strength
 *
 * Measures a planet's ability to deliver results through 6 components:
 * 1. Sthana Bala  (Positional strength)
 * 2. Dig Bala     (Directional strength)
 * 3. Kala Bala    (Temporal strength)
 * 4. Chesta Bala  (Motional strength)
 * 5. Naisargika Bala (Natural strength — fixed)
 * 6. Drik Bala    (Aspectual strength)
 *
 * Simplification note:
 * Full Shad Bala calculation requires very precise astronomical data.
 * This implementation uses simplified but correct formulas that give
 * directionally accurate results. For professional-grade accuracy,
 * Swiss Ephemeris planetary speeds and house cusps should be used.
 */
export interface ShadBalaResult {
    planet: string;
    sthana: number;
    dig: number;
    kala: number;
    chesta: number;
    naisargika: number;
    drik: number;
    total: number;
    required: number;
    ratio: number;
    isStrong: boolean;
}
export interface ShadBalaPlanetInput {
    name: string;
    signNumber: number;
    degreeInSign: number;
    house: number;
    retrograde: boolean;
    speed: number;
    dignity: string;
}
/**
 * Calculate Shad Bala (six-fold planetary strength) for all planets.
 *
 * @param planets - Array of planet positions with house, dignity, speed info
 * @param lagnaSignNumber - Sign number (1-12) of the ascendant
 * @param birthHour - Hour of birth (0-23) for Kala Bala; defaults to 12 (day)
 */
export declare function calculateShadBala(planets: ShadBalaPlanetInput[], lagnaSignNumber: number, birthHour?: number): ShadBalaResult[];
