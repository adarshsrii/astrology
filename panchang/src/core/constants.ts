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

// ---------------------------------------------------------------------------
// Hindi translations
// ---------------------------------------------------------------------------

export type Lang = 'en' | 'hi';

export const TITHI_NAMES_HI: string[] = [
  // शुक्ल पक्ष (1–15)
  'शुक्ल प्रतिपदा',
  'शुक्ल द्वितीया',
  'शुक्ल तृतीया',
  'शुक्ल चतुर्थी',
  'शुक्ल पंचमी',
  'शुक्ल षष्ठी',
  'शुक्ल सप्तमी',
  'शुक्ल अष्टमी',
  'शुक्ल नवमी',
  'शुक्ल दशमी',
  'शुक्ल एकादशी',
  'शुक्ल द्वादशी',
  'शुक्ल त्रयोदशी',
  'शुक्ल चतुर्दशी',
  'पूर्णिमा',
  // कृष्ण पक्ष (1–15)
  'कृष्ण प्रतिपदा',
  'कृष्ण द्वितीया',
  'कृष्ण तृतीया',
  'कृष्ण चतुर्थी',
  'कृष्ण पंचमी',
  'कृष्ण षष्ठी',
  'कृष्ण सप्तमी',
  'कृष्ण अष्टमी',
  'कृष्ण नवमी',
  'कृष्ण दशमी',
  'कृष्ण एकादशी',
  'कृष्ण द्वादशी',
  'कृष्ण त्रयोदशी',
  'कृष्ण चतुर्दशी',
  'अमावस्या',
];

export const NAKSHATRAS_HI: Array<{ name: string; lord: string; deity: string }> = [
  { name: 'अश्विनी',       lord: 'केतु',    deity: 'अश्विनी कुमार' },
  { name: 'भरणी',          lord: 'शुक्र',   deity: 'यम' },
  { name: 'कृत्तिका',      lord: 'सूर्य',   deity: 'अग्नि' },
  { name: 'रोहिणी',        lord: 'चंद्र',   deity: 'ब्रह्मा' },
  { name: 'मृगशिरा',       lord: 'मंगल',   deity: 'सोम' },
  { name: 'आर्द्रा',        lord: 'राहु',    deity: 'रुद्र' },
  { name: 'पुनर्वसु',      lord: 'गुरु',    deity: 'अदिति' },
  { name: 'पुष्य',         lord: 'शनि',    deity: 'बृहस्पति' },
  { name: 'आश्लेषा',       lord: 'बुध',    deity: 'नाग' },
  { name: 'मघा',           lord: 'केतु',    deity: 'पितर' },
  { name: 'पूर्वाफाल्गुनी',  lord: 'शुक्र',   deity: 'भग' },
  { name: 'उत्तराफाल्गुनी', lord: 'सूर्य',   deity: 'अर्यमा' },
  { name: 'हस्त',          lord: 'चंद्र',   deity: 'सवितर' },
  { name: 'चित्रा',         lord: 'मंगल',   deity: 'विश्वकर्मा' },
  { name: 'स्वाति',         lord: 'राहु',    deity: 'वायु' },
  { name: 'विशाखा',        lord: 'गुरु',    deity: 'इंद्राग्नि' },
  { name: 'अनुराधा',       lord: 'शनि',    deity: 'मित्र' },
  { name: 'ज्येष्ठा',       lord: 'बुध',    deity: 'इंद्र' },
  { name: 'मूल',           lord: 'केतु',    deity: 'निर्ऋति' },
  { name: 'पूर्वाषाढ़ा',     lord: 'शुक्र',   deity: 'अपः' },
  { name: 'उत्तराषाढ़ा',    lord: 'सूर्य',   deity: 'विश्वेदेव' },
  { name: 'श्रवण',         lord: 'चंद्र',   deity: 'विष्णु' },
  { name: 'धनिष्ठा',       lord: 'मंगल',   deity: 'वसु' },
  { name: 'शतभिषा',       lord: 'राहु',    deity: 'वरुण' },
  { name: 'पूर्वाभाद्रपद',   lord: 'गुरु',    deity: 'अजैकपाद' },
  { name: 'उत्तराभाद्रपद',  lord: 'शनि',    deity: 'अहिर्बुध्न्य' },
  { name: 'रेवती',         lord: 'बुध',    deity: 'पूषन' },
];

