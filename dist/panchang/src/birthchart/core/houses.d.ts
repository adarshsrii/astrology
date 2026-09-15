/**
 * House Calculation
 * Assign signs to houses and planets to houses.
 */
import { GrahaPosition, HouseInfo, HouseSystemType } from '../types';
/**
 * Calculate the 12 houses given the lagna sign and house system.
 *
 * @param lagnaSignNumber - The sign number of the ascendant (1-12)
 * @param houseSystem - House system type
 * @param cusps - Optional sidereal cusp longitudes (index 1-12)
 * @returns Array of 12 HouseInfo
 */
export declare function calculateHouses(lagnaSignNumber: number, houseSystem: HouseSystemType, cusps?: number[]): HouseInfo[];
/**
 * Assign planets to houses based on their sign positions.
 * For whole-sign: house = (planetSign - lagnaSign + 12) % 12 + 1
 *
 * @returns Record mapping planet name to house number (1-12)
 */
export declare function assignPlanetsToHouses(planets: GrahaPosition[], lagnaSignNumber: number, houseSystem: HouseSystemType): Record<string, number>;
/**
 * Populate the houses' planet arrays using the assignment map.
 */
export declare function populateHousePlanets(houses: HouseInfo[], planets: GrahaPosition[], assignment: Record<string, number>): HouseInfo[];
export interface SudarshanaView {
    reference: 'lagna' | 'moon' | 'sun';
    referenceSignNumber: number;
    referenceSignName: string;
    houses: HouseInfo[];
}
export interface SudarshanaChakra {
    lagna: SudarshanaView;
    moon: SudarshanaView;
    sun: SudarshanaView;
}
/**
 * Sudarshana Chakra — the same chart read three times: from the Lagna, from the
 * Moon's sign (Chandra lagna) and from the Sun's sign (Surya lagna). A result
 * confirmed in all three readings is the classical test of a strong promise.
 *
 * ponytail: whole-sign only, and no interpretation — this returns the three
 * house sets and stops. Reading them is the report's job.
 */
export declare function calculateSudarshanaChakra(planets: GrahaPosition[], lagnaSignNumber: number): SudarshanaChakra;
