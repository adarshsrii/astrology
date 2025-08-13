/**
 * Main entry point for the Astronomical Calculator package
 * Provides easy-to-use APIs for Panchang and astronomical calculations
 */

import { Panchang } from './panchang/index';
import { Ephemeris } from './calculations/ephemeris';
import { Planetary } from './calculations/planetary';
import { Location } from './types/panchang';
import { 
    formatDateInTimezone,
    formatTimeInTimezone,
    formatTimeRangeInTimezone,
    getFormattedDateInfo,
    FormattedDateInfo
} from './utils/index';

// Re-export types for consumers
export * from './types/panchang';
export * from './panchang/index';
export * from './calculations/ephemeris';
export * from './calculations/planetary';

/**
 * Input interface for Panchang calculation
 */
export interface PanchangInput {
    /** The date for which to calculate Panchang */
    date: Date;
    /** Location coordinates */
    location: {
        /** Latitude in degrees (positive for North, negative for South) */
        latitude: number;
        /** Longitude in degrees (positive for East, negative for West) */
        longitude: number;
        /** Timezone identifier (e.g., 'Asia/Kolkata', 'America/New_York') */
        timezone: string;
        /** Optional location name for display in reports */
        name?: string;
        /** Altitude in meters (optional, defaults to 0) */
        altitude?: number;
    };
}

/**
 * Comprehensive Panchang output interface following traditional Hindu calendar
 */
export interface PanchangOutput {
    /** Input date */
    date: Date;
    /** Location information */
    location: {
        latitude: number;
        longitude: number;
        timezone: string;
        name?: string;
        altitude?: number;
    };
    /** Day of the week */
    vara: {
        name: string;
        number: number;
    };
    /** Lunar day */
    tithi: {
        name: string;
        number: number;
        percentage: number;
        paksha: 'Shukla' | 'Krishna'; // Waxing or Waning
        endTime?: Date | null; // When this tithi ends
        isWaxing: boolean;
    };
    /** Lunar mansion */
    nakshatra: {
        name: string;
        number: number;
        pada: number;
        endTime?: Date | null; // When this nakshatra ends
        percentage: number;
    };
    /** Astronomical combination of Sun and Moon */
    yoga: {
        name: string;
        number: number;
        endTime?: Date | null; // When this yoga ends
        percentage: number;
    };
    /** Half of a tithi */
    karana: {
        name: string;
        number: number;
        endTime?: Date | null; // When this karana ends
    };
    /** Moon phase description */
    moonPhase: string;
    /** Sunrise time */
    sunrise: Date | null;
    /** Sunset time */
    sunset: Date | null;
    /** Moonrise time */
    moonrise: Date | null;
    /** Moonset time */
    moonset: Date | null;
    /** Madhyahna (midday) time */
    madhyahna: Date | null;
    /** Day duration */
    dinamana: { hours: number; minutes: number; seconds: number };
    /** Night duration */
    ratrimana: { hours: number; minutes: number; seconds: number };
    /** Lunar month information */
    lunarMonth: {
        amanta: string;  // Month ending with new moon
        purnimanta: string;  // Month ending with full moon
    };
    /** Current samvat (era) year */
    samvata: {
        shaka: number;
        vikrama: number;
        gujarati: number;
        name: string;
    };
    /** Sun's zodiac sign */
    sunsign: string;
    /** Moon's zodiac sign */
    moonsign: string;
    /** Sun's nakshatra position */
    suryaNakshatra: {
        nakshatra: number;
        pada: number;
        name: string;
    };
    /** Season information */
    ritu: {
        drik: string;    // Observed season
        vedic: string;   // Traditional Vedic season
    };
    /** Solar movement */
    ayana: {
        drik: string;    // Current ayana (northern/southern)
        vedic: string;   // Traditional ayana
    };
    /** Important time periods (Kalam) */
    kalam: {
        rahu: { start: Date | null; end: Date | null };       // Rahu Kaal
        gulikai: { start: Date | null; end: Date | null };    // Gulikai Kaal
        yamaganda: { start: Date | null; end: Date | null };  // Yamaganda Kaal
    };
    /** Auspicious time periods (Muhurat) */
    muhurat: {
        abhijita: { start: Date | null; end: Date | null };
        amritKalam: { start: Date | null; end: Date | null }[];
        sarvarthaSiddhiYoga: string;
        amritSiddhiYoga: { start: Date | null; end: Date | null };
        vijaya: { start: Date | null; end: Date | null };
        godhuli: { start: Date | null; end: Date | null };
        sayahnaSandhya: { start: Date | null; end: Date | null };
        nishita: { start: Date | null; end: Date | null };
        brahma: { start: Date | null; end: Date | null };
        pratahSandhya: { start: Date | null; end: Date | null };
    };
    /** Planetary positions */
    planetaryPositions: {
        [planet: string]: {
            longitude: number;
            siderealLongitude: number;
            nakshatra: { name: string; number: number; pada: number };
            rashi: { name: string; number: number };
        };
    };
    /** Ayanamsa information */
    ayanamsa: {
        name: string;
        degree: number;
        description: string;
    };
    
