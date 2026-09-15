"use strict";
/**
 * Panchang constants — astronomical degrees, names, and lookup tables.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.grahaName = exports.PLANETS_NE = exports.PLANETS_HI = exports.LUNAR_MONTHS_NE = exports.RITU_NE = exports.AYANA_NE = exports.PAKSHA_NE = exports.MOON_PHASES_NE = exports.VARA_NAMES_NE = exports.RASHIS_NE = exports.KARANA_NAMES_FIXED_NE = exports.KARANA_NAMES_REPEATING_NE = exports.YOGA_NAMES_NE = exports.NAKSHATRAS_NE = exports.TITHI_NAMES_NE = exports.RITU_HI = exports.AYANA_HI = exports.PAKSHA_HI = exports.MOON_PHASES_HI = exports.VARA_NAMES_HI = exports.VARA_NAMES = exports.RASHIS_HI = exports.KARANA_NAMES_FIXED_HI = exports.KARANA_NAMES_REPEATING_HI = exports.YOGA_NAMES_HI = exports.NAKSHATRAS_HI = exports.TITHI_NAMES_HI = exports.RASHIS = exports.KARANA_NAMES_FIXED = exports.KARANA_NAMES_REPEATING = exports.YOGA_NAMES = exports.NAKSHATRAS = exports.TITHI_NAMES = exports.normalizeAngle = exports.DEGREES_PER_RASHI = exports.DEGREES_PER_YOGA = exports.DEGREES_PER_PADA = exports.DEGREES_PER_NAKSHATRA = exports.DEGREES_PER_TITHI = void 0;
// ---------------------------------------------------------------------------
// Degree constants
// ---------------------------------------------------------------------------
exports.DEGREES_PER_TITHI = 12;
exports.DEGREES_PER_NAKSHATRA = 13.333333;
exports.DEGREES_PER_PADA = 3.333333;
exports.DEGREES_PER_YOGA = 13.333333;
exports.DEGREES_PER_RASHI = 30;
// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function normalizeAngle(angle) {
    let normalized = angle % 360;
    if (normalized < 0) {
        normalized += 360;
    }
    return normalized;
}
exports.normalizeAngle = normalizeAngle;
// ---------------------------------------------------------------------------
// Tithi names (30 total: 15 Shukla + 15 Krishna)
// Index 0-14 = Shukla Paksha; index 15-29 = Krishna Paksha
// The 15th tithi of each paksha is Purnima / Amavasya respectively.
// ---------------------------------------------------------------------------
exports.TITHI_NAMES = [
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
exports.NAKSHATRAS = [
    { name: 'Ashwini', lord: 'Ketu', deity: 'Ashwini Kumaras' },
    { name: 'Bharani', lord: 'Venus', deity: 'Yama' },
    { name: 'Krittika', lord: 'Sun', deity: 'Agni' },
    { name: 'Rohini', lord: 'Moon', deity: 'Brahma' },
    { name: 'Mrigashira', lord: 'Mars', deity: 'Soma' },
    { name: 'Ardra', lord: 'Rahu', deity: 'Rudra' },
    { name: 'Punarvasu', lord: 'Jupiter', deity: 'Aditi' },
    { name: 'Pushya', lord: 'Saturn', deity: 'Brihaspati' },
    { name: 'Ashlesha', lord: 'Mercury', deity: 'Nagas' },
    { name: 'Magha', lord: 'Ketu', deity: 'Pitrs' },
    { name: 'Purva Phalguni', lord: 'Venus', deity: 'Bhaga' },
    { name: 'Uttara Phalguni', lord: 'Sun', deity: 'Aryaman' },
    { name: 'Hasta', lord: 'Moon', deity: 'Savitar' },
    { name: 'Chitra', lord: 'Mars', deity: 'Vishvakarma' },
    { name: 'Swati', lord: 'Rahu', deity: 'Vayu' },
    { name: 'Vishakha', lord: 'Jupiter', deity: 'Indragni' },
    { name: 'Anuradha', lord: 'Saturn', deity: 'Mitra' },
    { name: 'Jyeshtha', lord: 'Mercury', deity: 'Indra' },
    { name: 'Moola', lord: 'Ketu', deity: 'Nirriti' },
    { name: 'Purva Ashadha', lord: 'Venus', deity: 'Apah' },
    { name: 'Uttara Ashadha', lord: 'Sun', deity: 'Vishvedevas' },
    { name: 'Shravana', lord: 'Moon', deity: 'Vishnu' },
    { name: 'Dhanishtha', lord: 'Mars', deity: 'Vasus' },
    { name: 'Shatabhisha', lord: 'Rahu', deity: 'Varuna' },
    { name: 'Purva Bhadrapada', lord: 'Jupiter', deity: 'Ajaikapat' },
    { name: 'Uttara Bhadrapada', lord: 'Saturn', deity: 'Ahirbudhnya' },
    { name: 'Revati', lord: 'Mercury', deity: 'Pushan' },
];
// ---------------------------------------------------------------------------
// Yoga names (27)
// ---------------------------------------------------------------------------
exports.YOGA_NAMES = [
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
exports.KARANA_NAMES_REPEATING = [
    'Bava',
    'Balava',
    'Kaulava',
    'Taitila',
    'Garija',
    'Vanija',
    'Vishti',
];
/** 4 fixed karanas (occur once per lunar month at the end) */
exports.KARANA_NAMES_FIXED = [
    'Shakuni',
    'Chatushpad',
    'Naga',
    'Kimstughna',
];
// ---------------------------------------------------------------------------
// Rashis (12)
// ---------------------------------------------------------------------------
exports.RASHIS = [
    { name: 'Aries', sanskritName: 'Mesha', lord: 'Mars', element: 'Fire' },
    { name: 'Taurus', sanskritName: 'Vrishabha', lord: 'Venus', element: 'Earth' },
    { name: 'Gemini', sanskritName: 'Mithuna', lord: 'Mercury', element: 'Air' },
    { name: 'Cancer', sanskritName: 'Karka', lord: 'Moon', element: 'Water' },
    { name: 'Leo', sanskritName: 'Simha', lord: 'Sun', element: 'Fire' },
    { name: 'Virgo', sanskritName: 'Kanya', lord: 'Mercury', element: 'Earth' },
    { name: 'Libra', sanskritName: 'Tula', lord: 'Venus', element: 'Air' },
    { name: 'Scorpio', sanskritName: 'Vrishchika', lord: 'Mars', element: 'Water' },
    { name: 'Sagittarius', sanskritName: 'Dhanu', lord: 'Jupiter', element: 'Fire' },
    { name: 'Capricorn', sanskritName: 'Makara', lord: 'Saturn', element: 'Earth' },
    { name: 'Aquarius', sanskritName: 'Kumbha', lord: 'Saturn', element: 'Air' },
    { name: 'Pisces', sanskritName: 'Meena', lord: 'Jupiter', element: 'Water' },
];
exports.TITHI_NAMES_HI = [
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
exports.NAKSHATRAS_HI = [
    { name: 'अश्विनी', lord: 'केतु', deity: 'अश्विनी कुमार' },
    { name: 'भरणी', lord: 'शुक्र', deity: 'यम' },
    { name: 'कृत्तिका', lord: 'सूर्य', deity: 'अग्नि' },
    { name: 'रोहिणी', lord: 'चंद्र', deity: 'ब्रह्मा' },
    { name: 'मृगशिरा', lord: 'मंगल', deity: 'सोम' },
    { name: 'आर्द्रा', lord: 'राहु', deity: 'रुद्र' },
    { name: 'पुनर्वसु', lord: 'गुरु', deity: 'अदिति' },
    { name: 'पुष्य', lord: 'शनि', deity: 'बृहस्पति' },
    { name: 'आश्लेषा', lord: 'बुध', deity: 'नाग' },
    { name: 'मघा', lord: 'केतु', deity: 'पितर' },
    { name: 'पूर्वाफाल्गुनी', lord: 'शुक्र', deity: 'भग' },
    { name: 'उत्तराफाल्गुनी', lord: 'सूर्य', deity: 'अर्यमा' },
    { name: 'हस्त', lord: 'चंद्र', deity: 'सवितर' },
    { name: 'चित्रा', lord: 'मंगल', deity: 'विश्वकर्मा' },
    { name: 'स्वाति', lord: 'राहु', deity: 'वायु' },
    { name: 'विशाखा', lord: 'गुरु', deity: 'इंद्राग्नि' },
    { name: 'अनुराधा', lord: 'शनि', deity: 'मित्र' },
    { name: 'ज्येष्ठा', lord: 'बुध', deity: 'इंद्र' },
    { name: 'मूल', lord: 'केतु', deity: 'निर्ऋति' },
    { name: 'पूर्वाषाढ़ा', lord: 'शुक्र', deity: 'अपः' },
    { name: 'उत्तराषाढ़ा', lord: 'सूर्य', deity: 'विश्वेदेव' },
    { name: 'श्रवण', lord: 'चंद्र', deity: 'विष्णु' },
    { name: 'धनिष्ठा', lord: 'मंगल', deity: 'वसु' },
    { name: 'शतभिषा', lord: 'राहु', deity: 'वरुण' },
    { name: 'पूर्वाभाद्रपद', lord: 'गुरु', deity: 'अजैकपाद' },
    { name: 'उत्तराभाद्रपद', lord: 'शनि', deity: 'अहिर्बुध्न्य' },
    { name: 'रेवती', lord: 'बुध', deity: 'पूषन' },
];
exports.YOGA_NAMES_HI = [
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
exports.KARANA_NAMES_REPEATING_HI = [
    'बव',
    'बालव',
    'कौलव',
    'तैतिल',
    'गरिज',
    'वणिज',
    'विष्टि',
];
exports.KARANA_NAMES_FIXED_HI = [
    'शकुनि',
    'चतुष्पद',
    'नाग',
    'किंस्तुघ्न',
];
exports.RASHIS_HI = [
    { name: 'मेष', sanskritName: 'मेष', lord: 'मंगल', element: 'अग्नि' },
    { name: 'वृषभ', sanskritName: 'वृषभ', lord: 'शुक्र', element: 'पृथ्वी' },
    { name: 'मिथुन', sanskritName: 'मिथुन', lord: 'बुध', element: 'वायु' },
    { name: 'कर्क', sanskritName: 'कर्क', lord: 'चंद्र', element: 'जल' },
    { name: 'सिंह', sanskritName: 'सिंह', lord: 'सूर्य', element: 'अग्नि' },
    { name: 'कन्या', sanskritName: 'कन्या', lord: 'बुध', element: 'पृथ्वी' },
    { name: 'तुला', sanskritName: 'तुला', lord: 'शुक्र', element: 'वायु' },
    { name: 'वृश्चिक', sanskritName: 'वृश्चिक', lord: 'मंगल', element: 'जल' },
    { name: 'धनु', sanskritName: 'धनु', lord: 'गुरु', element: 'अग्नि' },
    { name: 'मकर', sanskritName: 'मकर', lord: 'शनि', element: 'पृथ्वी' },
    { name: 'कुंभ', sanskritName: 'कुंभ', lord: 'शनि', element: 'वायु' },
    { name: 'मीन', sanskritName: 'मीन', lord: 'गुरु', element: 'जल' },
];
exports.VARA_NAMES = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
exports.VARA_NAMES_HI = [
    'रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार',
];
exports.MOON_PHASES_HI = {
    'New Moon': 'अमावस्या',
    'Waxing Crescent': 'शुक्ल द्वितीया चंद्र',
    'First Quarter': 'शुक्ल अष्टमी चंद्र',
    'Waxing Gibbous': 'शुक्ल एकादशी चंद्र',
    'Full Moon': 'पूर्णिमा',
    'Waning Gibbous': 'कृष्ण तृतीया चंद्र',
    'Last Quarter': 'कृष्ण अष्टमी चंद्र',
    'Waning Crescent': 'कृष्ण एकादशी चंद्र',
};
exports.PAKSHA_HI = {
    'Shukla': 'शुक्ल',
    'Krishna': 'कृष्ण',
};
exports.AYANA_HI = {
    'Uttarayana': 'उत्तरायण',
    'Dakshinayana': 'दक्षिणायन',
};
exports.RITU_HI = {
    'Vasanta': { vedic: 'वसंत', english: 'बसंत' },
    'Grishma': { vedic: 'ग्रीष्म', english: 'गर्मी' },
    'Varsha': { vedic: 'वर्षा', english: 'बरसात' },
    'Sharad': { vedic: 'शरद', english: 'पतझड़' },
    'Hemanta': { vedic: 'हेमंत', english: 'शिशिर पूर्व' },
    'Shishira': { vedic: 'शिशिर', english: 'सर्दी' },
};
// ---------------------------------------------------------------------------
// Nepali translations
// ---------------------------------------------------------------------------
//
// 73% of this app's users are in Nepal, and no major competitor ships a Nepali
// kundli. Nepali and Hindi share Devanagari and most panchang vocabulary is the
// SAME Sanskrit term in both — where that is so, the Hindi string is reused
// verbatim and that is CORRECT, not lazy. Only the genuine differences are
// spelled out below, each with the reason:
//
//   1. WEEKDAYS are wholly different: Hindi -वार vs Nepali -बार, and Sunday is
//      आइतबार, not रविवार. This is the most visible difference on the page.
//   2. NO NUKTA. Nepali Devanagari does not use ड़/ढ़. Hindi आषाढ़ / पूर्वाषाढ़ा
//      are आषाढ / पूर्वाषाढा in Nepali.
//   3. CONJUNCTS OVER ANUSVARA. Nepali orthography writes the full conjunct
//      where Hindi uses anusvara: चन्द्र not चंद्र, इन्द्र not इंद्र, कुम्भ not
//      कुंभ, पञ्चमी not पंचमी, हेमन्त not हेमंत, and the WEEKDAY मङ्गलबार.
//      ⚠ The PLANET Mars is the exception: spelled मंगल, because the app's
//      PLANETS_NE spells it that way and the engine must not contradict the
//      app on screen (see the graha map at the foot of this file). Nepali
//      would arguably write मङ्गल — a one-word content call that belongs in
//      the app's table, not here. Jupiter follows the app too: बृहस्पति.
//   4. औंसी is the Nepali word for the new-moon day, printed on every Nepali
//      patro. अमावस्या is understood too, but औंसी is what a Nepali reads.
//
// Everything not listed above is the shared Sanskrit form, kept deliberately.
// An invented "Nepali-looking" word would be worse than either language.
exports.TITHI_NAMES_NE = [
    // शुक्ल पक्ष (1–15) — tithi names are Sanskrit and shared with Hindi;
    // only पञ्चमी takes the Nepali conjunct spelling.
    'शुक्ल प्रतिपदा',
    'शुक्ल द्वितीया',
    'शुक्ल तृतीया',
    'शुक्ल चतुर्थी',
    'शुक्ल पञ्चमी',
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
    'कृष्ण पञ्चमी',
    'कृष्ण षष्ठी',
    'कृष्ण सप्तमी',
    'कृष्ण अष्टमी',
    'कृष्ण नवमी',
    'कृष्ण दशमी',
    'कृष्ण एकादशी',
    'कृष्ण द्वादशी',
    'कृष्ण त्रयोदशी',
    'कृष्ण चतुर्दशी',
    'औंसी', // Nepali patro term for Amavasya
];
// Nakshatra names are Sanskrit and shared. The Nepali-specific edits are:
// पूर्वाषाढा/उत्तराषाढा (no nukta), स्वाती (long ī, as Nepali patro prints it),
// and the graha names in the lord column, which follow the shared graha map
// at the foot of this file (चन्द्र / मंगल / बृहस्पति) so the engine and the app
// never print two spellings of one planet. इन्द्र in the deity column is the
// DEITY Indra, not a planet, and keeps the Nepali conjunct.
exports.NAKSHATRAS_NE = [
    { name: 'अश्विनी', lord: 'केतु', deity: 'अश्विनी कुमार' },
    { name: 'भरणी', lord: 'शुक्र', deity: 'यम' },
    { name: 'कृत्तिका', lord: 'सूर्य', deity: 'अग्नि' },
    { name: 'रोहिणी', lord: 'चन्द्र', deity: 'ब्रह्मा' },
    { name: 'मृगशिरा', lord: 'मंगल', deity: 'सोम' },
    { name: 'आर्द्रा', lord: 'राहु', deity: 'रुद्र' },
    { name: 'पुनर्वसु', lord: 'बृहस्पति', deity: 'अदिति' },
    { name: 'पुष्य', lord: 'शनि', deity: 'बृहस्पति' },
    { name: 'आश्लेषा', lord: 'बुध', deity: 'नाग' },
    { name: 'मघा', lord: 'केतु', deity: 'पितर' },
    { name: 'पूर्वाफाल्गुनी', lord: 'शुक्र', deity: 'भग' },
    { name: 'उत्तराफाल्गुनी', lord: 'सूर्य', deity: 'अर्यमा' },
    { name: 'हस्त', lord: 'चन्द्र', deity: 'सवितर' },
    { name: 'चित्रा', lord: 'मंगल', deity: 'विश्वकर्मा' },
    { name: 'स्वाती', lord: 'राहु', deity: 'वायु' },
    { name: 'विशाखा', lord: 'बृहस्पति', deity: 'इन्द्राग्नि' },
    { name: 'अनुराधा', lord: 'शनि', deity: 'मित्र' },
    { name: 'ज्येष्ठा', lord: 'बुध', deity: 'इन्द्र' },
    { name: 'मूल', lord: 'केतु', deity: 'निर्ऋति' },
    { name: 'पूर्वाषाढा', lord: 'शुक्र', deity: 'अपः' },
    { name: 'उत्तराषाढा', lord: 'सूर्य', deity: 'विश्वेदेव' },
    { name: 'श्रवण', lord: 'चन्द्र', deity: 'विष्णु' },
    { name: 'धनिष्ठा', lord: 'मंगल', deity: 'वसु' },
    { name: 'शतभिषा', lord: 'राहु', deity: 'वरुण' },
    { name: 'पूर्वाभाद्रपद', lord: 'बृहस्पति', deity: 'अजैकपाद' },
    { name: 'उत्तराभाद्रपद', lord: 'शनि', deity: 'अहिर्बुध्न्य' },
    { name: 'रेवती', lord: 'बुध', deity: 'पूषन' },
];
// The 27 yogas are Sanskrit; only इन्द्र differs from Hindi (conjunct, not anusvara).
exports.YOGA_NAMES_NE = [
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
    'इन्द्र',
    'वैधृति',
];
// Karana names are identical in both languages — shared Sanskrit, kept as-is.
exports.KARANA_NAMES_REPEATING_NE = [
    'बव',
    'बालव',
    'कौलव',
    'तैतिल',
    'गरिज',
    'वणिज',
    'विष्टि',
];
exports.KARANA_NAMES_FIXED_NE = [
    'शकुनि',
    'चतुष्पद',
    'नाग',
    'किंस्तुघ्न',
];
// Rashi names are shared Sanskrit except कुम्भ (conjunct); the lord column
// carries the graha names from the shared map (मंगल / चन्द्र / बृहस्पति).
// Elements are the same words in both languages.
exports.RASHIS_NE = [
    { name: 'मेष', sanskritName: 'मेष', lord: 'मंगल', element: 'अग्नि' },
    { name: 'वृषभ', sanskritName: 'वृषभ', lord: 'शुक्र', element: 'पृथ्वी' },
    { name: 'मिथुन', sanskritName: 'मिथुन', lord: 'बुध', element: 'वायु' },
    { name: 'कर्क', sanskritName: 'कर्क', lord: 'चन्द्र', element: 'जल' },
    { name: 'सिंह', sanskritName: 'सिंह', lord: 'सूर्य', element: 'अग्नि' },
    { name: 'कन्या', sanskritName: 'कन्या', lord: 'बुध', element: 'पृथ्वी' },
    { name: 'तुला', sanskritName: 'तुला', lord: 'शुक्र', element: 'वायु' },
    { name: 'वृश्चिक', sanskritName: 'वृश्चिक', lord: 'मंगल', element: 'जल' },
    { name: 'धनु', sanskritName: 'धनु', lord: 'बृहस्पति', element: 'अग्नि' },
    { name: 'मकर', sanskritName: 'मकर', lord: 'शनि', element: 'पृथ्वी' },
    { name: 'कुम्भ', sanskritName: 'कुम्भ', lord: 'शनि', element: 'वायु' },
    { name: 'मीन', sanskritName: 'मीन', lord: 'बृहस्पति', element: 'जल' },
];
// ⚠ The clearest real difference. Nepali weekdays take -बार, not Hindi -वार,
// and Sunday/Thursday are different words entirely (आइतबार, बिहीबार).
exports.VARA_NAMES_NE = [
    'आइतबार', 'सोमबार', 'मङ्गलबार', 'बुधबार', 'बिहीबार', 'शुक्रबार', 'शनिबार',
];
exports.MOON_PHASES_NE = {
    'New Moon': 'औंसी',
    'Waxing Crescent': 'शुक्ल द्वितीया चन्द्र',
    'First Quarter': 'शुक्ल अष्टमी चन्द्र',
    'Waxing Gibbous': 'शुक्ल एकादशी चन्द्र',
    'Full Moon': 'पूर्णिमा',
    'Waning Gibbous': 'कृष्ण तृतीया चन्द्र',
    'Last Quarter': 'कृष्ण अष्टमी चन्द्र',
    'Waning Crescent': 'कृष्ण एकादशी चन्द्र',
};
// Paksha and ayana are the same words in Nepali — shared deliberately.
exports.PAKSHA_NE = {
    'Shukla': 'शुक्ल',
    'Krishna': 'कृष्ण',
};
exports.AYANA_NE = {
    'Uttarayana': 'उत्तरायण',
    'Dakshinayana': 'दक्षिणायन',
};
// Vedic ritu names are shared Sanskrit (हेमन्त takes the Nepali conjunct);
// the colloquial column is genuinely Nepali: बर्खा for the monsoon and जाडो
// for winter, where Hindi says बरसात and सर्दी.
exports.RITU_NE = {
    'Vasanta': { vedic: 'वसन्त', english: 'बसन्त' },
    'Grishma': { vedic: 'ग्रीष्म', english: 'गर्मी' },
    'Varsha': { vedic: 'वर्षा', english: 'बर्खा' },
    'Sharad': { vedic: 'शरद', english: 'शरद' },
    'Hemanta': { vedic: 'हेमन्त', english: 'हेमन्त' },
    'Shishira': { vedic: 'शिशिर', english: 'जाडो' },
};
// Lunar (masa) month names — these are the SANSKRIT lunar months, NOT the
// Bikram Sambat solar months a Nepali reader knows as बैशाख/जेठ/असार. Do not
// swap those in: they name a different thing. Only आषाढ loses its Hindi nukta.
exports.LUNAR_MONTHS_NE = [
    'वैशाख', 'ज्येष्ठ', 'आषाढ', 'श्रावण',
    'भाद्रपद', 'आश्विन', 'कार्तिक', 'मार्गशीर्ष',
    'पौष', 'माघ', 'फाल्गुन', 'चैत्र',
];
// ---------------------------------------------------------------------------
// Graha names — THE one shared map
// ---------------------------------------------------------------------------
//
// Yoga names and descriptions interpolate a planet, and for a long time they
// interpolated the raw ENGLISH name into Devanagari prose — a Hindi report read
// "राजयोग (Jupiter-Mars परिवर्तन)". This map is the single place that is fixed.
//
// ⚠ SPELLINGS ARE COPIED FROM THE APP, deliberately: mobile/data/predictions/
// types.ts PLANETS_HI (:110) and PLANETS_NE (:115). The engine cannot import
// from the app, so this is a second copy — but it must never be a second
// OPINION. If a spelling changes, change it in both, and change it here to
// match the app rather than the other way round: the app's string is the one
// the rest of the screen is already rendering.
//
// Keep this the only graha-name table in the engine. SIGN_LORDS was duplicated
// across two files once and drifted; that is the failure mode being avoided.
exports.PLANETS_HI = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};
exports.PLANETS_NE = {
    Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध',
    Jupiter: 'बृहस्पति', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु',
};
/**
 * English graha name -> localized name. Falls back to the English name for an
 * unrecognised planet and for lang 'en', so an unexpected value prints
 * something readable instead of `undefined`.
 */
function grahaName(englishName, lang) {
    if (lang === 'hi')
        return exports.PLANETS_HI[englishName] ?? englishName;
    if (lang === 'ne')
        return exports.PLANETS_NE[englishName] ?? englishName;
    return englishName;
}
exports.grahaName = grahaName;
