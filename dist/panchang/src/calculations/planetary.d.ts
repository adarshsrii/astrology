export interface OrbitalParameters {
    perihelion: number;
    aphelion: number;
    eccentricity: number;
    semiMajorAxis: number;
    orbitalPeriod: number;
    inclination: number;
    longitudeOfAscendingNode: number;
    argumentOfPeriapsis: number;
}
export interface TithiInfo {
    tithi: number;
    name: string;
    percentage: number;
    isWaxing: boolean;
}
export interface RashiInfo {
    rashi: number;
    name: string;
    element: string;
    ruler: string;
    degree: number;
}
export interface NakshatraInfo {
    nakshatra: number;
    name: string;
    pada: number;
    ruler: string;
    deity: string;
    symbol: string;
    degree: number;
}
export interface PlanetaryPosition {
    planet: string;
    longitude: number;
    latitude: number;
    rashi: RashiInfo;
    nakshatra: NakshatraInfo;
}
export declare const RASHIS: {
    name: string;
    element: string;
    ruler: string;
}[];
export declare const NAKSHATRAS: {
    name: string;
    ruler: string;
    deity: string;
    symbol: string;
}[];
export declare class Planetary {
    private readonly orbital_data;
    calculateOrbit(planet: string, date: Date): {
        perihelion: number;
        aphelion: number;
        eccentricity: number;
    };
    calculateTithi(sunLongitude: number, moonLongitude: number): TithiInfo;
    calculateYoga(sunLongitude: number, moonLongitude: number): {
        yoga: number;
        name: string;
    };
    calculateKarana(sunLongitude: number, moonLongitude: number): {
        karana: number;
        name: string;
    };
    getOrbitalPeriod(planet: string): number;
    getSemiMajorAxis(planet: string): number;
    getEccentricity(planet: string): number;
    getInclination(planet: string): number;
    calculateMeanAnomaly(planet: string, date: Date): number;
    calculateTrueAnomaly(planet: string, date: Date): number;
    calculateRashi(longitude: number): RashiInfo;
    calculateNakshatra(longitude: number): NakshatraInfo;
}
