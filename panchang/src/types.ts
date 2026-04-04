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
  location: { lat: number; lon: number; timezone: string; name?: string };
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
  moonPhase: { name: string; illumination: number };
  paksha: string;
  auspiciousMuhurats: TimingEntry[];
  inauspiciousKalams: TimingEntry[];

  // Sun Movement
  sunNakshatra: NakshatraEntry;
  ayana: string;
  ritu: { vedic: string; english: string };
  solarMonth: string;

  // Time Durations
  dinamana: string;
  ratrimana: string;
  madhyahna: string;

  // Calendar
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
  date: string;           // "2026-03-01"
  weekday: string;        // "Sunday"
  sunrise: string;        // "6:10 AM"
  sunset: string;         // "6:17 PM"
  tithi: {
    name: string;         // "Shukla Trayodashi"
    paksha: string;
    progress: number;
  };
  nakshatra: {
    name: string;         // "Pushya"
    pada: number;
    lord: string;
  };
  yoga: {
    name: string;
  };
  karana: {
    name: string;
  };
  moonSign: string;       // "Cancer"
  sunSign: string;        // "Pisces"
  moonPhase: string;      // "Waxing Gibbous"
  moonIllumination: number; // 0-100
  specialDays: string[];  // ["Pradosh", "Ekadashi"]
  isPurnima: boolean;
  isAmavasya: boolean;
  isEkadashi: boolean;
}

export interface MonthlyPanchangResult {
  year: number;
  month: number;
  location: { lat: number; lon: number; timezone: string };
  days: DailySummary[];
}