    /** Timezone-aware formatting methods */
    formatters: {
        /** Format any date in the location's timezone */
        formatInLocalTimezone: (date: Date | null, pattern?: string) => string;
        /** Format time range in the location's timezone */
        formatTimeRangeInLocalTimezone: (start: Date | null, end: Date | null, pattern?: string) => string;
        /** Get comprehensive date info for any date */
        getDateInfo: (date: Date | null) => FormattedDateInfo | null;
        /** Format sunrise in local timezone */
        getSunriseFormatted: (pattern?: string) => string;
        /** Format sunset in local timezone */
        getSunsetFormatted: (pattern?: string) => string;
        /** Format Rahu Kaal in local timezone */
        getRahuKaalFormatted: (pattern?: string) => string;
    };
}

/**
 * Main class for astronomical calculations
 */
export class PanchangCalculator {
    private Panchang: Panchang;
    private ephemeris: Ephemeris;
    private planetary: Planetary;

    constructor() {
        this.Panchang = new Panchang();
        this.ephemeris = new Ephemeris();
        this.planetary = new Planetary();
    }

    /**
     * Calculate complete Panchang for a given date and location
     * @param input Date and location information
     * @returns Complete comprehensive Panchang panchang
     */
    public calculatePanchang(input: PanchangInput): PanchangOutput {
        const location: Location = {
            latitude: input.location.latitude,
            longitude: input.location.longitude,
            timezone: input.location.timezone,
            altitude: input.location.altitude || 0
        };

        // CRITICAL: Pass the exact input date without any modifications
        // This ensures the date represents the precise moment for calculation
        const Panchang_data = this.Panchang.calculatePanchang(input.date, location, true);
        
        // Calculate planetary positions for comprehensive output
        const planetary_positions: { [planet: string]: any } = {};
        const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
        
        planets.forEach(planet => {
            try {
                const tropical = this.ephemeris.calculatePosition(input.date, planet);
                const sidereal = this.ephemeris.calculateSiderealPosition(input.date, planet);
                const nakshatra = this.ephemeris.calculateNakshatra(sidereal.longitude);
                const rashi = this.planetary.calculateRashi(sidereal.longitude);
                
                planetary_positions[planet] = {
                    longitude: tropical.longitude,
                    siderealLongitude: sidereal.longitude,
                    nakshatra: nakshatra,
                    rashi: rashi
                };
            } catch (error) {
                console.warn(`Could not calculate position for ${planet}:`, error);
            }
        });

        const ayanamsa = this.ephemeris.getSpecificAyanamsa(input.date, 1);

        // Create timezone-aware formatters
        const timezone = input.location.timezone;
        const formatters = {
            formatInLocalTimezone: (date: Date | null, pattern?: string) =>
                formatDateInTimezone(date, timezone, pattern),
            formatTimeRangeInLocalTimezone: (start: Date | null, end: Date | null, pattern?: string) => 
                formatTimeRangeInTimezone(start, end, timezone, pattern),
            getDateInfo: (date: Date | null) => 
                getFormattedDateInfo(date, timezone),
            getSunriseFormatted: (pattern?: string) => 
                formatTimeInTimezone(Panchang_data.sunrise, timezone, pattern || 'HH:mm:ss'),
            getSunsetFormatted: (pattern?: string) => 
                formatTimeInTimezone(Panchang_data.sunset, timezone, pattern || 'HH:mm:ss'),
            getRahuKaalFormatted: (pattern?: string) => 
                formatTimeRangeInTimezone(
                    Panchang_data.kalam?.rahu?.start || null,
                    Panchang_data.kalam?.rahu?.end || null,
                    timezone, 
                    pattern || 'HH:mm:ss'
                )
        };

        return {
            date: input.date,
            location: {
                latitude: input.location.latitude,
                longitude: input.location.longitude,
                timezone: input.location.timezone,
                name: input.location.name,
                altitude: input.location.altitude || 0
            },
            vara: {
            name: Panchang_data.vara.name,
            number: Panchang_data.vara.vara
            },
            tithi: {
                name: Panchang_data.tithi.name,
                number: Panchang_data.tithi.tithi,
                percentage: Panchang_data.tithi.percentage,
                paksha: Panchang_data.tithi.isWaxing ? 'Shukla' : 'Krishna',
                endTime: Panchang_data.tithi.endTime,
                isWaxing: Panchang_data.tithi.isWaxing
            },
            nakshatra: {
                name: Panchang_data.nakshatra.name,
                number: Panchang_data.nakshatra.nakshatra,
                pada: Panchang_data.nakshatra.pada,
                endTime: Panchang_data.nakshatra.endTime,
                percentage: 0 // Will be calculated by panchang module if available
            },
            yoga: {
                name: Panchang_data.yoga.name,
                number: Panchang_data.yoga.yoga,
                endTime: Panchang_data.yoga.endTime,
                percentage: 0 // Will be calculated by panchang module if available
            },
            karana: {
                name: Panchang_data.karana.name,
                number: Panchang_data.karana.karana,
                endTime: Panchang_data.karana.endTime
            },
            moonPhase: Panchang_data.moonPhase,
            sunrise: Panchang_data.sunrise,
            sunset: Panchang_data.sunset,
            moonrise: Panchang_data.moonrise || null,
            moonset: Panchang_data.moonset || null,
            madhyahna: Panchang_data.madhyahna || null,
            dinamana: Panchang_data.dinamana || { hours: 12, minutes: 0, seconds: 0 },
            ratrimana: Panchang_data.ratrimana || { hours: 12, minutes: 0, seconds: 0 },
            lunarMonth: Panchang_data.lunarMonth || {
                amanta: 'Unknown',
                purnimanta: 'Unknown'
            },
            samvata: Panchang_data.samvata || {
                shaka: 0,
                vikrama: 0,
                gujarati: 0,
                name: 'Unknown'
            },
            sunsign: Panchang_data.sunsign || 'Unknown',
            moonsign: Panchang_data.moonsign || 'Unknown',
            suryaNakshatra: Panchang_data.suryaNakshatra || {
                nakshatra: 0,
                pada: 0,
                name: 'Unknown'
            },
            ritu: Panchang_data.ritu || {
                drik: 'Unknown',
                vedic: 'Unknown'
            },
            ayana: Panchang_data.ayana || {
                drik: 'Unknown',
                vedic: 'Unknown'
            },
            kalam: {
                rahu: Panchang_data.kalam?.rahu || { start: null, end: null },
                gulikai: Panchang_data.kalam?.gulikai || { start: null, end: null },
                yamaganda: Panchang_data.kalam?.yamaganda || { start: null, end: null }
            },
            muhurat: Panchang_data.muhurat || {
                abhijita: { start: null, end: null },
                amritKalam: [],
                sarvarthaSiddhiYoga: 'Unknown',
                amritSiddhiYoga: { start: null, end: null },
                vijaya: { start: null, end: null },
                godhuli: { start: null, end: null },
                sayahnaSandhya: { start: null, end: null },
                nishita: { start: null, end: null },
                brahma: { start: null, end: null },
                pratahSandhya: { start: null, end: null }
            },
            planetaryPositions: planetary_positions,
            ayanamsa: {
                name: ayanamsa?.name || 'Lahiri',
                degree: ayanamsa?.degree || 0,
                description: ayanamsa?.description || 'Lahiri (Chitrapaksha) - Official Indian Government'
            },
            formatters: formatters
        };
    }    /**
     * Calculate planetary positions for a given date
     * @param date Date for calculation
     * @param bodies Array of celestial body names (e.g., ['Sun', 'Moon', 'Mars'])
     * @returns Object with celestial body positions
     */
    public calculatePlanetaryPositions(date: Date, bodies: string[] = ['Sun', 'Moon', 'Mars', 'Venus', 'Jupiter', 'Saturn']) {
        const positions: { [body: string]: { longitude: number; latitude: number; siderealLongitude: number } } = {};

        bodies.forEach(body => {
            try {
                const tropical = this.ephemeris.calculatePosition(date, body);
                const sidereal = this.ephemeris.calculateSiderealPosition(date, body);
                
                positions[body] = {
                    longitude: tropical.longitude,
                    latitude: tropical.latitude,
                    siderealLongitude: sidereal.longitude
                };
            } catch (error) {
                console.warn(`Could not calculate position for ${body}:`, error);
            }
        });

        return positions;
    }

