/**
 * Format date as UTC string (ISO format)
 * @param date Date to format
 * @returns UTC string in ISO format
 */
export declare function formatDateUTC(date: Date | null): string;
/**
 * Format time as UTC time string
 * @param date Date to format
 * @returns UTC time string (HH:MM:SS format)
 */
export declare function formatTimeUTC(date: Date | null): string;
/**
 * Format date/time in any timezone using date-fns-tz
 * @param date Date to format
 * @param timezone IANA timezone identifier (e.g., 'America/Vancouver', 'Asia/Kolkata')
 * @param formatPattern Format pattern (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns Formatted date string in the specified timezone
 */
export declare function formatDateInTimezone(date: Date | null, timezone?: string, formatPattern?: string): string;
/**
 * Format time only in any timezone
 * @param date Date to format
 * @param timezone IANA timezone identifier
 * @param formatPattern Time format pattern (default: 'HH:mm:ss')
 * @returns Formatted time string in the specified timezone
 */
export declare function formatTimeInTimezone(date: Date | null, timezone?: string, formatPattern?: string): string;
/**
 * Format date range in any timezone
 * @param startDate Start date
 * @param endDate End date
 * @param timezone IANA timezone identifier
 * @param formatPattern Format pattern for times (default: 'HH:mm:ss')
 * @returns Formatted time range string in the specified timezone
 */
export declare function formatTimeRangeInTimezone(startDate: Date | null, endDate: Date | null, timezone?: string, formatPattern?: string): string;
/**
 * Format date range as UTC strings (backward compatibility)
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted UTC time range string
 */
export declare function formatTimeRangeUTC(startDate: Date | null, endDate: Date | null): string;
/**
 * Get formatted date object with multiple timezone representations
 * @param date Date to format
 * @param primaryTimezone Primary timezone for display
 * @returns Object with multiple format options
 */
export interface FormattedDateInfo {
    /** Original Date object */
    original: Date;
    /** UTC ISO string */
    utc: string;
    /** Formatted in primary timezone */
    local: string;
    /** Time only in primary timezone */
    localTime: string;
    /** Date only in primary timezone */
    localDate: string;
    /** Primary timezone used */
    timezone: string;
    /** Unix timestamp */
    timestamp: number;
    /** Year in primary timezone */
    year: number;
    /** Month in primary timezone (1-12) */
    month: number;
    /** Day in primary timezone (1-31) */
    day: number;
}
export declare function getFormattedDateInfo(date: Date | null, primaryTimezone?: string): FormattedDateInfo | null;
export declare function normalizeAngle(angle: number): number;
