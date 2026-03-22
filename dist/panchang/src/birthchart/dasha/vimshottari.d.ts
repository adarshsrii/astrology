/**
 * Vimshottari Dasha Calculator
 * Computes the 120-year planetary period system based on Moon's nakshatra at birth.
 * Supports up to 5 levels: Maha, Antar, Pratyantar, Sookshma, Prana.
 */
export interface DashaPeriod {
    planet: string;
    level: number;
    levelName: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    isActive: boolean;
    subPeriods?: DashaPeriod[];
}
export interface VimshottariResult {
    birthNakshatra: string;
    birthNakshatraLord: string;
    balanceAtBirth: {
        planet: string;
        years: number;
        months: number;
        days: number;
    };
    mahaDashas: DashaPeriod[];
    currentDasha: {
        maha: string;
        antar: string;
        pratyantar: string;
        sookshma: string;
        prana: string;
    };
}
/**
 * Calculate Vimshottari Dasha for a birth chart.
 * @param birthDate - Date object of birth
 * @param moonNakshatra - Name of Moon's nakshatra
 * @param moonNakshatraDegree - Moon's degree within the nakshatra (0-13.333)
 * @param depth - How many levels to calculate (1-5, default 5)
 */
export declare function calculateVimshottariDasha(birthDate: Date, moonNakshatra: string, moonNakshatraDegree: number, depth?: number): VimshottariResult;
