/**
 * Shared types for Panchang v2 calculations.
 * NOTE: The existing types/panchang.ts is preserved as-is — do NOT import from here
 * in files that already import from '../types/panchang'.
 */
export interface PanchangEntry {
    name: string;
    number: number;
    startTime: string;
    endTime: string;
    progress: number;
}
export interface NakshatraEntry extends PanchangEntry {
    pada: number;
    lord: string;
    deity?: string;
}
export interface RashiInfo {
    name: string;
    lord: string;
    degree: number;
    number: number;
}
export interface VaraInfo {
    name: string;
    number: number;
}
export interface TimingEntry {
    name: string;
    startTime: string;
    endTime: string;
    description?: string;
}
export interface PanchangResult {
    date: string;
    location: {
        lat: number;
        lon: number;
        timezone: string;
        name?: string;
    };
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    tithi: PanchangEntry[];
    nakshatra: NakshatraEntry[];
    yoga: PanchangEntry[];
    karana: PanchangEntry[];
    vara: VaraInfo;
    moonSign: RashiInfo;
    sunSign: RashiInfo;
    moonPhase: {
        name: string;
        illumination: number;
    };
    paksha: 'Shukla' | 'Krishna';
    auspiciousMuhurats: TimingEntry[];
    inauspiciousKalams: TimingEntry[];
    sunNakshatra: NakshatraEntry;
    ayana: 'Uttarayana' | 'Dakshinayana';
    ritu: {
        vedic: string;
        english: string;
    };
    solarMonth: string;
    dinamana: string;
    ratrimana: string;
    madhyahna: string;
    samvatsar: string;
    vikramSamvat?: number;
    shakaSamvat?: number;
}
export interface CelestialPosition {
    longitude: number;
    latitude: number;
}
export interface Location {
    latitude: number;
    longitude: number;
    timezone: string;
    name?: string;
}
export interface DailySummary {
    date: string;
    weekday: string;
    sunrise: string;
    sunset: string;
    tithi: {
        name: string;
        paksha: 'Shukla' | 'Krishna';
        progress: number;
    };
    nakshatra: {
        name: string;
        pada: number;
        lord: string;
    };
    yoga: {
        name: string;
    };
    karana: {
        name: string;
    };
    moonSign: string;
    sunSign: string;
    moonPhase: string;
    moonIllumination: number;
    specialDays: string[];
    isPurnima: boolean;
    isAmavasya: boolean;
    isEkadashi: boolean;
}
export interface MonthlyPanchangResult {
    year: number;
    month: number;
    location: {
        lat: number;
        lon: number;
        timezone: string;
    };
    days: DailySummary[];
}
