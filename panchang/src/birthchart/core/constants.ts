/**
 * Birth Chart Constants
 * Exaltation / debilitation tables, combustion orbs, dignity symbols.
 */

import { GrahaName } from '../types';

// ── Sign numbers (1-based) ───────────────────────────────────────────────────

export const SIGN_NAMES: string[] = [
  '', // placeholder so index matches sign number
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// ── Exaltation table ─────────────────────────────────────────────────────────
// { sign: 1-12, peakDegree: exact degree within sign for peak exaltation }

export interface ExaltationEntry {
  sign: number;       // sign number (1=Aries)
  peakDegree: number; // degree within that sign for peak exaltation
}

export const EXALTATION_TABLE: Record<GrahaName, ExaltationEntry> = {
  Sun:     { sign: 1,  peakDegree: 10 },   // Aries 10°
  Moon:    { sign: 2,  peakDegree: 3 },    // Taurus 3°
  Mars:    { sign: 10, peakDegree: 28 },   // Capricorn 28°
  Mercury: { sign: 6,  peakDegree: 15 },   // Virgo 15°
  Jupiter: { sign: 4,  peakDegree: 5 },    // Cancer 5°
  Venus:   { sign: 12, peakDegree: 27 },   // Pisces 27°
  Saturn:  { sign: 7,  peakDegree: 20 },   // Libra 20°
  Rahu:    { sign: 2,  peakDegree: 20 },   // Taurus 20° (some traditions: Gemini)
  Ketu:    { sign: 8,  peakDegree: 20 },   // Scorpio 20° (some traditions: Sagittarius)
};

// ── Debilitation table (always 180° opposite exaltation sign) ────────────────

export interface DebilitationEntry {
  sign: number;
  peakDegree: number;
}

export const DEBILITATION_TABLE: Record<GrahaName, DebilitationEntry> = {
  Sun:     { sign: 7,  peakDegree: 10 },   // Libra 10°
  Moon:    { sign: 8,  peakDegree: 3 },    // Scorpio 3°
  Mars:    { sign: 4,  peakDegree: 28 },   // Cancer 28°
  Mercury: { sign: 12, peakDegree: 15 },   // Pisces 15°
  Jupiter: { sign: 10, peakDegree: 5 },    // Capricorn 5°
  Venus:   { sign: 6,  peakDegree: 27 },   // Virgo 27°
  Saturn:  { sign: 1,  peakDegree: 20 },   // Aries 20°
  Rahu:    { sign: 8,  peakDegree: 20 },   // Scorpio 20°
  Ketu:    { sign: 2,  peakDegree: 20 },   // Taurus 20°
};

// ── Own signs ────────────────────────────────────────────────────────────────

export const OWN_SIGNS: Record<GrahaName, number[]> = {
  Sun:     [5],        // Leo
  Moon:    [4],        // Cancer
  Mars:    [1, 8],     // Aries, Scorpio
  Mercury: [3, 6],     // Gemini, Virgo
  Jupiter: [9, 12],    // Sagittarius, Pisces
  Venus:   [2, 7],     // Taurus, Libra
  Saturn:  [10, 11],   // Capricorn, Aquarius
  Rahu:    [11],       // Aquarius (traditional)
  Ketu:    [8],        // Scorpio (traditional)
};

// ── Moolatrikona ranges ──────────────────────────────────────────────────────
// { sign, fromDegree, toDegree } — degrees within the sign

export interface MoolatrikonaEntry {
  sign: number;
  fromDegree: number;
  toDegree: number;
}

export const MOOLATRIKONA_TABLE: Record<GrahaName, MoolatrikonaEntry> = {
  Sun:     { sign: 5,  fromDegree: 0,  toDegree: 20 },  // Leo 0-20°
  Moon:    { sign: 2,  fromDegree: 3,  toDegree: 30 },  // Taurus 3-30°
  Mars:    { sign: 1,  fromDegree: 0,  toDegree: 12 },  // Aries 0-12°
  Mercury: { sign: 6,  fromDegree: 15, toDegree: 20 },  // Virgo 15-20°
  Jupiter: { sign: 9,  fromDegree: 0,  toDegree: 10 },  // Sagittarius 0-10°
  Venus:   { sign: 7,  fromDegree: 0,  toDegree: 15 },  // Libra 0-15°
  Saturn:  { sign: 11, fromDegree: 0,  toDegree: 20 },  // Aquarius 0-20°
  Rahu:    { sign: 6,  fromDegree: 0,  toDegree: 20 },  // Virgo (some traditions)
  Ketu:    { sign: 12, fromDegree: 0,  toDegree: 20 },  // Pisces (some traditions)
};

// ── Combustion orbs (degrees from Sun) ───────────────────────────────────────
// Different orbs for direct vs retrograde motion

export interface CombustionOrb {
  direct: number;
  retrograde: number;
}

export const COMBUSTION_ORBS: Record<string, CombustionOrb> = {
  Moon:    { direct: 12,  retrograde: 12 },
  Mars:    { direct: 17,  retrograde: 17 },
  Mercury: { direct: 14,  retrograde: 12 },
  Jupiter: { direct: 11,  retrograde: 11 },
  Venus:   { direct: 10,  retrograde: 8 },
  Saturn:  { direct: 15,  retrograde: 15 },
};

// Sun, Rahu, Ketu are never combust
export const NEVER_COMBUST: string[] = ['Sun', 'Rahu', 'Ketu'];

// ── Dignity symbols (for display) ────────────────────────────────────────────

export const DIGNITY_SYMBOLS: Record<string, string> = {
  peak_exalted:     '(U+)',     // peak exaltation
  exalted:          '(U)',      // exalted
  moolatrikona:     '(MT)',     // moolatrikona
  own_sign:         '(Own)',    // own sign
  neutral:          '',         // neutral — no symbol
  debilitated:      '(D)',      // debilitated
  peak_debilitated: '(D-)',     // peak debilitation
};

// ── Swiss Ephemeris house system codes ───────────────────────────────────────

export const HOUSE_SYSTEM_CODES: Record<string, string> = {
  whole_sign: 'W',
  equal:      'E',
  placidus:   'P',
};
