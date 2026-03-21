/**
 * Tests for Shad Bala (Six-fold Planetary Strength)
 */

import { calculateShadBala, ShadBalaPlanetInput } from '../../panchang/src/birthchart/analysis/shadbala';

// ── Helper: make a planet input with sensible defaults ──────────────────────

function makePlanet(overrides: Partial<ShadBalaPlanetInput> & { name: string }): ShadBalaPlanetInput {
  return {
    signNumber: 1,
    degreeInSign: 15,
    house: 1,
    retrograde: false,
    speed: 1,
    dignity: 'neutral',
    ...overrides,
  };
}

// ── Naisargika Bala (fixed natural strength) ────────────────────────────────

describe('Naisargika Bala', () => {
  test('Sun gets 60', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Sun' })],
      1,
    );
    expect(results[0].naisargika).toBe(60);
  });

  test('Moon gets 51.43', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Moon' })],
      1,
    );
    expect(results[0].naisargika).toBe(51.43);
  });

  test('Mars gets 17.14', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Mars' })],
      1,
    );
    expect(results[0].naisargika).toBe(17.14);
  });

  test('Mercury gets 25.71', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Mercury' })],
      1,
    );
    expect(results[0].naisargika).toBe(25.71);
  });

  test('Jupiter gets 34.29', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Jupiter' })],
      1,
    );
    expect(results[0].naisargika).toBe(34.29);
  });

  test('Venus gets 42.86', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Venus' })],
      1,
    );
    expect(results[0].naisargika).toBe(42.86);
  });

  test('Saturn gets 8.57', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Saturn' })],
      1,
    );
    expect(results[0].naisargika).toBe(8.57);
  });

  test('Rahu gets 8', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Rahu' })],
      1,
    );
    expect(results[0].naisargika).toBe(8);
  });

  test('Ketu gets 8', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Ketu' })],
      1,
    );
    expect(results[0].naisargika).toBe(8);
  });
});

// ── Dig Bala (Directional Strength) ─────────────────────────────────────────

describe('Dig Bala', () => {
  test('Jupiter in 1st house (strongest) gets 60', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Jupiter', house: 1 })],
      1,
    );
    expect(results[0].dig).toBe(60);
  });

  test('Jupiter in 7th house (opposite of strongest) gets 0', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Jupiter', house: 7 })],
      1,
    );
    expect(results[0].dig).toBe(0);
  });

  test('Sun in 10th house (strongest) gets 60', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 10 })],
      1,
    );
    expect(results[0].dig).toBe(60);
  });

  test('Saturn in 7th house (strongest) gets 60', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Saturn', house: 7 })],
      1,
    );
    expect(results[0].dig).toBe(60);
  });

  test('Moon in 4th house (strongest) gets 60', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Moon', house: 4 })],
      1,
    );
    expect(results[0].dig).toBe(60);
  });

  test('Mercury in 4th house (3 houses from strongest=1) gets 30', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Mercury', house: 4 })],
      1,
    );
    expect(results[0].dig).toBe(30);
  });
});

// ── Kendradi Bala (part of Sthana Bala) ─────────────────────────────────────

describe('Kendradi Bala (via Sthana Bala)', () => {
  test('planet in angular house (1) has higher sthana than cadent (3)', () => {
    const angular = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 1 })],
      1,
    );
    const cadent = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 3 })],
      1,
    );
    // Angular (kendradi=60) vs cadent (kendradi=15), difference = 45
    // Normalized: 45/180 * 100 = 25
    expect(angular[0].sthana).toBeGreaterThan(cadent[0].sthana);
    expect(angular[0].sthana - cadent[0].sthana).toBeCloseTo(25, 0);
  });

  test('planet in succedent house (2) has mid sthana', () => {
    const angular = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 1 })],
      1,
    );
    const succedent = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 2 })],
      1,
    );
    const cadent = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 3 })],
      1,
    );
    expect(succedent[0].sthana).toBeGreaterThan(cadent[0].sthana);
    expect(succedent[0].sthana).toBeLessThan(angular[0].sthana);
  });
});

