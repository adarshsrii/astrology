/**
 * Tests for Divisional Charts (Varga) engine.
 */

import {
  calculateDivisionalChart,
  calculateShodashvarga,
  SHODASHVARGA_CHARTS,
  PlanetInput,
} from '../../panchang/src/birthchart/divisional';

// ── Test planets ────────────────────────────────────────────────────────────

const TEST_PLANETS: PlanetInput[] = [
  { name: 'Sun',     signNumber: 1,  degreeInSign: 15 },   // Aries 15°
  { name: 'Moon',    signNumber: 4,  degreeInSign: 10 },   // Cancer 10°
  { name: 'Mars',    signNumber: 5,  degreeInSign: 22 },   // Leo 22°
  { name: 'Mercury', signNumber: 3,  degreeInSign: 8 },    // Gemini 8°
  { name: 'Jupiter', signNumber: 9,  degreeInSign: 5 },    // Sagittarius 5°
  { name: 'Venus',   signNumber: 2,  degreeInSign: 27 },   // Taurus 27°
  { name: 'Saturn',  signNumber: 10, degreeInSign: 3 },    // Capricorn 3°
  { name: 'Rahu',    signNumber: 7,  degreeInSign: 18 },   // Libra 18°
  { name: 'Ketu',    signNumber: 1,  degreeInSign: 18 },   // Aries 18°
];

const LAGNA_SIGN = 1;   // Aries
const LAGNA_DEG = 12;

// ── D1 (Rasi) — trivial ────────────────────────────────────────────────────

describe('D1 (Rasi)', () => {
  test('returns same signs as input', () => {
    const chart = calculateDivisionalChart(1, TEST_PLANETS, LAGNA_SIGN, LAGNA_DEG);
    expect(chart.division).toBe(1);
    expect(chart.planets[0].vargaSignNumber).toBe(1);  // Sun stays in Aries
    expect(chart.lagnaSign.number).toBe(1);
  });
});

// ── D2 (Hora) ───────────────────────────────────────────────────────────────

