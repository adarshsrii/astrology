/**
 * Planetary Remedies — Gemstones, Mantras, and Charity
 *
 * Recommends remedies for weak/afflicted planets based on their
 * dignity, combustion status, and house placement.
 */
export interface GemstoneInfo {
    name: string;
    alternates: string[];
    metal: string;
    finger: string;
    day: string;
    weight: string;
}
export interface MantraInfo {
    vedic: string;
    beej: string;
    japaCount: number;
}
export interface CharityInfo {
    items: string[];
    day: string;
    deity: string;
}
export interface PlanetaryRemedy {
    planet: string;
    gemstone: GemstoneInfo;
    mantra: MantraInfo;
    charity: CharityInfo;
    color: string;
    direction: string;
    fasting: string;
}
export interface WeakPlanetRemedy {
    planet: string;
    reason: string;
    remedy: PlanetaryRemedy;
}
export interface RemedyResult {
    weakPlanets: WeakPlanetRemedy[];
    generalRemedies: string[];
}
export interface PlanetInput {
    name: string;
    dignity: string;
    isCombust: boolean;
    house: number;
}
/**
 * Get remedies for weak/afflicted planets.
 *
 * A planet is considered weak when it is debilitated, combust, or placed
 * in a dusthana house (6, 8, 12).
 *
 * @param planets - Array of planet positions with dignity and house info
 * @returns Object with weakPlanets remedies and general recommendations
 */
export declare function getRemedies(planets: PlanetInput[]): RemedyResult;
/**
 * Get remedy data for a specific planet (regardless of affliction).
 * Useful for general reference.
 */
export declare function getPlanetRemedy(planet: string): PlanetaryRemedy | null;
