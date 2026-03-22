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
