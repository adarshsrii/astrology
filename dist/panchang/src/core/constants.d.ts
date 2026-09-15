/**
 * Panchang constants — astronomical degrees, names, and lookup tables.
 */
export declare const DEGREES_PER_TITHI = 12;
export declare const DEGREES_PER_NAKSHATRA = 13.333333;
export declare const DEGREES_PER_PADA = 3.333333;
export declare const DEGREES_PER_YOGA = 13.333333;
export declare const DEGREES_PER_RASHI = 30;
export declare function normalizeAngle(angle: number): number;
export declare const TITHI_NAMES: string[];
export declare const NAKSHATRAS: Array<{
    name: string;
    lord: string;
    deity: string;
}>;
export declare const YOGA_NAMES: string[];
/** 7 movable (repeating) karanas */
export declare const KARANA_NAMES_REPEATING: string[];
/** 4 fixed karanas (occur once per lunar month at the end) */
export declare const KARANA_NAMES_FIXED: string[];
export declare const RASHIS: Array<{
    name: string;
    sanskritName: string;
    lord: string;
    element: string;
}>;
export type Lang = 'en' | 'hi' | 'ne';
export declare const TITHI_NAMES_HI: string[];
export declare const NAKSHATRAS_HI: Array<{
    name: string;
    lord: string;
    deity: string;
}>;
export declare const YOGA_NAMES_HI: string[];
export declare const KARANA_NAMES_REPEATING_HI: string[];
export declare const KARANA_NAMES_FIXED_HI: string[];
export declare const RASHIS_HI: Array<{
    name: string;
    sanskritName: string;
    lord: string;
    element: string;
}>;
export declare const VARA_NAMES: string[];
export declare const VARA_NAMES_HI: string[];
export declare const MOON_PHASES_HI: Record<string, string>;
export declare const PAKSHA_HI: Record<string, string>;
export declare const AYANA_HI: Record<string, string>;
export declare const RITU_HI: Record<string, {
    vedic: string;
    english: string;
}>;
export declare const TITHI_NAMES_NE: string[];
export declare const NAKSHATRAS_NE: Array<{
    name: string;
    lord: string;
    deity: string;
}>;
export declare const YOGA_NAMES_NE: string[];
export declare const KARANA_NAMES_REPEATING_NE: string[];
export declare const KARANA_NAMES_FIXED_NE: string[];
export declare const RASHIS_NE: Array<{
    name: string;
    sanskritName: string;
    lord: string;
    element: string;
}>;
export declare const VARA_NAMES_NE: string[];
export declare const MOON_PHASES_NE: Record<string, string>;
export declare const PAKSHA_NE: Record<string, string>;
export declare const AYANA_NE: Record<string, string>;
export declare const RITU_NE: Record<string, {
    vedic: string;
    english: string;
}>;
export declare const LUNAR_MONTHS_NE: string[];
export declare const PLANETS_HI: Record<string, string>;
export declare const PLANETS_NE: Record<string, string>;
/**
 * English graha name -> localized name. Falls back to the English name for an
 * unrecognised planet and for lang 'en', so an unexpected value prints
 * something readable instead of `undefined`.
 */
export declare function grahaName(englishName: string, lang: Lang): string;
