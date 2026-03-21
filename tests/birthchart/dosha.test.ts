/**
 * Tests for Dosha Analysis module.
 */

import {
  analyzeManglik,
  analyzeKaalSarp,
  analyzeGandaMoola,
  analyzeGandanta,
} from '../../panchang/src/birthchart/analysis/dosha';
import type { GrahaPosition, HouseInfo, LagnaInfo } from '../../panchang/src/birthchart/types';

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Create a minimal GrahaPosition for testing. */
function makeGraha(
  overrides: Partial<GrahaPosition> & { name: GrahaPosition['name'] },
): GrahaPosition {
  return {
    longitude: 0,
    latitude: 0,
    speed: 1,
    retrograde: false,
    signName: 'Aries',
    signNumber: 1,
    degreeInSign: 15,
    nakshatra: 'Bharani',
    nakshatraNumber: 2,
    nakshatraPada: 2,
    nakshatraLord: 'Venus',
    dignity: 'neutral',
    isCombust: false,
    combustOrb: 0,
    symbol: '',
    ...overrides,
  };
}

/** Create a minimal set of 12 houses with planets assigned. */
function makeHouses(planetMap: Record<number, string[]>): HouseInfo[] {
  const houses: HouseInfo[] = [];
  for (let i = 1; i <= 12; i++) {
    houses.push({
      number: i,
      signName: '',
      signNumber: i,
      cuspDegree: (i - 1) * 30,
      planets: (planetMap[i] || []) as any,
    });
  }
  return houses;
}

function makeLagna(overrides: Partial<LagnaInfo> = {}): LagnaInfo {
  return {
    longitude: 0,
    signName: 'Aries',
    signNumber: 1,
    degreeInSign: 15,
    nakshatra: 'Bharani',
    nakshatraNumber: 2,
    nakshatraPada: 2,
    nakshatraLord: 'Venus',
    ...overrides,
  };
}

// ── Manglik Dosha ──────────────────────────────────────────────────────────────

describe('Manglik Dosha', () => {
  test('Mars in 7th house = full Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Libra', signNumber: 7 }),
    ];
    const houses = makeHouses({ 7: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(true);
    expect(result.severity).toBe('full');
    expect(result.marsHouse).toBe(7);
  });

  test('Mars in 8th house = full Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Scorpio', signNumber: 8 }),
    ];
    // Scorpio is Mars own sign but house 8 → check cancellation
    // Actually Scorpio = own sign → cancellation applies
    const houses = makeHouses({ 8: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    // Mars in own sign → cancelled
    expect(result.isManglik).toBe(false);
    expect(result.severity).toBe('none');
  });

  test('Mars in 8th house with non-own sign = full Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Gemini', signNumber: 3 }),
    ];
    const houses = makeHouses({ 8: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(true);
    expect(result.severity).toBe('full');
  });

  test('Mars in 3rd house = not Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Gemini', signNumber: 3 }),
    ];
    const houses = makeHouses({ 3: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(false);
    expect(result.severity).toBe('none');
    expect(result.marsHouse).toBe(3);
  });

  test('Mars in own sign (Aries) cancels Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Aries', signNumber: 1 }),
    ];
    const houses = makeHouses({ 1: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(false);
    expect(result.severity).toBe('none');
    expect(result.cancellations.some((c) => c.includes('own sign'))).toBe(true);
  });

  test('Mars exalted in Capricorn cancels Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Capricorn', signNumber: 10 }),
    ];
    const houses = makeHouses({ 4: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(false);
    expect(result.severity).toBe('none');
    expect(result.cancellations.some((c) => c.includes('exalted'))).toBe(true);
  });

  test('Mars conjunct Jupiter cancels Manglik', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Gemini', signNumber: 3 }),
      makeGraha({ name: 'Jupiter', signName: 'Gemini', signNumber: 3 }),
    ];
    const houses = makeHouses({ 12: ['Mars', 'Jupiter'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(false);
    expect(result.cancellations.some((c) => c.includes('conjunct Jupiter'))).toBe(true);
  });

  test('Mars aspected by Jupiter = mild', () => {
    // Jupiter in house 5, aspects 9th (house 1), 11th (house 3), 7th (house 11) from itself
    // Jupiter aspects: 5+5=10, 5+7=12, 5+9=2  →  houses 10, 12, 2 (mod 12)
    // Actually: ((5-1+5) % 12)+1 = 10, ((5-1+7) % 12)+1 = 12, ((5-1+9) % 12)+1 = 2
    // So Jupiter in house 5 aspects houses 10, 12, 2
    // Put Mars in house 2 → aspected by Jupiter
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Taurus', signNumber: 2 }),
      makeGraha({ name: 'Jupiter', signName: 'Leo', signNumber: 5 }),
    ];
    const houses = makeHouses({ 2: ['Mars'], 5: ['Jupiter'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(true);
    expect(result.severity).toBe('mild');
    expect(result.cancellations.some((c) => c.includes('aspected by Jupiter'))).toBe(true);
  });

  test('Mars in fire sign in 1st house cancels Manglik', () => {
    // Leo is a fire sign (not Mars own sign)
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Leo', signNumber: 5 }),
    ];
    const houses = makeHouses({ 1: ['Mars'] });
    const result = analyzeManglik(planets, houses);
    expect(result.isManglik).toBe(false);
    expect(result.cancellations.some((c) => c.includes('fire sign'))).toBe(true);
  });
});

