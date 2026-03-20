/**
 * Panchang constants — astronomical degrees, names, and lookup tables.
 */

// ---------------------------------------------------------------------------
// Degree constants
// ---------------------------------------------------------------------------

export const DEGREES_PER_TITHI = 12;
export const DEGREES_PER_NAKSHATRA = 13.333333;
export const DEGREES_PER_PADA = 3.333333;
export const DEGREES_PER_YOGA = 13.333333;
export const DEGREES_PER_RASHI = 30;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

export function normalizeAngle(angle: number): number {
  let normalized = angle % 360;
  if (normalized < 0) {
    normalized += 360;
  }
  return normalized;
}

// ---------------------------------------------------------------------------
// Tithi names (30 total: 15 Shukla + 15 Krishna)
// Index 0-14 = Shukla Paksha; index 15-29 = Krishna Paksha
// The 15th tithi of each paksha is Purnima / Amavasya respectively.
// ---------------------------------------------------------------------------

export const TITHI_NAMES: string[] = [
  // Shukla Paksha (1–15)
  'Shukla Pratipada',
  'Shukla Dwitiya',
  'Shukla Tritiya',
  'Shukla Chaturthi',
  'Shukla Panchami',
  'Shukla Shashthi',
  'Shukla Saptami',
  'Shukla Ashtami',
  'Shukla Navami',
  'Shukla Dashami',
  'Shukla Ekadashi',
  'Shukla Dwadashi',
  'Shukla Trayodashi',
  'Shukla Chaturdashi',
  'Purnima',
  // Krishna Paksha (1–15)
  'Krishna Pratipada',
  'Krishna Dwitiya',
  'Krishna Tritiya',
  'Krishna Chaturthi',
  'Krishna Panchami',
  'Krishna Shashthi',
  'Krishna Saptami',
  'Krishna Ashtami',
  'Krishna Navami',
  'Krishna Dashami',
  'Krishna Ekadashi',
  'Krishna Dwadashi',
  'Krishna Trayodashi',
  'Krishna Chaturdashi',
  'Amavasya',
];

// ---------------------------------------------------------------------------
// Nakshatras (27)
// ---------------------------------------------------------------------------

export const NAKSHATRAS: Array<{ name: string; lord: string; deity: string }> = [
  { name: 'Ashwini',           lord: 'Ketu',    deity: 'Ashwini Kumaras' },
  { name: 'Bharani',           lord: 'Venus',   deity: 'Yama' },
  { name: 'Krittika',          lord: 'Sun',     deity: 'Agni' },
  { name: 'Rohini',            lord: 'Moon',    deity: 'Brahma' },
  { name: 'Mrigashira',        lord: 'Mars',    deity: 'Soma' },
  { name: 'Ardra',             lord: 'Rahu',    deity: 'Rudra' },
  { name: 'Punarvasu',         lord: 'Jupiter', deity: 'Aditi' },
  { name: 'Pushya',            lord: 'Saturn',  deity: 'Brihaspati' },
  { name: 'Ashlesha',          lord: 'Mercury', deity: 'Nagas' },
  { name: 'Magha',             lord: 'Ketu',    deity: 'Pitrs' },
  { name: 'Purva Phalguni',    lord: 'Venus',   deity: 'Bhaga' },
  { name: 'Uttara Phalguni',   lord: 'Sun',     deity: 'Aryaman' },
  { name: 'Hasta',             lord: 'Moon',    deity: 'Savitar' },
  { name: 'Chitra',            lord: 'Mars',    deity: 'Vishvakarma' },
  { name: 'Swati',             lord: 'Rahu',    deity: 'Vayu' },
  { name: 'Vishakha',          lord: 'Jupiter', deity: 'Indragni' },
  { name: 'Anuradha',          lord: 'Saturn',  deity: 'Mitra' },
  { name: 'Jyeshtha',          lord: 'Mercury', deity: 'Indra' },
  { name: 'Mula',              lord: 'Ketu',    deity: 'Nirriti' },
  { name: 'Purva Ashadha',     lord: 'Venus',   deity: 'Apah' },
  { name: 'Uttara Ashadha',    lord: 'Sun',     deity: 'Vishvedevas' },
  { name: 'Shravana',          lord: 'Moon',    deity: 'Vishnu' },
  { name: 'Dhanishtha',        lord: 'Mars',    deity: 'Vasus' },
  { name: 'Shatabhisha',       lord: 'Rahu',    deity: 'Varuna' },
  { name: 'Purva Bhadrapada',  lord: 'Jupiter', deity: 'Ajaikapat' },
  { name: 'Uttara Bhadrapada', lord: 'Saturn',  deity: 'Ahirbudhnya' },
  { name: 'Revati',            lord: 'Mercury', deity: 'Pushan' },
];

// ---------------------------------------------------------------------------
// Yoga names (27)
// ---------------------------------------------------------------------------

export const YOGA_NAMES: string[] = [
  'Vishkumbha',
  'Preeti',
  'Ayushman',
  'Saubhagya',
  'Shobhana',
  'Atiganda',
  'Sukarman',
  'Dhriti',
  'Shoola',
  'Ganda',
  'Vriddhi',
  'Dhruva',
  'Vyaghata',
  'Harshana',
  'Vajra',
  'Siddhi',
  'Vyatipata',
  'Variyan',
  'Parigha',
  'Shiva',
  'Siddha',
  'Sadhya',
  'Shubha',
  'Shukla',
  'Brahma',
  'Indra',
  'Vaidhriti',
];

// ---------------------------------------------------------------------------
// Karana names
// ---------------------------------------------------------------------------

/** 7 movable (repeating) karanas */
export const KARANA_NAMES_REPEATING: string[] = [
  'Bava',
  'Balava',
  'Kaulava',
  'Taitila',
  'Garija',
  'Vanija',
  'Vishti',
];

/** 4 fixed karanas (occur once per lunar month at the end) */
export const KARANA_NAMES_FIXED: string[] = [
  'Shakuni',
  'Chatushpad',
  'Naga',
  'Kimstughna',
];

// ---------------------------------------------------------------------------
// Rashis (12)
// ---------------------------------------------------------------------------

export const RASHIS: Array<{
  name: string;
  sanskritName: string;
  lord: string;
  element: string;
}> = [
  { name: 'Aries',       sanskritName: 'Mesha',      lord: 'Mars',    element: 'Fire'  },
  { name: 'Taurus',      sanskritName: 'Vrishabha',  lord: 'Venus',   element: 'Earth' },
  { name: 'Gemini',      sanskritName: 'Mithuna',    lord: 'Mercury', element: 'Air'   },
  { name: 'Cancer',      sanskritName: 'Karka',      lord: 'Moon',    element: 'Water' },
  { name: 'Leo',         sanskritName: 'Simha',      lord: 'Sun',     element: 'Fire'  },
  { name: 'Virgo',       sanskritName: 'Kanya',      lord: 'Mercury', element: 'Earth' },
  { name: 'Libra',       sanskritName: 'Tula',       lord: 'Venus',   element: 'Air'   },
  { name: 'Scorpio',     sanskritName: 'Vrishchika', lord: 'Mars',    element: 'Water' },
  { name: 'Sagittarius', sanskritName: 'Dhanu',      lord: 'Jupiter', element: 'Fire'  },
  { name: 'Capricorn',   sanskritName: 'Makara',     lord: 'Saturn',  element: 'Earth' },
  { name: 'Aquarius',    sanskritName: 'Kumbha',     lord: 'Saturn',  element: 'Air'   },
  { name: 'Pisces',      sanskritName: 'Meena',      lord: 'Jupiter', element: 'Water' },
];
