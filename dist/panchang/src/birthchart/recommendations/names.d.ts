/**
 * Baby Name Suggestions Based on Birth Nakshatra
 *
 * Each nakshatra has 4 padas, each associated with a specific starting syllable.
 * Names beginning with the birth nakshatra's pada syllable are considered auspicious.
 */
export interface NameEntry {
    name: string;
    gender: 'male' | 'female' | 'unisex';
}
export interface NameSuggestion {
    syllable: string;
    nakshatra: string;
    pada: number;
    gender: 'male' | 'female' | 'unisex';
    names: NameEntry[];
}
export declare const NAKSHATRA_SYLLABLES: Record<string, [string, string, string, string]>;
/**
 * Get baby name suggestions for a given nakshatra and pada.
 *
 * @param nakshatra - One of the 27 nakshatras (e.g. "Ashwini")
 * @param pada - Pada number 1-4
 * @returns Array of NameSuggestion objects (typically 1 entry for the matched syllable)
 */
export declare function getNameSuggestions(nakshatra: string, pada: number): NameSuggestion[];
