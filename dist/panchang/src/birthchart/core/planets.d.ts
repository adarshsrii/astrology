/**
 * Planetary Position Calculator
 * Calculate sidereal positions for all 9 Vedic grahas.
 */
import { Ephemeris } from '../../calculations/ephemeris';
import { GrahaPosition } from '../types';
/**
 * Calculate sidereal positions for all 9 grahas.
 */
export declare function calculateAllPlanets(utcDate: Date, ayanamsa: number, ephemeris: Ephemeris): GrahaPosition[];