    /**
     * Generate a comprehensive formatted text report of Panchang
     * @param input Date and location information
     * @param useLocalTimezone Whether to display times in local timezone (default: false, uses UTC)
     * @returns Formatted string report with complete Panchang panchang
     */
    public generatePanchangReport(input: PanchangInput, useLocalTimezone: boolean = false): string {
        const Panchang = this.calculatePanchang(input);
        const timezone = useLocalTimezone ? Panchang.location.timezone : 'UTC';
        const timezoneLabel = useLocalTimezone ? ` (${timezone})` : ' UTC';
        
        let report = `\n=== COMPREHENSIVE Panchang REPORT ===\n`;
        report += `Date: ${Panchang.date.toDateString()}\n`;
        
        // Location information
        if (Panchang.location.name) {
            report += `Location: ${Panchang.location.name}\n`;
            report += `Coordinates: ${Panchang.location.latitude}°N, ${Panchang.location.longitude}°E\n`;
        } else {
            report += `Location: ${Panchang.location.latitude}°N, ${Panchang.location.longitude}°E\n`;
        }
        
        report += `Timezone: ${Panchang.location.timezone}\n`;
        report += `Ayanamsa: ${Panchang.ayanamsa.name} (${Panchang.ayanamsa.degree.toFixed(4)}°)\n\n`;
        
        // Panchang elements
        report += `Panchang ELEMENTS:\n`;
        report += `VARA (Weekday): ${Panchang.vara.name}\n`;
        report += `TITHI: ${Panchang.tithi.name} (${Panchang.tithi.percentage.toFixed(1)}% complete)\n`;
        report += `PAKSHA: ${Panchang.tithi.paksha} (${Panchang.tithi.paksha === 'Shukla' ? 'Waxing' : 'Waning'})\n`;
        report += `NAKSHATRA: ${Panchang.nakshatra.name} (${Panchang.nakshatra.number}) - Pada ${Panchang.nakshatra.pada} (${Panchang.nakshatra.percentage.toFixed(1)}% complete)\n`;
        report += `YOGA: ${Panchang.yoga.name} (${Panchang.yoga.number}) - ${Panchang.yoga.percentage.toFixed(1)}% complete\n`;
        report += `KARANA: ${Panchang.karana.name} (${Panchang.karana.number})\n`;
        report += `MOON PHASE: ${Panchang.moonPhase}\n\n`;
        
        // Time information with flexible timezone formatting
        report += `TIME INFORMATION${timezoneLabel}:\n`;
        if (Panchang.sunrise) {
            report += `SUNRISE: ${formatTimeInTimezone(Panchang.sunrise, timezone)}${timezoneLabel}\n`;
        }
        if (Panchang.sunset) {
            report += `SUNSET: ${formatTimeInTimezone(Panchang.sunset, timezone)}${timezoneLabel}\n`;
        }
        if (Panchang.moonrise) {
            report += `MOONRISE: ${formatTimeInTimezone(Panchang.moonrise, timezone)}${timezoneLabel}\n`;
        }
        if (Panchang.moonset) {
            report += `MOONSET: ${formatTimeInTimezone(Panchang.moonset, timezone)}${timezoneLabel}\n`;
        }
        if (Panchang.madhyahna) {
            report += `MADHYAHNA: ${formatTimeInTimezone(Panchang.madhyahna, timezone)}${timezoneLabel}\n`;
        }
        
        report += `DAY DURATION: ${Panchang.dinamana.hours}h ${Panchang.dinamana.minutes}m ${Panchang.dinamana.seconds}s\n`;
        report += `NIGHT DURATION: ${Panchang.ratrimana.hours}h ${Panchang.ratrimana.minutes}m ${Panchang.ratrimana.seconds}s\n\n`;
        
        // Calendar information
        report += `CALENDAR INFORMATION:\n`;
        report += `LUNAR MONTH (Amanta): ${Panchang.lunarMonth.amanta}\n`;
        report += `LUNAR MONTH (Purnimanta): ${Panchang.lunarMonth.purnimanta}\n`;
        report += `SHAKA SAMVAT: ${Panchang.samvata.shaka}\n`;
        report += `VIKRAMA SAMVAT: ${Panchang.samvata.vikrama}\n`;
        report += `SUN SIGN: ${Panchang.sunsign}\n`;
        report += `MOON SIGN: ${Panchang.moonsign}\n`;
        report += `SURYA NAKSHATRA: ${Panchang.suryaNakshatra.name} - Pada ${Panchang.suryaNakshatra.pada}\n`;
        report += `RITU (Season): ${Panchang.ritu.vedic} (Vedic), ${Panchang.ritu.drik} (Observed)\n`;
        report += `AYANA: ${Panchang.ayana.vedic} (Vedic), ${Panchang.ayana.drik} (Observed)\n\n`;
        
        // Kalam periods with flexible timezone formatting
        report += `INAUSPICIOUS PERIODS (KALAM)${timezoneLabel}:\n`;
        if (Panchang.kalam.rahu?.start && Panchang.kalam.rahu?.end) {
            report += `RAHU KAAL: ${formatTimeRangeInTimezone(Panchang.kalam.rahu.start, Panchang.kalam.rahu.end, timezone)}${timezoneLabel}\n`;
        }
        if (Panchang.kalam.gulikai?.start && Panchang.kalam.gulikai?.end) {
            report += `GULIKAI KAAL: ${formatTimeRangeInTimezone(Panchang.kalam.gulikai.start, Panchang.kalam.gulikai.end, timezone)}${timezoneLabel}\n`;
        }
        if (Panchang.kalam.yamaganda?.start && Panchang.kalam.yamaganda?.end) {
            report += `YAMAGANDA KAAL: ${formatTimeRangeInTimezone(Panchang.kalam.yamaganda.start, Panchang.kalam.yamaganda.end, timezone)}${timezoneLabel}\n`;
        }
        
        // Planetary positions
        report += `\nPLANETARY POSITIONS (Sidereal):\n`;
        Object.keys(Panchang.planetaryPositions).forEach(planet => {
            const pos = Panchang.planetaryPositions[planet];
            report += `${planet.toUpperCase()}: ${pos.siderealLongitude.toFixed(2)}° - ${pos.rashi.name} - ${pos.nakshatra.name}\n`;
        });
        
        return report;
    }

