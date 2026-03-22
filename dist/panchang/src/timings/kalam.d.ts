/**
 * Kalam (inauspicious timing) calculations for Panchang v2.
 * Wraps existing lib/ functions with typed interfaces.
 */
export interface KalamEntry {
    name: string;
    startTime: string;
    endTime: string;
    description: string;
}
/**
 * Calculate all inauspicious kalams for a given date.
 *
 * @param sunrise - "HH:mm" format
 * @param sunset  - "HH:mm" format
 * @param date    - "yyyy-MM-dd" format
 * @param lat     - latitude
 * @param lon     - longitude
 * @param tz      - IANA timezone
 */
export declare function calculateKalams(sunrise: string, sunset: string, date: string, lat: number, lon: number, tz: string): KalamEntry[];
