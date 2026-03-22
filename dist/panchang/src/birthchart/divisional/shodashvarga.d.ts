/**
 * Shodashvarga Summary Table
 * Shows each planet's dignity across all 16 divisional charts
 * and computes Varga Viswa points.
 */
import { PlanetInput } from './calculator';
export interface ShodashvargaChartScore {
    chart: string;
    sign: string;
    signNumber: number;
    dignity: string;
}
export interface ShodashvargaEntry {
    planet: string;
    scores: ShodashvargaChartScore[];
    totalPoints: number;
}
/**
 * Calculate the Shodashvarga summary for all planets.
 * Returns each planet's sign and dignity in all 16 charts plus total Varga Viswa points.
 */
export declare function calculateShodashvarga(planets: PlanetInput[], lagnaSignNumber: number, lagnaDegree: number): ShodashvargaEntry[];
