import { RASHIS, DEGREES_PER_RASHI, normalizeAngle } from './constants';
import { RashiInfo } from '../types';

export function calculateRashi(longitude: number): RashiInfo {
  const lon = normalizeAngle(longitude);
  const rashiIndex = Math.floor(lon / DEGREES_PER_RASHI);
  const degree = lon - (rashiIndex * DEGREES_PER_RASHI);
  const rashi = RASHIS[rashiIndex];
  return {
    name: rashi.name,
    lord: rashi.lord,
    degree: Math.round(degree * 10) / 10,
    number: rashiIndex + 1,
  };
}
