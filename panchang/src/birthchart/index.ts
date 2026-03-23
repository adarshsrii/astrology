/**
 * Birth Chart (Kundli) Module — Public API
 */

// Main function
export { calculateBirthChart } from './birthchart';
export type { BirthChartOptions } from './birthchart';

// Types
export type {
  GrahaName,
  Dignity,
  HouseSystemType,
  AyanamsaType,
  BirthData,
  GrahaPosition,
  HouseInfo,
  ChartBox,
  ChartLayout,
  LagnaInfo,
  BirthChartResult,
} from './types';
export { ALL_GRAHAS } from './types';

// Sub-modules (for advanced usage)
export { determineDignity, determineCombustion, getDignitySymbol } from './core/states';
export { calculateHouses, assignPlanetsToHouses, populateHousePlanets } from './core/houses';
export { generateChartLayouts } from './layout/chart-layout';

// Analysis modules
export { calculateTattvaBalance } from './analysis/tattva';
export type { TattvaBalance, TattvaElementInfo, TattvaInput } from './analysis/tattva';

export { calculateFriendships, calculateTemporalFriendships, calculateCompoundFriendships, NATURAL_FRIENDSHIPS } from './analysis/friendships';
export type { PlanetaryFriendships, NaturalRelation, TemporalRelation, CompoundRelation, FriendshipInput } from './analysis/friendships';

export { calculateAspects } from './analysis/aspects';
export type { PlanetaryAspect, AspectResult, AspectPlanetInput } from './analysis/aspects';

export { calculateShadBala } from './analysis/shadbala';
export type { ShadBalaResult, ShadBalaPlanetInput } from './analysis/shadbala';

export { analyzeManglik, analyzeKaalSarp, analyzeGandaMoola, analyzeGandanta } from './analysis/dosha';
export type { ManglikResult, KaalSarpResult, GandaMoolaResult, GandantaResult, GandantaPlanet } from './analysis/dosha';

export { detectYogas } from './analysis/yogas';
export type { DetectedYoga, YogaResult } from './analysis/yogas';

// Dasha module
export { calculateVimshottariDasha, DASHA_YEARS, DASHA_SEQUENCE, NAKSHATRA_LORDS } from './dasha';
export type { DashaPeriod, VimshottariResult } from './dasha';

// Divisional charts (Varga)
export { calculateDivisionalChart, SHODASHVARGA_CHARTS, getChartInfo, calculateShodashvarga } from './divisional';
export type { DivisionalPosition, DivisionalChart, PlanetInput, VargaChartInfo, ShodashvargaEntry, ShodashvargaChartScore } from './divisional';

// Recommendations (Names & Remedies)
export { getNameSuggestions, NAKSHATRA_SYLLABLES, getRemedies, getPlanetRemedy } from './recommendations';
export type { NameSuggestion, NameEntry, PlanetaryRemedy, GemstoneInfo, MantraInfo, CharityInfo, WeakPlanetRemedy, RemedyResult, RemedyPlanetInput } from './recommendations';