export const YOGA_NAMES_HI: string[] = [
  'विष्कुम्भ',
  'प्रीति',
  'आयुष्मान',
  'सौभाग्य',
  'शोभन',
  'अतिगण्ड',
  'सुकर्मा',
  'धृति',
  'शूल',
  'गण्ड',
  'वृद्धि',
  'ध्रुव',
  'व्याघात',
  'हर्षण',
  'वज्र',
  'सिद्धि',
  'व्यतीपात',
  'वरीयान',
  'परिघ',
  'शिव',
  'सिद्ध',
  'साध्य',
  'शुभ',
  'शुक्ल',
  'ब्रह्म',
  'इंद्र',
  'वैधृति',
];

export const KARANA_NAMES_REPEATING_HI: string[] = [
  'बव',
  'बालव',
  'कौलव',
  'तैतिल',
  'गरिज',
  'वणिज',
  'विष्टि',
];

export const KARANA_NAMES_FIXED_HI: string[] = [
  'शकुनि',
  'चतुष्पद',
  'नाग',
  'किंस्तुघ्न',
];

export const RASHIS_HI: Array<{
  name: string;
  sanskritName: string;
  lord: string;
  element: string;
}> = [
  { name: 'मेष',       sanskritName: 'मेष',      lord: 'मंगल',   element: 'अग्नि' },
  { name: 'वृषभ',      sanskritName: 'वृषभ',     lord: 'शुक्र',   element: 'पृथ्वी' },
  { name: 'मिथुन',     sanskritName: 'मिथुन',    lord: 'बुध',    element: 'वायु' },
  { name: 'कर्क',       sanskritName: 'कर्क',      lord: 'चंद्र',   element: 'जल' },
  { name: 'सिंह',       sanskritName: 'सिंह',      lord: 'सूर्य',   element: 'अग्नि' },
  { name: 'कन्या',      sanskritName: 'कन्या',     lord: 'बुध',    element: 'पृथ्वी' },
  { name: 'तुला',       sanskritName: 'तुला',      lord: 'शुक्र',   element: 'वायु' },
  { name: 'वृश्चिक',    sanskritName: 'वृश्चिक',   lord: 'मंगल',   element: 'जल' },
  { name: 'धनु',        sanskritName: 'धनु',      lord: 'गुरु',    element: 'अग्नि' },
  { name: 'मकर',        sanskritName: 'मकर',      lord: 'शनि',    element: 'पृथ्वी' },
  { name: 'कुंभ',       sanskritName: 'कुंभ',      lord: 'शनि',    element: 'वायु' },
  { name: 'मीन',        sanskritName: 'मीन',      lord: 'गुरु',    element: 'जल' },
];

export const VARA_NAMES: string[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];

export const VARA_NAMES_HI: string[] = [
  'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार',
];

export const MOON_PHASES_HI: Record<string, string> = {
  'New Moon': 'अमावस्या',
  'Waxing Crescent': 'शुक्ल द्वितीया चंद्र',
  'First Quarter': 'शुक्ल अष्टमी चंद्र',
  'Waxing Gibbous': 'शुक्ल एकादशी चंद्र',
  'Full Moon': 'पूर्णिमा',
  'Waning Gibbous': 'कृष्ण तृतीया चंद्र',
  'Last Quarter': 'कृष्ण अष्टमी चंद्र',
  'Waning Crescent': 'कृष्ण एकादशी चंद्र',
};

export const PAKSHA_HI: Record<string, string> = {
  'Shukla': 'शुक्ल',
  'Krishna': 'कृष्ण',
};

export const AYANA_HI: Record<string, string> = {
  'Uttarayana': 'उत्तरायण',
  'Dakshinayana': 'दक्षिणायन',
};

export const RITU_HI: Record<string, { vedic: string; english: string }> = {
  'Vasanta': { vedic: 'वसंत', english: 'बसंत' },
  'Grishma': { vedic: 'ग्रीष्म', english: 'गर्मी' },
  'Varsha': { vedic: 'वर्षा', english: 'बरसात' },
  'Sharad': { vedic: 'शरद', english: 'पतझड़' },
  'Hemanta': { vedic: 'हेमंत', english: 'शिशिर पूर्व' },
  'Shishira': { vedic: 'शिशिर', english: 'सर्दी' },
};
