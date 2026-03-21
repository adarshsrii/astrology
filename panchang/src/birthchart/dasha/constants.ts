/**
 * Vimshottari Dasha Constants
 * Period durations, sequence order, and nakshatra-lord mappings.
 */

// Dasha period durations in years for each planet
export const DASHA_YEARS: Record<string, number> = {
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
  Ketu: 7,
  Venus: 20,
};

// Total cycle = 120 years

// Dasha sequence (fixed order in Vimshottari)
export const DASHA_SEQUENCE = [
  'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus',
];

// Nakshatra to starting dasha lord mapping
// Each nakshatra is ruled by one of the 9 planets
export const NAKSHATRA_LORDS: Record<string, string> = {
  'Ashwini': 'Ketu',
  'Bharani': 'Venus',
  'Krittika': 'Sun',
  'Rohini': 'Moon',
  'Mrigashira': 'Mars',
  'Ardra': 'Rahu',
  'Punarvasu': 'Jupiter',
  'Pushya': 'Saturn',
  'Ashlesha': 'Mercury',
  'Magha': 'Ketu',
  'Purva Phalguni': 'Venus',
  'Uttara Phalguni': 'Sun',
  'Hasta': 'Moon',
  'Chitra': 'Mars',
  'Swati': 'Rahu',
  'Vishakha': 'Jupiter',
  'Anuradha': 'Saturn',
  'Jyeshtha': 'Mercury',
  'Moola': 'Ketu',
  'Purva Ashadha': 'Venus',
  'Uttara Ashadha': 'Sun',
  'Shravana': 'Moon',
  'Dhanishtha': 'Mars',
  'Shatabhisha': 'Rahu',
  'Purva Bhadrapada': 'Jupiter',
  'Uttara Bhadrapada': 'Saturn',
  'Revati': 'Mercury',
};