    /**
     * Clean up resources
     */
    public cleanup(): void {
        this.ephemeris.cleanup();
        this.Panchang.cleanup();
    }

    /**
     * Get all available ayanamsa systems with their degrees for a given date
     * @param date Date for ayanamsa calculation
     * @returns Array of ayanamsa information
     */
    public getAyanamsa(date: Date = new Date()) {
        return this.ephemeris.getAyanamsa(date);
    }

    /**
     * Get a specific ayanamsa value by name or ID
     * @param ayanamsaId Ayanamsa ID (number) or name (string)
     * @param date Date for calculation
     * @returns Ayanamsa information or null if not found
     */
    public getSpecificAyanamsa(ayanamsaId: number | string, date: Date = new Date()) {
        return this.ephemeris.getSpecificAyanamsa(date, ayanamsaId);
    }
}

// Convenience functions for quick use
/**
 * Quick function to calculate Panchang
 * @param date Date for calculation - must be the EXACT date/time for calculation
 * @param latitude Latitude in degrees
 * @param longitude Longitude in degrees  
 * @param timezone Timezone identifier
 * @returns Panchang panchang
 */
export function getPanchang(
    date: Date,
    latitude: number,
    longitude: number,
    timezone: string
): PanchangOutput {
    const calculator = new PanchangCalculator();
    
    try {
        // CRITICAL: Pass the exact date without any modifications
        return calculator.calculatePanchang({
            date: date, // Use the exact input date
            location: { latitude, longitude, timezone }
        });
    } finally {
        calculator.cleanup();
    }
}

