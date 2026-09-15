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
 * Auspicious direction for each graha (Vastu / puja facing, gemstone-wearing
 * direction). Derived from PLANETARY_REMEDIES so there is exactly one copy of
 * each value — this table existed only inside the remedy objects and was
 * therefore unreachable for any planet the remedy engine did not flag as weak.
 *
 * ⚠ CONTENT DECISION PENDING (Saurabh's call, not the engine's):
 * Rahu AND Ketu are both 'Southwest' here. Several traditional sources put Ketu
 * elsewhere (Ketu is commonly given the north-west or the flag/Dhwaja corner,
 * with Nairritya/south-west reserved for Rahu). The value is LEFT AS IS on
 * purpose — changing it silently would move every Ketu remedy in the report.
 */
export declare const PLANET_DIRECTIONS: Record<string, string>;
/** Direction for one graha, or null if the name is unknown. */
export declare function getPlanetDirection(planet: string): string | null;
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
