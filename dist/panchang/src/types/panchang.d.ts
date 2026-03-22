/**
 * Common interfaces and types for astronomical calculations
 */
export interface CelestialBody {
    name: string;
    type: 'planet' | 'star' | 'moon' | 'asteroid' | 'comet';
    magnitude?: number;
    radius?: number;
}
export interface Position {
    longitude: number;
    latitude: number;
    altitude?: number;
}
export interface EclipticCoordinates {
    longitude: number;
    latitude: number;
    distance: number;
}
export interface EquatorialCoordinates {
    rightAscension: number;
    declination: number;
    distance: number;
}
export interface OrbitalElements {
    semiMajorAxis: number;
    eccentricity: number;
    inclination: number;
    longitudeOfAscendingNode: number;
    argumentOfPeriapsis: number;
    meanAnomaly: number;
    epoch: Date;
}
export interface Location {
    latitude: number;
    longitude: number;
    altitude?: number;
    timezone?: string;
    name?: string;
}
export interface TimeRange {
    startDate: Date;
    endDate: Date;
    stepSize?: number;
}
export interface PanchangFullOutput {
    sunMoon: {
        sunrise: Date | null;
        sunset: Date | null;
        moonrise?: Date | null;
        moonset?: Date | null;
    };
    tithi: {
        name: string;
        number: number;
        endTime?: Date | null;
        next?: {
            name: string;
            number: number;
        };
    };
    nakshatra: {
        name: string;
        number: number;
        pada: number;
        endTime?: Date | null;
        next?: {
            name: string;
            number: number;
            pada: number;
        };
    };
    yoga: {
        name: string;
        number: number;
        endTime?: Date | null;
        next?: {
            name: string;
            number: number;
        };
    };
    karana: {
        name: string;
        number: number;
        endTime?: Date | null;
        next?: {
            name: string;
            number: number;
        };
    };
    weekday: string;
    lunarMonth: {
        amanta: string;
        purnimanta: string;
        paksha: string;
        monthNumber?: number;
    };
    samvata: {
        shaka: string;
        vikrama: string;
        gujarati: string;
    };
    ayana: {
        drik: string;
        vedic: string;
    };
    ritu: {
        drik: string;
        vedic: string;
    };
    muhurta: {
        abhijit: {
            start: Date | null;
            end: Date | null;
        };
        amritKalam: {
            start: Date | null;
            end: Date | null;
        };
        brahma: {
            start: Date | null;
            end: Date | null;
        };
        godhuli: {
            start: Date | null;
            end: Date | null;
        };
        nishita: {
            start: Date | null;
            end: Date | null;
        };
        pratash: {
            start: Date | null;
            end: Date | null;
        };
        sayana: {
            start: Date | null;
            end: Date | null;
        };
        vijaya: {
            start: Date | null;
            end: Date | null;
        };
        sarvarthaSiddhi: {
            start: Date | null;
            end: Date | null;
        };
    };
    rahuKalam: {
        start: Date | null;
        end: Date | null;
    };
    gulikaKalam: {
        start: Date | null;
        end: Date | null;
    };
    yamaganda: {
        start: Date | null;
        end: Date | null;
    };
}