// ── Total is sum of all 6 components ────────────────────────────────────────

describe('Total and ratio', () => {
  test('total is the sum of all 6 components', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Jupiter', house: 1, signNumber: 4, degreeInSign: 5, dignity: 'exalted' })],
      1,
    );
    const r = results[0];
    const expectedTotal = r.sthana + r.dig + r.kala + r.chesta + r.naisargika + r.drik;
    expect(r.total).toBeCloseTo(expectedTotal, 1);
  });

  test('ratio is total / required', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 10 })],
      1,
    );
    const r = results[0];
    expect(r.ratio).toBeCloseTo(r.total / r.required, 2);
  });
});

// ── isStrong ────────────────────────────────────────────────────────────────

describe('isStrong', () => {
  test('isStrong is true when ratio >= 1', () => {
    // Create a very strong planet scenario
    const results = calculateShadBala(
      [makePlanet({ name: 'Sun', house: 10, signNumber: 1, degreeInSign: 10, dignity: 'peak_exalted', speed: 1 })],
      1,
      12, // day-born
    );
    const r = results[0];
    // Check the logic is consistent
    expect(r.isStrong).toBe(r.ratio >= 1);
  });

  test('isStrong is false when ratio < 1', () => {
    // Required for Sun is 390; a single component total is unlikely to exceed that
    // with unfavorable conditions
    const results = calculateShadBala(
      [makePlanet({ name: 'Mercury', house: 7, signNumber: 12, degreeInSign: 15, dignity: 'debilitated', speed: 0.1 })],
      1,
      22, // night-born
    );
    const r = results[0];
    expect(r.isStrong).toBe(r.ratio >= 1);
  });
});

// ── Chesta Bala ─────────────────────────────────────────────────────────────

describe('Chesta Bala', () => {
  test('retrograde planet gets 60', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Saturn', retrograde: true, speed: -0.1 })],
      1,
    );
    expect(results[0].chesta).toBe(60);
  });

  test('Sun always gets 30 regardless of speed', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Sun', speed: 1.5 })],
      1,
    );
    expect(results[0].chesta).toBe(30);
  });

  test('Moon always gets 30', () => {
    const results = calculateShadBala(
      [makePlanet({ name: 'Moon', speed: 14 })],
      1,
    );
    expect(results[0].chesta).toBe(30);
  });
});

// ── Multiple planets ────────────────────────────────────────────────────────

describe('Multiple planets', () => {
  test('returns results for all planets', () => {
    const planets = [
      makePlanet({ name: 'Sun', house: 1, signNumber: 1 }),
      makePlanet({ name: 'Moon', house: 4, signNumber: 4 }),
      makePlanet({ name: 'Mars', house: 7, signNumber: 7 }),
      makePlanet({ name: 'Mercury', house: 10, signNumber: 10 }),
      makePlanet({ name: 'Jupiter', house: 1, signNumber: 9 }),
      makePlanet({ name: 'Venus', house: 4, signNumber: 2 }),
      makePlanet({ name: 'Saturn', house: 7, signNumber: 11 }),
      makePlanet({ name: 'Rahu', house: 3, signNumber: 3 }),
      makePlanet({ name: 'Ketu', house: 9, signNumber: 9 }),
    ];

    const results = calculateShadBala(planets, 1);
    expect(results).toHaveLength(9);
    expect(results.map(r => r.planet)).toEqual([
      'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
    ]);

    // Every result should have all 6 components as numbers
    for (const r of results) {
      expect(typeof r.sthana).toBe('number');
      expect(typeof r.dig).toBe('number');
      expect(typeof r.kala).toBe('number');
      expect(typeof r.chesta).toBe('number');
      expect(typeof r.naisargika).toBe('number');
      expect(typeof r.drik).toBe('number');
      expect(typeof r.total).toBe('number');
      expect(typeof r.required).toBe('number');
      expect(typeof r.ratio).toBe('number');
      expect(typeof r.isStrong).toBe('boolean');
      expect(r.total).toBeGreaterThan(0);
    }
  });
});