/**
 * Quick function to get a formatted Panchang report
 * @param date Date for calculation - must be the EXACT date/time for calculation
 * @param latitude Latitude in degrees
 * @param longitude Longitude in degrees
 * @param timezone Timezone identifier
 * @param locationName Optional location name for display
 * @param useLocalTimezone Whether to display times in local timezone (default: false, uses UTC)
 * @returns Formatted text report
 */
export function getPanchangReport(
    date: Date, 
    latitude: number, 
    longitude: number, 
    timezone: string, 
    locationName?: string, 
    useLocalTimezone: boolean = false
): string {
    const calculator = new PanchangCalculator();
    
    try {
        // CRITICAL: Pass the exact date without any modifications
        return calculator.generatePanchangReport({
            date: date, // Use the exact input date
            location: { latitude, longitude, timezone, name: locationName }
        }, useLocalTimezone);
    } finally {
        calculator.cleanup();
    }
}

/**
 * Quick function to get all ayanamsa systems with their degrees for a given date
 * @param date Date for ayanamsa calculation (defaults to current date)
 * @returns Array of ayanamsa information including name, ID, degree, and description
 */
export function getAyanamsa(date: Date = new Date()) {
    const ephemeris = new Ephemeris();
    
    try {
        return ephemeris.getAyanamsa(date);
    } finally {
        ephemeris.cleanup();
    }
}