// ── Kaal Sarp Dosha ────────────────────────────────────────────────────────────

describe('Kaal Sarp Dosha', () => {
  test('all planets between Rahu-Ketu = dosha', () => {
    // Rahu in house 1, Ketu in house 7
    // Houses between 1→7 (exclusive): 2,3,4,5,6
    // Put all 7 planets in houses 2-6
    const planets = [
      makeGraha({ name: 'Sun' }),
      makeGraha({ name: 'Moon' }),
      makeGraha({ name: 'Mars' }),
      makeGraha({ name: 'Mercury' }),
      makeGraha({ name: 'Jupiter' }),
      makeGraha({ name: 'Venus' }),
      makeGraha({ name: 'Saturn' }),
      makeGraha({ name: 'Rahu' }),
      makeGraha({ name: 'Ketu' }),
    ];
    const houses = makeHouses({
      1: ['Rahu'],
      2: ['Sun', 'Moon'],
      3: ['Mars', 'Mercury'],
      5: ['Jupiter', 'Venus'],
      6: ['Saturn'],
      7: ['Ketu'],
    });
    const result = analyzeKaalSarp(planets, houses);
    expect(result.hasDosha).toBe(true);
    expect(result.type).toBe('Anant'); // Rahu in house 1
    expect(result.allPlanetsOnOneSide).toBe(true);
    expect(result.rahuHouse).toBe(1);
    expect(result.ketuHouse).toBe(7);
  });

  test('planet outside Rahu-Ketu axis = no dosha', () => {
    // Rahu in house 1, Ketu in house 7
    // Put Saturn in house 9 (outside the axis)
    const planets = [
      makeGraha({ name: 'Sun' }),
      makeGraha({ name: 'Moon' }),
      makeGraha({ name: 'Mars' }),
      makeGraha({ name: 'Mercury' }),
      makeGraha({ name: 'Jupiter' }),
      makeGraha({ name: 'Venus' }),
      makeGraha({ name: 'Saturn' }),
      makeGraha({ name: 'Rahu' }),
      makeGraha({ name: 'Ketu' }),
    ];
    const houses = makeHouses({
      1: ['Rahu'],
      2: ['Sun', 'Moon'],
      3: ['Mars', 'Mercury'],
      5: ['Jupiter', 'Venus'],
      7: ['Ketu'],
      9: ['Saturn'],  // outside
    });
    const result = analyzeKaalSarp(planets, houses);
    expect(result.hasDosha).toBe(false);
    expect(result.allPlanetsOnOneSide).toBe(false);
  });

  test('correct type based on Rahu house', () => {
    // Rahu in house 5 → Padma
    const planets = [
      makeGraha({ name: 'Sun' }),
      makeGraha({ name: 'Moon' }),
      makeGraha({ name: 'Mars' }),
      makeGraha({ name: 'Mercury' }),
      makeGraha({ name: 'Jupiter' }),
      makeGraha({ name: 'Venus' }),
      makeGraha({ name: 'Saturn' }),
      makeGraha({ name: 'Rahu' }),
      makeGraha({ name: 'Ketu' }),
    ];
    const houses = makeHouses({
      5: ['Rahu'],
      6: ['Sun', 'Moon'],
      7: ['Mars'],
      8: ['Mercury', 'Jupiter'],
      9: ['Venus'],
      10: ['Saturn'],
      11: ['Ketu'],
    });
    const result = analyzeKaalSarp(planets, houses);
    expect(result.hasDosha).toBe(true);
    expect(result.type).toBe('Padma');
    expect(result.rahuHouse).toBe(5);
  });

  test('Kaal Amrit Yoga when planets between Ketu→Rahu', () => {
    // Rahu in house 7, Ketu in house 1
    // Houses between Ketu(1)→Rahu(7): 2,3,4,5,6
    // All planets in houses 2-6 → Kaal Amrit Yoga (auspicious)
    const planets = [
      makeGraha({ name: 'Sun' }),
      makeGraha({ name: 'Moon' }),
      makeGraha({ name: 'Mars' }),
      makeGraha({ name: 'Mercury' }),
      makeGraha({ name: 'Jupiter' }),
      makeGraha({ name: 'Venus' }),
      makeGraha({ name: 'Saturn' }),
      makeGraha({ name: 'Rahu' }),
      makeGraha({ name: 'Ketu' }),
    ];
    const houses = makeHouses({
      1: ['Ketu'],
      2: ['Sun', 'Moon'],
      3: ['Mars', 'Mercury'],
      5: ['Jupiter', 'Venus'],
      6: ['Saturn'],
      7: ['Rahu'],
    });
    const result = analyzeKaalSarp(planets, houses);
    expect(result.hasDosha).toBe(false); // Kaal Amrit = not a dosha
    expect(result.allPlanetsOnOneSide).toBe(true);
    expect(result.details).toContain('Kaal Amrit Yoga');
    expect(result.details).toContain('auspicious');
  });
});

