/**
 * Birth Chart (Kundli) Types
 * All TypeScript interfaces for birth chart calculations.
 */
export type GrahaName = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Rahu' | 'Ketu';
export declare const ALL_GRAHAS: GrahaName[];
export type Dignity = 'peak_exalted' | 'exalted' | 'moolatrikona' | 'own_sign' | 'neutral' | 'debilitated' | 'peak_debilitated';
export type HouseSystemType = 'whole_sign' | 'equal' | 'placidus';
export type AyanamsaType = 'lahiri' | 'kp';
export interface BirthData {
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    timezone: string;
    name?: string;
}
export interface GrahaPosition {
    name: GrahaName;
    longitude: number;
    latitude: number;
    speed: number;
    retrograde: boolean;
    signName: string;
    signNumber: number;
    degreeInSign: number;
    nakshatra: string;
    nakshatraNumber: number;
    nakshatraPada: number;
    nakshatraLord: string;
    dignity: Dignity;
    isCombust: boolean;
    combustOrb: number;
    symbol: string;
}
export interface HouseInfo {
    number: number;
    signName: string;
    signNumber: number;
    cuspDegree: number;
    planets: GrahaName[];
}
export interface ChartBox {
    houseNumber: number;
    signNumber: number;
    signName: string;
    planets: GrahaName[];
}
export interface ChartLayout {
    style: 'north_indian' | 'south_indian' | 'western';
    boxes: ChartBox[];
}
export interface LagnaInfo {
    longitude: number;
    signName: string;
    signNumber: number;
    degreeInSign: number;
    nakshatra: string;
    nakshatraNumber: number;
    nakshatraPada: number;
    nakshatraLord: string;
}
export interface BirthChartResult {
    birthData: BirthData;
    ayanamsa: {
        type: AyanamsaType;
        degree: number;
    };
    lagna: LagnaInfo;
    planets: GrahaPosition[];
    houses: HouseInfo[];
    layout: {
        northIndian: ChartLayout;
        southIndian: ChartLayout;
        western: ChartLayout;
    };
    meta: {
        calculatedAt: string;
        houseSystem: HouseSystemType;
        julianDay: number;
        utcDate: string;
    };
}
