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
/**
 * Calculate all auspicious muhurats for a given date.
 *
 * @param sunrise - "HH:mm" format
 * @param sunset  - "HH:mm" format
 * @param date    - "yyyy-MM-dd" format
 * @param lat     - latitude
 * @param lon     - longitude
 * @param tz      - IANA timezone
 */
export declare function calculateMuhurats(sunrise: string, sunset: string, date: string, lat: number, lon: number, tz: string): MuhuratEntry[];
