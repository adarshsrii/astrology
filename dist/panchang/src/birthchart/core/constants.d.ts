/**
 * Birth Chart Constants
 * Exaltation / debilitation tables, combustion orbs, dignity symbols.
 */
import { GrahaName } from '../types';
export declare const SIGN_NAMES: string[];
export interface ExaltationEntry {
    sign: number;
    peakDegree: number;
}
export declare const EXALTATION_TABLE: Record<GrahaName, ExaltationEntry>;
export interface DebilitationEntry {
    sign: number;
    peakDegree: number;
}
export declare const DEBILITATION_TABLE: Record<GrahaName, DebilitationEntry>;
export declare const OWN_SIGNS: Record<GrahaName, number[]>;
export interface MoolatrikonaEntry {
    sign: number;
    fromDegree: number;
    toDegree: number;
}
export declare const MOOLATRIKONA_TABLE: Record<GrahaName, MoolatrikonaEntry>;
export interface CombustionOrb {
    direct: number;
    retrograde: number;
}
export declare const COMBUSTION_ORBS: Record<string, CombustionOrb>;
export declare const NEVER_COMBUST: string[];
export declare const DIGNITY_SYMBOLS: Record<string, string>;
export declare const HOUSE_SYSTEM_CODES: Record<string, string>;
