/**
 * Recommendations Module — Name Suggestions & Remedies
 */

export { getNameSuggestions, NAKSHATRA_SYLLABLES } from './names';
export type { NameSuggestion, NameEntry } from './names';

export { getRemedies, getPlanetRemedy } from './remedies';
export type {
  PlanetaryRemedy,
  GemstoneInfo,
  MantraInfo,
  CharityInfo,
  WeakPlanetRemedy,
  RemedyResult,
  PlanetInput as RemedyPlanetInput,
} from './remedies';
