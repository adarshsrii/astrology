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
  paksha: 'Shukla' | 'Krishna';
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
