/**
 * Muhurat (auspicious timing) calculations for Panchang v2.
 * Wraps existing lib/ functions and adds computed muhurats.
 */
export interface MuhuratEntry {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
}
export declare function calculateMuhurats(sunrise: string, sunset: string, date: string, lat: number, lon: number, tz: string, isPradoshDay?: boolean): MuhuratEntry[];