/**
 * Quick function to get a specific ayanamsa value by name or ID
 * @param ayanamsaId Ayanamsa ID (number) or name (string)
 * @param date Date for calculation (defaults to current date)
 * @returns Ayanamsa information or null if not found
 */
export function getSpecificAyanamsa(ayanamsaId: number | string, date: Date = new Date()) {
    const ephemeris = new Ephemeris();
    
    try {
        return ephemeris.getSpecificAyanamsa(date, ayanamsaId);
    } finally {
        ephemeris.cleanup();
    }
}

/**
 * Get current planetary positions with Nakshatra and Rashi information
 * @param date Date for calculation (defaults to current date)
 * @param ayanamsaId Ayanamsa system to use (defaults to 1 - Lahiri)
 * @returns Array of planetary positions with astrological information
 */
export function getCurrentPlanets(date: Date = new Date(), ayanamsaId: number = 1) {
    const ephemeris = new Ephemeris();
    
    try {
        return ephemeris.getCurrentPlanets(date, ayanamsaId);
    } finally {
        ephemeris.cleanup();
    }
}

// Default export
export default PanchangCalculator;

/**
 * Convenience function - alias for getPanchang
 * Calculate comprehensive Panchang panchang for a given date, location, and timezone
 * @param date Date for calculation
 * @param location Location object with latitude and longitude, or individual parameters
 * @param timezone Target timezone (defaults to 'UTC')
 * @returns Complete Panchang output with timezone-aware formatting
 */
export function calculatePanchang(
    date: Date,
    location: Location | number,
    longitudeOrTimezone?: number | string,
    timezone?: string,
    locationName?: string,
    lang: 'en' | 'hi' = 'en'
): PanchangOutput {
    if (typeof location === 'number') {
        const latitude = location;
        const longitude = longitudeOrTimezone as number;
        const tz = timezone || 'UTC';
        return getPanchang(date, latitude, longitude, tz);
    } else {
        const tz = (longitudeOrTimezone as string) || timezone || 'UTC';
        return getPanchang(date, location.latitude, location.longitude, tz);
    }
}

// Re-export utility functions for convenience
export {
    formatDateInTimezone,
    formatTimeInTimezone,
    formatTimeRangeInTimezone,
    getFormattedDateInfo,
    FormattedDateInfo
} from './utils/index';
