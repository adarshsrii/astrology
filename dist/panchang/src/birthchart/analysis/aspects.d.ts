/**
 * Vedic Planetary Aspects (Graha Drishti)
 *
 * Every planet fully aspects the 7th house from its position.
 * Mars, Jupiter, Saturn, Rahu, and Ketu have additional special aspects.
 */
export interface PlanetaryAspect {
    planet: string;
    aspectsHouse: number;
    aspectsPlanets: string[];
    aspectType: 'full' | 'three_quarter' | 'half' | 'quarter';
    strength: number;
}
export interface AspectResult {
    aspects: PlanetaryAspect[];
    houseAspects: Record<number, {
        aspectedBy: string[];
    }>;
}
export interface AspectPlanetInput {
    name: string;
    houseNumber: number;
}
export declare function calculateAspects(planets: AspectPlanetInput[]): AspectResult;
