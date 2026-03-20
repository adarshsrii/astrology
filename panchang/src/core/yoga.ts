import { YOGA_NAMES, DEGREES_PER_YOGA, normalizeAngle } from './constants';

export interface YogaResult {
  name: string;
  number: number;
  progress: number;
}

export function calculateYoga(sunLongitude: number, moonLongitude: number): YogaResult {
  const sum = normalizeAngle(sunLongitude + moonLongitude);
  const yogaIndex = Math.floor(sum / DEGREES_PER_YOGA);
  const posInYoga = sum - (yogaIndex * DEGREES_PER_YOGA);
  const progress = (posInYoga / DEGREES_PER_YOGA) * 100;
  return {
    name: YOGA_NAMES[yogaIndex],
    number: yogaIndex + 1,
    progress: Math.round(progress * 10) / 10,
  };
}
