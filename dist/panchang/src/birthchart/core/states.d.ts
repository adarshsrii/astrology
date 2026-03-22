/**
 * Planetary Dignity & Combustion
 * Determines the state of a graha based on its position.
 */
import { GrahaName, Dignity } from '../types';
/**
 * Determine the dignity (state) of a planet in a given sign and degree.
 * Priority order: peak_exalted > peak_debilitated > exalted > debilitated > moolatrikona > own_sign > neutral
 */
export declare function determineDignity(planet: GrahaName, signNumber: number, degreeInSign: number): Dignity;
/**
 * Get the display symbol for a dignity state.
 */
export declare function getDignitySymbol(dignity: Dignity): string;
export interface CombustionResult {
    isCombust: boolean;
    orb: number;
}
/**
 * Determine if a planet is combust (too close to the Sun).
 * Sun, Rahu, and Ketu are never combust.
 *
 * @param planet - The graha name
 * @param planetLon - Sidereal longitude of the planet (0-360)
 * @param sunLon - Sidereal longitude of the Sun (0-360)
 * @param isRetrograde - Whether the planet is retrograde
 */
export declare function determineCombustion(planet: GrahaName, planetLon: number, sunLon: number, isRetrograde: boolean): CombustionResult;
