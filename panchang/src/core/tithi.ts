import { DEGREES_PER_TITHI, normalizeAngle } from './constants';

// Bare tithi names (without paksha prefix) for both halves.
// Index 0–14: Shukla Paksha tithis; index 15–29: Krishna Paksha tithis.
// Purnima (index 14) and Amavasya (index 29) have no paksha prefix.
const BARE_TITHI_NAMES: string[] = [
  'Pratipada', 'Dwitiya',     'Tritiya',     'Chaturthi',   'Panchami',
  'Shashthi',  'Saptami',     'Ashtami',     'Navami',       'Dashami',
  'Ekadashi',  'Dwadashi',    'Trayodashi',  'Chaturdashi',  'Purnima',
  'Pratipada', 'Dwitiya',     'Tritiya',     'Chaturthi',   'Panchami',
  'Shashthi',  'Saptami',     'Ashtami',     'Navami',       'Dashami',
  'Ekadashi',  'Dwadashi',    'Trayodashi',  'Chaturdashi',  'Amavasya',
];

export interface TithiResult {
  name: string;
  number: number;
  tithiIndex: number;
  paksha: 'Shukla' | 'Krishna';
  progress: number;
}

export function calculateTithi(sunLongitude: number, moonLongitude: number): TithiResult {
  const diff = normalizeAngle(moonLongitude - sunLongitude);
  const tithiIndex = Math.floor(diff / DEGREES_PER_TITHI);
  const progress = ((diff % DEGREES_PER_TITHI) / DEGREES_PER_TITHI) * 100;
  const isShukla = tithiIndex < 15;
  const paksha: 'Shukla' | 'Krishna' = isShukla ? 'Shukla' : 'Krishna';
  const pakshaNumber = isShukla ? tithiIndex + 1 : tithiIndex - 15 + 1;
  const baseName = BARE_TITHI_NAMES[tithiIndex];
  // Purnima and Amavasya are standalone names; all others get paksha prefix.
  const name = (baseName === 'Purnima' || baseName === 'Amavasya')
    ? baseName
    : `${paksha} ${baseName}`;
  return {
    name,
    number: pakshaNumber,
    tithiIndex: tithiIndex + 1,
    paksha,
    progress: Math.round(progress * 10) / 10,
  };
}
