import { MonthlyPanchangResult } from './types';
/**
 * Calculate Panchang for every day of a given month.
 *
 * @param year   Gregorian year  (e.g. 2026)
 * @param month  Gregorian month (1-12)
 * @param latitude   Location latitude in degrees
 * @param longitude  Location longitude in degrees
 * @param timezone   IANA timezone string (e.g. "Asia/Kolkata")
 * @returns MonthlyPanchangResult with a DailySummary for each day
 */
export declare function calculateMonthlyPanchang(year: number, month: number, latitude: number, longitude: number, timezone: string): MonthlyPanchangResult;