describe('D2 (Hora)', () => {
  test('odd sign, 0-15° → Leo (5)', () => {
    const chart = calculateDivisionalChart(2, [
      { name: 'Sun', signNumber: 1, degreeInSign: 10 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(5); // Leo
  });

  test('odd sign, 15-30° → Cancer (4)', () => {
    const chart = calculateDivisionalChart(2, [
      { name: 'Sun', signNumber: 1, degreeInSign: 20 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(4); // Cancer
  });

  test('even sign, 0-15° → Cancer (4)', () => {
    const chart = calculateDivisionalChart(2, [
      { name: 'Moon', signNumber: 2, degreeInSign: 10 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(4); // Cancer
  });

  test('even sign, 15-30° → Leo (5)', () => {
    const chart = calculateDivisionalChart(2, [
      { name: 'Moon', signNumber: 4, degreeInSign: 20 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(5); // Leo
  });
});

// ── D3 (Drekkana) ───────────────────────────────────────────────────────────

describe('D3 (Drekkana)', () => {
  test('1st decanate (0-10°) → same sign', () => {
    const chart = calculateDivisionalChart(3, [
      { name: 'Sun', signNumber: 1, degreeInSign: 5 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(1); // Aries
  });

  test('2nd decanate (10-20°) → 5th sign from it', () => {
    const chart = calculateDivisionalChart(3, [
      { name: 'Sun', signNumber: 1, degreeInSign: 15 },
    ], 1, 5);
    // Aries(1) + 4 = Leo(5)
    expect(chart.planets[0].vargaSignNumber).toBe(5);
  });

  test('3rd decanate (20-30°) → 9th sign from it', () => {
    const chart = calculateDivisionalChart(3, [
      { name: 'Mars', signNumber: 5, degreeInSign: 25 },
    ], 1, 5);
    // Leo(5) + 8 = 13 → normalised = 1 (Aries) — wait: (5+8-1)%12+1 = 12%12+1=1
    expect(chart.planets[0].vargaSignNumber).toBe(1); // Sagittarius? No: 5+8=13 → 1. Actually 9th from Leo: Leo=1st, Virgo=2nd... Aries=9th ✓
  });
});

// ── D9 (Navamsa) — most important ──────────────────────────────────────────

describe('D9 (Navamsa)', () => {
  test('Aries 15° → fire sign, division 4 → Leo (5)', () => {
    // Aries = fire → start from Aries (1)
    // 15 / 3.333 = 4.5 → floor = 4 (0-indexed)
    // varga sign = 1 + 4 = 5 (Leo)
    const chart = calculateDivisionalChart(9, [
      { name: 'Sun', signNumber: 1, degreeInSign: 15 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(5); // Leo
    expect(chart.planets[0].vargaSignName).toBe('Leo');
  });

  test('Cancer 10° → water sign, division 3 → Cancer+3 = Libra? No: start=Cancer(4), 10/3.333=3 → 4+3=7', () => {
    // Cancer = water → start from Cancer (4)
    // 10 / 3.333 = 3.0 → floor = 3
    // varga sign = 4 + 3 = 7 (Libra)
    const chart = calculateDivisionalChart(9, [
      { name: 'Moon', signNumber: 4, degreeInSign: 10 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(7); // Libra
  });

  test('Taurus 27° → earth sign, start Capricorn(10)', () => {
    // Earth → start 10 (Capricorn)
    // 27 / 3.333 = 8.1 → floor = 8
    // varga sign = 10 + 8 = 18 → normalised: (18-1)%12+1 = 6 (Virgo)
    const chart = calculateDivisionalChart(9, [
      { name: 'Venus', signNumber: 2, degreeInSign: 27 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(6); // Virgo
  });

  test('Gemini 0° → air sign, start Libra(7), division 0 → Libra', () => {
    const chart = calculateDivisionalChart(9, [
      { name: 'Mercury', signNumber: 3, degreeInSign: 0 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(7); // Libra
  });
});

// ── D10 (Dasamsa) ───────────────────────────────────────────────────────────

describe('D10 (Dasamsa)', () => {
  test('odd sign starts from same sign', () => {
    // Aries(1) odd, 6° → part 2 → sign = 1+2 = 3 (Gemini)
    const chart = calculateDivisionalChart(10, [
      { name: 'Sun', signNumber: 1, degreeInSign: 6 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(3);
  });

  test('even sign starts from 9th sign', () => {
    // Taurus(2) even, 3° → part 1 → start = 2+8=10 → sign = 10+1 = 11 (Aquarius)
    const chart = calculateDivisionalChart(10, [
      { name: 'Venus', signNumber: 2, degreeInSign: 3 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(11);
  });
});

// ── D12 (Dwadasamsa) ───────────────────────────────────────────────────────

describe('D12 (Dwadasamsa)', () => {
  test('starts from same sign, advances by 1', () => {
    // Aries(1), 5° → part = floor(5/2.5) = 2 → sign = 1+2 = 3 (Gemini)
    const chart = calculateDivisionalChart(12, [
      { name: 'Sun', signNumber: 1, degreeInSign: 5 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(3);
  });
});

// ── D30 (Trimsamsa) — irregular ─────────────────────────────────────────────

describe('D30 (Trimsamsa)', () => {
  test('odd sign, 0-5° → Aries (Mars)', () => {
    const chart = calculateDivisionalChart(30, [
      { name: 'Sun', signNumber: 1, degreeInSign: 3 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(1); // Aries
  });

  test('odd sign, 10-18° → Sagittarius (Jupiter)', () => {
    const chart = calculateDivisionalChart(30, [
      { name: 'Sun', signNumber: 3, degreeInSign: 14 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(9); // Sagittarius
  });

  test('even sign, 0-5° → Taurus (Venus)', () => {
    const chart = calculateDivisionalChart(30, [
      { name: 'Moon', signNumber: 2, degreeInSign: 3 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(2); // Taurus
  });

  test('even sign, 20-25° → Capricorn (Saturn)', () => {
    const chart = calculateDivisionalChart(30, [
      { name: 'Moon', signNumber: 4, degreeInSign: 22 },
    ], 1, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(10); // Capricorn
  });
});

// ── All 16 charts return correct number of planets ──────────────────────────

describe('All Shodashvarga charts', () => {
  SHODASHVARGA_CHARTS.forEach(chartDef => {
    test(`${chartDef.shortName} (${chartDef.name}) returns all ${TEST_PLANETS.length} planets`, () => {
      const chart = calculateDivisionalChart(
        chartDef.division,
        TEST_PLANETS,
        LAGNA_SIGN,
        LAGNA_DEG,
      );
      expect(chart.planets).toHaveLength(TEST_PLANETS.length);
      expect(chart.division).toBe(chartDef.division);
      expect(chart.lagnaSign.number).toBeGreaterThanOrEqual(1);
      expect(chart.lagnaSign.number).toBeLessThanOrEqual(12);

      // All varga signs must be 1-12
      chart.planets.forEach(p => {
        expect(p.vargaSignNumber).toBeGreaterThanOrEqual(1);
        expect(p.vargaSignNumber).toBeLessThanOrEqual(12);
        expect(p.vargaSignName).toBeTruthy();
      });
    });
  });
});

// ── Shodashvarga scoring ────────────────────────────────────────────────────

describe('Shodashvarga scoring', () => {
  test('returns scores for all planets', () => {
    const results = calculateShodashvarga(TEST_PLANETS, LAGNA_SIGN, LAGNA_DEG);
    expect(results).toHaveLength(TEST_PLANETS.length);

    results.forEach(entry => {
      expect(entry.planet).toBeTruthy();
      expect(entry.scores).toHaveLength(SHODASHVARGA_CHARTS.length); // 16 charts
      expect(typeof entry.totalPoints).toBe('number');
      expect(entry.totalPoints).toBeGreaterThanOrEqual(0);
    });
  });

  test('totalPoints is sum of individual dignity points', () => {
    const results = calculateShodashvarga(TEST_PLANETS, LAGNA_SIGN, LAGNA_DEG);
    const sun = results.find(r => r.planet === 'Sun')!;
    expect(sun).toBeDefined();

    // Verify total matches sum (we know the point map)
    const dignityPoints: Record<string, number> = {
      exalted: 20, moolatrikona: 15, own_sign: 20,
      friendly: 10, neutral: 5, enemy: 2, debilitated: 0,
    };
    const expectedTotal = sun.scores.reduce((sum, s) => sum + (dignityPoints[s.dignity] ?? 5), 0);
    expect(sun.totalPoints).toBe(expectedTotal);
  });

  test('exalted planet gets 20 points for that chart', () => {
    // Sun is exalted in Aries (sign 1). In D1, Sun is at Aries 15° → exalted
    const results = calculateShodashvarga(TEST_PLANETS, LAGNA_SIGN, LAGNA_DEG);
    const sun = results.find(r => r.planet === 'Sun')!;
    const d1Score = sun.scores.find(s => s.chart === 'D1')!;
    expect(d1Score.dignity).toBe('exalted');
  });
});

// ── Edge cases ──────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  test('degree at exactly 0°', () => {
    const chart = calculateDivisionalChart(9, [
      { name: 'Sun', signNumber: 1, degreeInSign: 0 },
    ], 1, 0);
    // Fire sign, start Aries, division 0 → Aries
    expect(chart.planets[0].vargaSignNumber).toBe(1);
  });

  test('degree at 29.999°', () => {
    const chart = calculateDivisionalChart(9, [
      { name: 'Sun', signNumber: 1, degreeInSign: 29.999 },
    ], 1, 0);
    // Fire sign, 29.999/3.333 = 8.999 → floor = 8 → sign = 1+8 = 9 (Sagittarius)
    expect(chart.planets[0].vargaSignNumber).toBe(9);
  });

  test('unsupported division throws error', () => {
    expect(() => {
      calculateDivisionalChart(5, TEST_PLANETS, 1, 0);
    }).toThrow('Unsupported divisional chart: D5');
  });

  test('sign 12 wraps correctly', () => {
    // D12: Pisces(12), 5° → part 2 → sign = 12+2 = 14 → norm = 2 (Taurus)
    const chart = calculateDivisionalChart(12, [
      { name: 'Sun', signNumber: 12, degreeInSign: 5 },
    ], 12, 5);
    expect(chart.planets[0].vargaSignNumber).toBe(2); // Taurus
  });
});