// ── Ganda Moola ────────────────────────────────────────────────────────────────

describe('Ganda Moola', () => {
  test('Moon in Ashwini = Ganda Moola', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Ashwini', nakshatraPada: 2 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.hasDosha).toBe(true);
    expect(result.moonNakshatra).toBe('Ashwini');
    expect(result.severity).toBe('mild');
  });

  test('Moon in Rohini = no Ganda Moola', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Rohini', nakshatraPada: 3 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.hasDosha).toBe(false);
    expect(result.severity).toBe('none');
  });

  test('severe if Pada 1 of Ashwini (junction nakshatra)', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Ashwini', nakshatraPada: 1 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.hasDosha).toBe(true);
    expect(result.severity).toBe('severe');
  });

  test('severe if Pada 1 of Magha', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Magha', nakshatraPada: 1 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.severity).toBe('severe');
  });

  test('severe if Pada 1 of Moola', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Moola', nakshatraPada: 1 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.severity).toBe('severe');
  });

  test('severe if Pada 4 of Ashlesha', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Ashlesha', nakshatraPada: 4 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.severity).toBe('severe');
  });

  test('severe if Pada 4 of Jyeshtha', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Jyeshtha', nakshatraPada: 4 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.severity).toBe('severe');
  });

  test('severe if Pada 4 of Revati', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Revati', nakshatraPada: 4 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.severity).toBe('severe');
  });

  test('mild if Pada 2 of Moola (not junction pada)', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Moola', nakshatraPada: 2 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.hasDosha).toBe(true);
    expect(result.severity).toBe('mild');
  });

  test('Moon in Jyeshtha Pada 1 = mild (not severe pada)', () => {
    const planets = [
      makeGraha({ name: 'Moon', nakshatra: 'Jyeshtha', nakshatraPada: 1 }),
    ];
    const result = analyzeGandaMoola(planets);
    expect(result.hasDosha).toBe(true);
    expect(result.severity).toBe('mild');
  });
});

