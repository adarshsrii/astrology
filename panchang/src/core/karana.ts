import { KARANA_NAMES_REPEATING, KARANA_NAMES_FIXED, normalizeAngle } from './constants';

export interface KaranaResult {
  name: string;
  number: number;
  progress: number;
}

const DEGREES_PER_KARANA = 6;

export function calculateKarana(sunLongitude: number, moonLongitude: number): KaranaResult {
  const diff = normalizeAngle(moonLongitude - sunLongitude);
  const karanaIndex = Math.floor(diff / DEGREES_PER_KARANA);
  const posInKarana = diff - (karanaIndex * DEGREES_PER_KARANA);
  const progress = (posInKarana / DEGREES_PER_KARANA) * 100;

  let name: string;
  if (karanaIndex === 0) {
    name = 'Kimstughna';
  } else if (karanaIndex >= 57) {
    name = KARANA_NAMES_FIXED[karanaIndex - 57];
  } else {
    name = KARANA_NAMES_REPEATING[(karanaIndex - 1) % 7];
  }

  return { name, number: karanaIndex + 1, progress: Math.round(progress * 10) / 10 };
}
