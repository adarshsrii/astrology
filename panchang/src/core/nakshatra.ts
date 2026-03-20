import { NAKSHATRAS, DEGREES_PER_NAKSHATRA, DEGREES_PER_PADA, normalizeAngle } from './constants';

export interface NakshatraResult {
  name: string;
  number: number;
  pada: number;
  lord: string;
  deity: string;
  progress: number;
  padaProgress: number;
}

export function calculateNakshatra(moonLongitude: number): NakshatraResult {
  const lon = normalizeAngle(moonLongitude);
  const nakshatraIndex = Math.floor(lon / DEGREES_PER_NAKSHATRA);
  const posInNakshatra = lon - (nakshatraIndex * DEGREES_PER_NAKSHATRA);
  const pada = Math.min(Math.floor(posInNakshatra / DEGREES_PER_PADA) + 1, 4);
  const posInPada = posInNakshatra - ((pada - 1) * DEGREES_PER_PADA);
  const nk = NAKSHATRAS[nakshatraIndex];
  const progress = (posInNakshatra / DEGREES_PER_NAKSHATRA) * 100;
  const padaProgress = (posInPada / DEGREES_PER_PADA) * 100;
  return {
    name: nk.name, number: nakshatraIndex + 1, pada,
    lord: nk.lord, deity: nk.deity,
    progress: Math.round(progress * 10) / 10,
    padaProgress: Math.round(padaProgress * 10) / 10,
  };
}
