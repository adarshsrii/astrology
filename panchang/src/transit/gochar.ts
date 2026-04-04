/**
 * Gochar (Transit) Engine
 *
 * Calculates daily horoscope based on Vedic transit rules.
 * Uses planetary positions from Swiss Ephemeris, applies classical
 * Gochar rules from Phaladeepika, and checks Vedha (obstruction).
 */

import { Ephemeris } from '../calculations/ephemeris';
import { Planetary } from '../calculations/planetary';
import {
  DailyHoroscope,
  PlanetTransit,
  LifeAreaPrediction,
  LifeArea,
  TransitInterpretation,
} from './types';
import {
  TRANSIT_RULES,
  TRANSIT_INTERPRETATIONS,
  PLANET_WEIGHTS,
  PLANET_AREA_MAP,
  RASHI_NAMES,
  LUCKY_BY_SIGN,
  RATING_SUMMARIES,
} from './constants';

// ── Helpers ──────────────────────────────────────────────────────────────────

const ALL_PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

/**
 * Calculate house number of a planet from the natal Moon sign.
 * House 1 = Moon's sign, House 2 = next sign, etc.
 */
function getHouseFromMoon(planetRashiNum: number, moonRashiNum: number): number {
  // Both are 1-based (1=Aries ... 12=Pisces)
  const house = ((planetRashiNum - moonRashiNum + 12) % 12) + 1;
  return house;
}

/**
 * Get rashi number (1-12) from sidereal longitude.
 */
function rashiFromLongitude(siderealLongitude: number): number {
  return Math.floor(siderealLongitude / 30) + 1;
}

/**
 * Check if Vedha (obstruction) is active for a favorable transit.
 * Returns the obstructing planet name, or null if no Vedha.
 */
function checkVedha(
  planet: string,
  houseFromMoon: number,
  allPlanetHouses: Record<string, number>,
): string | null {
  const rules = TRANSIT_RULES[planet];
  if (!rules) return null;

  // Vedha only applies to favorable houses
  if (!rules.favorableHouses.includes(houseFromMoon)) return null;

  const vedhaHouse = rules.vedhaPairs[houseFromMoon];
  if (!vedhaHouse) return null;

  // Check if any OTHER planet is in the Vedha house
  // (Sun-Moon pair is exempt from mutual Vedha per Phaladeepika)
  for (const [otherPlanet, otherHouse] of Object.entries(allPlanetHouses)) {
    if (otherPlanet === planet) continue;

    // Sun and Moon don't cause Vedha to each other
    if (
      (planet === 'Sun' && otherPlanet === 'Moon') ||
      (planet === 'Moon' && otherPlanet === 'Sun')
    ) {
      continue;
    }

    if (otherHouse === vedhaHouse) {
      return otherPlanet;
    }
  }

  return null;
}

/**
 * Build the interpretation for a planet's transit, considering Vedha.
 */
function getEffectiveInterpretation(
  planet: string,
  houseFromMoon: number,
  isFavorable: boolean,
  isVedhaActive: boolean,
): TransitInterpretation {
  const base = TRANSIT_INTERPRETATIONS[planet]?.[houseFromMoon];

  if (!base) {
    return {
      en: 'Transit effects are mild and mixed.',
      hi: 'गोचर प्रभाव हल्के और मिश्रित हैं।',
      areas: ['general'],
      effect: 'neutral',
      intensity: 1,
    };
  }

  // If Vedha cancels a favorable transit, reduce to neutral
  if (isFavorable && isVedhaActive) {
    return {
      en: `${base.en} (Effects reduced due to Vedha obstruction.)`,
      hi: `${base.hi} (वेध बाधा के कारण प्रभाव कम।)`,
      areas: base.areas,
      effect: 'neutral',
      intensity: Math.max(1, base.intensity - 1),
    };
  }

  return base;
}

// ── Life Area Aggregation ────────────────────────────────────────────────────

const AREA_LABELS: Record<LifeArea, { en: string; hi: string }> = {
  career: { en: 'Career & Work', hi: 'करियर और कार्य' },
  finance: { en: 'Finance & Wealth', hi: 'वित्त और धन' },
  health: { en: 'Health & Wellbeing', hi: 'स्वास्थ्य और कल्याण' },
  relationships: { en: 'Love & Relationships', hi: 'प्रेम और संबंध' },
  spiritual: { en: 'Spiritual Growth', hi: 'आध्यात्मिक विकास' },
  general: { en: 'General', hi: 'सामान्य' },
};