// ── Gandanta ───────────────────────────────────────────────────────────────────

describe('Gandanta', () => {
  test('planet at Cancer 29° = Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Moon', signName: 'Cancer', signNumber: 4, degreeInSign: 29 }),
    ];
    const lagna = makeLagna({ signNumber: 1, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets.length).toBeGreaterThanOrEqual(1);
    expect(result.planets[0].name).toBe('Moon');
    expect(result.planets[0].type).toBe('rashi_gandanta');
  });

  test('planet at Leo 1° = Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Sun', signName: 'Leo', signNumber: 5, degreeInSign: 1 }),
    ];
    const lagna = makeLagna({ signNumber: 3, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets[0].name).toBe('Sun');
    expect(result.planets[0].signName).toBe('Leo');
  });

  test('planet at Leo 5° = no Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Sun', signName: 'Leo', signNumber: 5, degreeInSign: 5 }),
    ];
    const lagna = makeLagna({ signNumber: 3, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(false);
    expect(result.planets.length).toBe(0);
  });

  test('planet at Scorpio 28° = Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Venus', signName: 'Scorpio', signNumber: 8, degreeInSign: 28 }),
    ];
    const lagna = makeLagna({ signNumber: 1, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets[0].name).toBe('Venus');
  });

  test('planet at Sagittarius 2° = Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Mars', signName: 'Sagittarius', signNumber: 9, degreeInSign: 2 }),
    ];
    const lagna = makeLagna({ signNumber: 1, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets[0].name).toBe('Mars');
  });

  test('planet at Pisces 29° = Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Jupiter', signName: 'Pisces', signNumber: 12, degreeInSign: 29 }),
    ];
    const lagna = makeLagna({ signNumber: 6, degreeInSign: 10 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets[0].name).toBe('Jupiter');
  });

  test('planet at Aries 0.5° = Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Mercury', signName: 'Aries', signNumber: 1, degreeInSign: 0.5 }),
    ];
    const lagna = makeLagna({ signNumber: 6, degreeInSign: 10 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets[0].name).toBe('Mercury');
  });

  test('Lagna in Gandanta detected', () => {
    const planets: GrahaPosition[] = [];
    const lagna = makeLagna({ signNumber: 5, signName: 'Leo', degreeInSign: 1 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets[0].name).toBe('Lagna');
  });

  test('multiple planets in Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Sun', signName: 'Cancer', signNumber: 4, degreeInSign: 28.5 }),
      makeGraha({ name: 'Moon', signName: 'Scorpio', signNumber: 8, degreeInSign: 29.5 }),
      makeGraha({ name: 'Mars', signName: 'Gemini', signNumber: 3, degreeInSign: 15 }), // not gandanta
    ];
    const lagna = makeLagna({ signNumber: 1, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(true);
    expect(result.planets.length).toBe(2);
  });

  test('planet at Cancer 25° = no Gandanta', () => {
    const planets = [
      makeGraha({ name: 'Moon', signName: 'Cancer', signNumber: 4, degreeInSign: 25 }),
    ];
    const lagna = makeLagna({ signNumber: 1, degreeInSign: 15 });
    const result = analyzeGandanta(planets, lagna);
    expect(result.hasGandanta).toBe(false);
  });
});
