/**
 * Divisional Chart (Varga) Calculator
 * Computes planet positions in any of the 16 Shodashvarga divisional charts.
 */
export interface DivisionalPosition {
    planet: string;
    d1SignNumber: number;
    d1Degree: number;
    vargaSignNumber: number;
    vargaSignName: string;
    vargaDegree: number;
}
export interface DivisionalChart {
    name: string;
    division: number;
    planets: DivisionalPosition[];
    lagnaSign: {
        number: number;
        name: string;
    };
}
export interface PlanetInput {
    name: string;
    signNumber: number;
    degreeInSign: number;
}
/**
 * Calculate a divisional chart for a given division number.
 * @param division - The division number (1, 2, 3, 4, 7, 9, 10, 12, 16, 20, 24, 27, 30, 40, 45, 60)
 * @param planets - Array of {name, signNumber (1-12), degreeInSign (0-30)}
 * @param lagnaSignNumber - Lagna sign number (1-12)
 * @param lagnaDegree - Lagna degree in sign (0-30)
 */
export declare function calculateDivisionalChart(division: number, planets: PlanetInput[], lagnaSignNumber: number, lagnaDegree: number): DivisionalChart;
