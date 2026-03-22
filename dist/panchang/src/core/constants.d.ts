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
