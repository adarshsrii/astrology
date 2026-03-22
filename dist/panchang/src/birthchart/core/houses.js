"use strict";
/**
 * House Calculation
 * Assign signs to houses and planets to houses.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateHousePlanets = exports.assignPlanetsToHouses = exports.calculateHouses = void 0;
const constants_1 = require("./constants");
/**
 * Calculate the 12 houses given the lagna sign and house system.
 *
 * @param lagnaSignNumber - The sign number of the ascendant (1-12)
 * @param houseSystem - House system type
 * @param cusps - Optional sidereal cusp longitudes (index 1-12)
 * @returns Array of 12 HouseInfo
 */
function calculateHouses(lagnaSignNumber, houseSystem, cusps) {
    const houses = [];
    for (let h = 1; h <= 12; h++) {
        // Whole sign: house N has sign = (lagnaSign - 1 + N - 1) % 12 + 1
        const signNumber = ((lagnaSignNumber - 1 + h - 1) % 12) + 1;
        const cuspDegree = cusps && cusps[h] !== undefined ? cusps[h] : (signNumber - 1) * 30;
        houses.push({
            number: h,
            signName: constants_1.SIGN_NAMES[signNumber] || 'Unknown',
            signNumber,
            cuspDegree: Math.round(cuspDegree * 100) / 100,
            planets: [],
        });
    }
    return houses;
}
exports.calculateHouses = calculateHouses;
/**
 * Assign planets to houses based on their sign positions.
 * For whole-sign: house = (planetSign - lagnaSign + 12) % 12 + 1
 *
 * @returns Record mapping planet name to house number (1-12)
 */
function assignPlanetsToHouses(planets, lagnaSignNumber, houseSystem) {
    const assignment = {};
    for (const planet of planets) {
        if (houseSystem === 'whole_sign' || houseSystem === 'equal') {
            // Whole-sign logic: planet's sign determines the house
            const houseNum = ((planet.signNumber - lagnaSignNumber + 12) % 12) + 1;
            assignment[planet.name] = houseNum;
        }
        else {
            // Placidus: determine house by cusp ranges (simplified — use whole-sign fallback)
            const houseNum = ((planet.signNumber - lagnaSignNumber + 12) % 12) + 1;
            assignment[planet.name] = houseNum;
        }
    }
    return assignment;
}
exports.assignPlanetsToHouses = assignPlanetsToHouses;
/**
 * Populate the houses' planet arrays using the assignment map.
 */
function populateHousePlanets(houses, planets, assignment) {
    // Clear existing planet arrays
    for (const h of houses) {
        h.planets = [];
    }
    for (const planet of planets) {
        const houseNum = assignment[planet.name];
        if (houseNum >= 1 && houseNum <= 12) {
            const house = houses.find(h => h.number === houseNum);
            if (house) {
                house.planets.push(planet.name);
            }
        }
    }
    return houses;
}
exports.populateHousePlanets = populateHousePlanets;