function aggregateAreas(transits: PlanetTransit[]): LifeAreaPrediction[] {
  const areas: LifeArea[] = ['career', 'finance', 'health', 'relationships', 'spiritual'];
  const results: LifeAreaPrediction[] = [];

  for (const area of areas) {
    let score = 0;
    const contributingPlanets: string[] = [];
    const predictions: { en: string; hi: string }[] = [];

    for (const transit of transits) {
      const planetAreas = PLANET_AREA_MAP[transit.planet] || ['general'];
      if (!planetAreas.includes(area) && !transit.interpretation.areas.includes(area)) continue;

      const weight = PLANET_WEIGHTS[transit.planet] || 0.5;
      const intensity = transit.interpretation.intensity;
      let effect = 0;

      if (transit.interpretation.effect === 'favorable') {
        effect = intensity * weight * 22;
      } else if (transit.interpretation.effect === 'unfavorable') {
        const penalty = intensity >= 3 ? 14 : intensity >= 2 ? 7 : 2;
        effect = -penalty * weight;
      }
      // Vedha-reduced transits contribute less
      if (transit.isVedhaActive) {
        effect *= 0.3;
      }

      score += effect;
      contributingPlanets.push(transit.planet);

      if (transit.interpretation.areas.includes(area)) {
        predictions.push({
          en: transit.interpretation.en,
          hi: transit.interpretation.hi,
        });
      }
    }

    // Clamp score to -100..+100
    score = Math.max(-100, Math.min(100, Math.round(score)));

    // Pick the most relevant prediction for this area
    const bestPrediction = predictions[0] || { en: 'No strong planetary influence on this area today.', hi: 'आज इस क्षेत्र पर कोई मजबूत ग्रह प्रभाव नहीं।' };

    results.push({
      area,
      label: AREA_LABELS[area].en,
      labelHi: AREA_LABELS[area].hi,
      score,
      prediction: bestPrediction.en,
      predictionHi: bestPrediction.hi,
      planets: [...new Set(contributingPlanets)],
    });
  }

  return results;
}

// ── Caution Generator ────────────────────────────────────────────────────────

function generateCaution(transits: PlanetTransit[]): { en: string; hi: string } {
  const warnings: { en: string; hi: string }[] = [];

  for (const t of transits) {
    if (t.interpretation.effect === 'unfavorable' && t.interpretation.intensity >= 3) {
      if (t.planet === 'Saturn') {
        warnings.push({
          en: 'Saturn\'s heavy influence warrants extra caution. Avoid risky decisions.',
          hi: 'शनि के भारी प्रभाव में अतिरिक्त सावधानी बरतें। जोखिम भरे निर्णयों से बचें।',
        });
      } else if (t.planet === 'Mars') {
        warnings.push({
          en: 'Mars brings aggression — control temper and avoid conflicts.',
          hi: 'मंगल आक्रामकता लाता है — क्रोध नियंत्रित करें और संघर्ष से बचें।',
        });
      } else if (t.planet === 'Rahu') {
        warnings.push({
          en: 'Rahu creates illusions — verify facts before acting.',
          hi: 'राहु भ्रम पैदा करता है — कार्य करने से पहले तथ्य सत्यापित करें।',
        });
      }
    }
  }

  if (warnings.length === 0) {
    return {
      en: 'No major cautions for today. Proceed with normal awareness.',
      hi: 'आज कोई बड़ी सावधानी नहीं। सामान्य जागरूकता के साथ आगे बढ़ें।',
    };
  }

  return {
    en: warnings.map(w => w.en).join(' '),
    hi: warnings.map(w => w.hi).join(' '),
  };
}

// ── Main Function ────────────────────────────────────────────────────────────

export interface GocharInput {
  /** Date for horoscope calculation */
  date: Date;
  /** Natal Moon sign number (1=Aries, 2=Taurus, ..., 12=Pisces) */
  moonSignNumber: number;
  /** Latitude for planetary position calculation */
  latitude?: number;
  /** Longitude for planetary position calculation */
  longitude?: number;
  /** Timezone identifier */
  timezone?: string;
}

/**
 * Calculate daily horoscope based on Vedic Gochar (transit) system.
 *
 * @param input - Date and natal Moon sign
 * @returns Complete daily horoscope with transit analysis
 */
