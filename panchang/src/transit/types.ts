/**
 * Transit (Gochar) Types for Daily Horoscope
 *
 * Based on Phaladeepika and Brihat Parashara Hora Shastra
 */

export type TransitEffect = 'favorable' | 'unfavorable' | 'neutral';

export type LifeArea = 'career' | 'finance' | 'health' | 'relationships' | 'spiritual' | 'general';

export interface TransitInterpretation {
  /** Short prediction text */
  en: string;
  hi: string;
  /** Primary life areas affected */
  areas: LifeArea[];
  /** Effect type */
  effect: TransitEffect;
  /** Intensity 1-3 (1=mild, 2=moderate, 3=strong) */
  intensity: number;
}

export interface PlanetTransit {
  /** Planet name */
  planet: string;
  /** Current rashi (sign) of the planet */
  currentRashi: string;
  /** Current rashi number (1-12) */
  currentRashiNumber: number;
  /** House number from natal Moon (1-12) */
  houseFromMoon: number;
  /** Whether this transit is classically favorable */
  isFavorable: boolean;
  /** Whether Vedha (obstruction) cancels the effect */
  isVedhaActive: boolean;
  /** Planet causing Vedha, if any */
  vedhaPlanet?: string;
  /** Interpretation after considering Vedha */
  interpretation: TransitInterpretation;
  /** Sidereal longitude */
  longitude: number;
}

export interface LifeAreaPrediction {
  area: LifeArea;
  label: string;
  labelHi: string;
  /** Score from -100 to +100 */
  score: number;
  /** Summary prediction */
  prediction: string;
  predictionHi: string;
  /** Contributing planets */
  planets: string[];
}

export interface DailyHoroscope {
  /** Date of horoscope */
  date: Date;
  /** User's natal Moon sign */
  moonSign: string;
  moonSignHi: string;
  moonSignNumber: number;
  /** Overall score from -100 to +100 */
  overallScore: number;
  /** Overall rating */
  rating: 'excellent' | 'good' | 'average' | 'challenging' | 'difficult';
  /** One-line daily summary */
  summary: string;
  summaryHi: string;
  /** Individual planet transits */
  transits: PlanetTransit[];
  /** Life area predictions */
  areas: LifeAreaPrediction[];
  /** Lucky elements for the day */
  lucky: {
    color: string;
    colorHi: string;
    number: number;
    direction: string;
    directionHi: string;
  };
  /** Cautionary note */
  caution: string;
  cautionHi: string;
}

export interface TransitRule {
  /** Houses where this planet gives favorable results (from Moon) */
  favorableHouses: number[];
  /** Vedha pairs: key = favorable house, value = vedha (obstructing) house */
  vedhaPairs: Record<number, number>;
}

export type SadeSatiPhase = 'rising' | 'peak' | 'setting';

export interface SadeSatiPhasePeriod {
  phase: SadeSatiPhase;
  houseFromMoon: number;
  startDate: string;
  endDate: string;
  saturnSign: string;
  saturnSignHi: string;
  saturnSignNumber: number;
}

export interface SadeSatiCycle {
  startDate: string;
  endDate: string;
  activeOnReferenceDate: boolean;
  phases: SadeSatiPhasePeriod[];
}

export interface SadeSatiResult {
  referenceDate: string;
  moonSign: string;
  moonSignHi: string;
  moonSignNumber: number;
  currentSaturnSign: string;
  currentSaturnSignHi: string;
  currentSaturnSignNumber: number;
  currentHouseFromMoon: number;
  isCurrentlyInSadeSati: boolean;
  currentPhase?: SadeSatiPhase;
  currentCycle: SadeSatiCycle | null;
  previousCycle: SadeSatiCycle | null;
  nextCycle: SadeSatiCycle | null;
}
