/**
 * Lagna (Ascendant) Calculation
 * Uses Swiss Ephemeris swe_houses to compute the ascendant and house cusps.
 */
import { Ephemeris } from '../../calculations/ephemeris';
import { LagnaInfo, HouseSystemType } from '../types';
export interface HouseCuspsResult {
    ascendant: number;
    mc: number;
    cusps: number[];
}
/**
 * Calculate the ascendant (lagna) for a birth moment.
 *
 * @param utcDate - The birth moment in UTC
 * @param latitude - Birth latitude
 * @param longitude - Birth longitude
 * @param ayanamsa - Ayanamsa value to convert tropical → sidereal
 * @param houseSystem - House system type
 * @param ephemeris - Ephemeris instance
 */
export declare function calculateLagna(utcDate: Date, latitude: number, longitude: number, ayanamsa: number, houseSystem: HouseSystemType, ephemeris: Ephemeris): {
    lagna: LagnaInfo;
    cusps: number[];
};