export function calculateDailyHoroscope(input: GocharInput): DailyHoroscope {
  const {
    date,
    moonSignNumber,
  } = input;

  if (moonSignNumber < 1 || moonSignNumber > 12) {
    throw new Error(`Invalid moonSignNumber: ${moonSignNumber}. Must be 1-12.`);
  }

  const ephemeris = new Ephemeris();

  try {
    // ── Step 1: Calculate current sidereal positions of all planets ──
    const planetPositions: Record<string, { siderealLongitude: number; rashiNumber: number }> = {};

    for (const planet of ALL_PLANETS) {
      try {
        const sidereal = ephemeris.calculateSiderealPosition(date, planet);
        const rashiNum = rashiFromLongitude(sidereal.longitude);
        planetPositions[planet] = {
          siderealLongitude: sidereal.longitude,
          rashiNumber: rashiNum,
        };
      } catch (err) {
        // Skip planet if calculation fails
        console.warn(`Skipping ${planet}: ${err}`);
      }
    }

    // ── Step 2: Calculate house from Moon for each planet ──
    const planetHouses: Record<string, number> = {};
    for (const [planet, pos] of Object.entries(planetPositions)) {
      planetHouses[planet] = getHouseFromMoon(pos.rashiNumber, moonSignNumber);
    }

    // ── Step 3: Build transit analysis for each planet ──
    const transits: PlanetTransit[] = [];

    for (const [planet, pos] of Object.entries(planetPositions)) {
      const houseFromMoon = planetHouses[planet];
      const rules = TRANSIT_RULES[planet];
      const isFavorable = rules ? rules.favorableHouses.includes(houseFromMoon) : false;

      // Check Vedha
      const vedhaPlanet = checkVedha(planet, houseFromMoon, planetHouses);
      const isVedhaActive = vedhaPlanet !== null;

      // Get interpretation
      const interpretation = getEffectiveInterpretation(planet, houseFromMoon, isFavorable, isVedhaActive);

      transits.push({
        planet,
        currentRashi: RASHI_NAMES[pos.rashiNumber - 1]?.en || 'Unknown',
        currentRashiNumber: pos.rashiNumber,
        houseFromMoon,
        isFavorable,
        isVedhaActive,
        vedhaPlanet: vedhaPlanet || undefined,
        interpretation,
        longitude: pos.siderealLongitude,
      });
    }

    // Sort transits by planet weight (most impactful first)
    transits.sort((a, b) => (PLANET_WEIGHTS[b.planet] || 0) - (PLANET_WEIGHTS[a.planet] || 0));

    // ── Step 4: Calculate overall score ──
    // Scoring rationale: most houses are unfavorable for most planets, so
    // we weight favorable transits more heavily (+) and penalize only
    // high-intensity unfavorable ones strongly. This keeps a "normal" day
    // near 0 rather than deeply negative.
    let overallScore = 0;
    for (const transit of transits) {
      const weight = PLANET_WEIGHTS[transit.planet] || 0.5;
      const intensity = transit.interpretation.intensity;

      if (transit.interpretation.effect === 'favorable' && !transit.isVedhaActive) {
        overallScore += intensity * weight * 18;
      } else if (transit.interpretation.effect === 'unfavorable') {
        // Only penalize strongly for high-intensity afflictions (intensity 3)
        // Mild unfavorable (intensity 1) barely moves the needle
        const penalty = intensity >= 3 ? 12 : intensity >= 2 ? 6 : 2;
        overallScore -= penalty * weight;
      } else if (transit.interpretation.effect === 'neutral') {
        overallScore += intensity * weight * 3;
      }
    }

    overallScore = Math.max(-100, Math.min(100, Math.round(overallScore)));

    // ── Step 5: Determine rating ──
    let rating: DailyHoroscope['rating'];
    if (overallScore >= 40) rating = 'excellent';
    else if (overallScore >= 15) rating = 'good';
    else if (overallScore >= -15) rating = 'average';
    else if (overallScore >= -40) rating = 'challenging';
    else rating = 'difficult';

    // ── Step 6: Pick summary ──
    const summaries = RATING_SUMMARIES[rating];
    // Use day-of-year to pick a varying summary
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const summaryIndex = dayOfYear % summaries.length;
    const summary = summaries[summaryIndex];

    // ── Step 7: Aggregate life areas ──
    const areas = aggregateAreas(transits);

    // ── Step 8: Lucky elements ──
    // Vary the lucky number slightly by day
    const baseLucky = LUCKY_BY_SIGN[moonSignNumber] || LUCKY_BY_SIGN[1];
    const lucky = {
      ...baseLucky,
      number: ((baseLucky.number + (dayOfYear % 4)) % 9) + 1,
    };

    // ── Step 9: Caution ──
    const caution = generateCaution(transits);

    // ── Step 10: Moon sign info ──
    const moonSignName = RASHI_NAMES[moonSignNumber - 1] || { en: 'Unknown', hi: 'अज्ञात' };

    return {
      date,
      moonSign: moonSignName.en,
      moonSignHi: moonSignName.hi,
      moonSignNumber,
      overallScore,
      rating,
      summary: summary.en,
      summaryHi: summary.hi,
      transits,
      areas,
      lucky,
      caution: caution.en,
      cautionHi: caution.hi,
    };
  } finally {
    ephemeris.cleanup();
  }
}
