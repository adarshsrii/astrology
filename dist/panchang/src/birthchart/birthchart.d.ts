/**
 * Birth Chart Orchestrator
 * The main entry point that ties together all birth chart modules.
 */
import { BirthData, BirthChartResult, AyanamsaType, HouseSystemType } from './types';
export interface BirthChartOptions {
    ayanamsa?: AyanamsaType;
    houseSystem?: HouseSystemType;
}
/**
 * Calculate a complete birth chart (Kundli).
 *
 * @param birthData - Birth date, time, location, timezone
 * @param options - Ayanamsa and house system preferences
 * @returns Complete BirthChartResult
 */
export declare function calculateBirthChart(birthData: BirthData, options?: BirthChartOptions): BirthChartResult;
