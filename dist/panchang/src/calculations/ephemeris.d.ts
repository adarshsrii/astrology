import { Position, Location } from '../types/panchang';
import { PlanetaryPosition } from './planetary';
export interface AyanamsaInfo {
    name: string;
    id: number;
    degree: number;
    description: string;
}
export interface CelestialPosition extends Position {
    distance: number;
    longitudeSpeed: number;
    latitudeSpeed: number;
    distanceSpeed: number;
}
export declare class Ephemeris {
    private readonly planet_map;
    private ephemeris_path;
    constructor(ephemeris_path?: string);
    private initialize_swiss_eph;
    calculatePosition(date: Date, body: string): Position;
    calculateSiderealPosition(date: Date, body: string, ayanamsa?: number): Position;
    calculate_lahiri_ayanamsa(date: Date): number;
    private get_fallback_lahiri_ayanamsa;
    /**
     * Get all available ayanamsa systems with their degrees for a given date
     * @param date Date for ayanamsa calculation
     * @returns Array of ayanamsa information including name, ID, degree, and description
     */
    getAyanamsa(date: Date): AyanamsaInfo[];
    /**
     * Get a specific ayanamsa value by name or ID
     * @param date Date for calculation
     * @param ayanamsaId Ayanamsa ID or name
     * @returns Ayanamsa information
     */
    getSpecificAyanamsa(date: Date, ayanamsa_id: number | string): AyanamsaInfo | null;
    private get_fallback_ayanamsa;
    calculateSunrise(date: Date, location: Location): Date | null;
    private calculate_sun_altitude;
    calculateMoonrise(date: Date, location: Location): Date | null;
    calculateMoonset(date: Date, location: Location): Date | null;
    private calculate_moon_altitude;
    calculateSunset(date: Date, location: Location): Date | null;
    calculateNakshatra(longitude: number): {
        nakshatra: number;
        pada: number;
        name: string;
    };
    private date_to_julian;
    private julian_to_date;
    private get_planet_id;
    private get_fallback_position;
    getCurrentPlanets(date?: Date, ayanamsaId?: number): PlanetaryPosition[];
    /**
     * Calculate house cusps and ascendant using Swiss Ephemeris swe_houses.
     * @param date UTC Date for calculation
     * @param latitude Geographic latitude
     * @param longitude Geographic longitude
     * @param houseSystem House system type ('whole_sign' | 'equal' | 'placidus')
     * @returns Object with ascendant, mc, and cusps[1..12]
     */
    calculateHouseCusps(date: Date, latitude: number, longitude: number, houseSystem: string): {
        ascendant: number;
        mc: number;
        cusps: number[];
    };
    /**
     * Calculate position WITH speed (degrees/day) for a celestial body.
     * Uses SEFLG_SPEED flag.
     * @param date Date for calculation
     * @param body Celestial body name
     * @returns Object with longitude, latitude, and speed
     */
    calculatePositionWithSpeed(date: Date, body: string): {
        longitude: number;
        latitude: number;
        speed: number;
    };
    cleanup(): void;
}
