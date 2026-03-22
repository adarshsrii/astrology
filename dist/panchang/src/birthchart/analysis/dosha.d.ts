/**
 * Dosha Analysis Module
 *
 * Detects and analyzes major Vedic astrology doshas:
 * - Manglik (Kuja) Dosha
 * - Kaal Sarp Dosha
 * - Ganda Moola Dosha
 * - Gandanta Analysis
 */
import type { GrahaPosition, HouseInfo, LagnaInfo } from '../types';
export interface ManglikResult {
    isManglik: boolean;
    severity: 'none' | 'mild' | 'full';
    marsHouse: number;
    details: string;
    cancellations: string[];
}
/**
 * Detect Manglik (Kuja) Dosha from a birth chart.
 */
export declare function analyzeManglik(planets: GrahaPosition[], houses: HouseInfo[]): ManglikResult;
export interface KaalSarpResult {
    hasDosha: boolean;
    type: string | null;
    rahuHouse: number;
    ketuHouse: number;
    allPlanetsOnOneSide: boolean;
    details: string;
    affectedHouses: number[];
}
/**
 * Detect Kaal Sarp Dosha.
 *
 * All 7 planets (Sun through Saturn) must be on one side of the Rahu-Ketu axis.
 */
export declare function analyzeKaalSarp(planets: GrahaPosition[], houses: HouseInfo[]): KaalSarpResult;
export interface GandaMoolaResult {
    hasDosha: boolean;
    moonNakshatra: string;
    moonPada: number;
    affectedNakshatras: string[];
    details: string;
    severity: 'none' | 'mild' | 'severe';
}
/**
 * Detect Ganda Moola Dosha based on Moon's nakshatra.
 */
export declare function analyzeGandaMoola(planets: GrahaPosition[]): GandaMoolaResult;
export interface GandantaPlanet {
    name: string;
    signName: string;
    degree: number;
    type: 'nakshatra_gandanta' | 'rashi_gandanta' | 'tithi_gandanta';
    details: string;
}
export interface GandantaResult {
    hasGandanta: boolean;
    planets: GandantaPlanet[];
}
/**
 * Analyze Gandanta positions for all planets and Lagna.
 */
export declare function analyzeGandanta(planets: GrahaPosition[], lagna: LagnaInfo): GandantaResult;
