/**
 * Tattva (Element) Balance Analysis
 *
 * Calculates the elemental distribution of planets across the four tattvas:
 * Fire (Agni), Earth (Prithvi), Air (Vayu), Water (Jala).
 */
export interface TattvaElementInfo {
    count: number;
    planets: string[];
    percentage: number;
}
export interface TattvaBalance {
    fire: TattvaElementInfo;
    earth: TattvaElementInfo;
    air: TattvaElementInfo;
    water: TattvaElementInfo;
    dominant: string;
    deficient: string;
}
export interface TattvaInput {
    name: string;
    signNumber: number;
}
export declare function calculateTattvaBalance(placements: TattvaInput[]): TattvaBalance;
