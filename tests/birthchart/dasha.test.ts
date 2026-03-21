/**
 * Vimshottari Dasha Tests
 */

import {
  calculateVimshottariDasha,
  NAKSHATRA_LORDS,
  DASHA_YEARS,
  DASHA_SEQUENCE,
} from '../../panchang/src/birthchart/dasha';

describe('Vimshottari Dasha', () => {
  // ── Nakshatra Lord Mapping ──────────────────────────────────────────────────

  test('correct starting lord from nakshatra', () => {
    expect(NAKSHATRA_LORDS['Ashwini']).toBe('Ketu');
    expect(NAKSHATRA_LORDS['Rohini']).toBe('Moon');
    expect(NAKSHATRA_LORDS['Bharani']).toBe('Venus');
    expect(NAKSHATRA_LORDS['Krittika']).toBe('Sun');
    expect(NAKSHATRA_LORDS['Ardra']).toBe('Rahu');
    expect(NAKSHATRA_LORDS['Pushya']).toBe('Saturn');
    expect(NAKSHATRA_LORDS['Revati']).toBe('Mercury');
  });

  test('all 27 nakshatras are mapped', () => {
    expect(Object.keys(NAKSHATRA_LORDS)).toHaveLength(27);
  });

  test('total dasha years = 120', () => {
    const total = DASHA_SEQUENCE.reduce((sum, p) => sum + DASHA_YEARS[p], 0);
    expect(total).toBe(120);
  });

  // ── Balance Calculation ─────────────────────────────────────────────────────

  test('balance calculation at birth — 50% through nakshatra', () => {
    // Moon at Ashwini at exact midpoint → Ketu balance = 3.5 years
    const midpoint = (13 + 1 / 3) / 2; // exact 50%
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', midpoint, 1,
    );
    expect(result.birthNakshatraLord).toBe('Ketu');
    expect(result.balanceAtBirth.planet).toBe('Ketu');
    // Ketu = 7 years, 50% remaining = 3.5 years
    expect(result.balanceAtBirth.years).toBe(3);
    expect(result.balanceAtBirth.months).toBe(6);
  });

  test('balance calculation — beginning of nakshatra (full dasha)', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 1,
    );
    expect(result.balanceAtBirth.years).toBe(7);
    expect(result.balanceAtBirth.months).toBe(0);
    expect(result.balanceAtBirth.days).toBe(0);
  });

  test('balance calculation — end of nakshatra (nearly zero)', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 13.333, 1,
    );
    // Very close to end: almost zero balance
    expect(result.balanceAtBirth.years).toBe(0);
    expect(result.balanceAtBirth.months).toBe(0);
  });

  // ── Maha Dasha Generation ─────────────────────────────────────────────────

  test('generates 9 Maha Dashas', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 6.667, 1,
    );
    expect(result.mahaDashas).toHaveLength(9);
  });

  test('Maha Dasha sequence starts with nakshatra lord', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 1,
    );
    expect(result.mahaDashas[0].planet).toBe('Ketu');
    // Ketu is at index 7 in DASHA_SEQUENCE, next is Venus
    expect(result.mahaDashas[1].planet).toBe('Venus');
    expect(result.mahaDashas[2].planet).toBe('Sun');
  });

  test('total Maha Dasha duration = 120 years', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 1,
    );
    const totalDays = result.mahaDashas.reduce((sum, d) => sum + d.durationDays, 0);
    const totalYears = totalDays / 365.25;
    expect(Math.round(totalYears)).toBe(120);
  });

  test('first Maha Dasha duration reflects balance', () => {
    // Ashwini at 6.667° → Ketu balance ≈ 3.5 years ≈ 1278.375 days
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 6.667, 1,
    );
    const firstDasha = result.mahaDashas[0];
    expect(firstDasha.planet).toBe('Ketu');
    // 3.5 years * 365.25 ≈ 1278 days
    expect(firstDasha.durationDays).toBeCloseTo(3.5 * 365.25, -1);
  });

  test('Maha Dashas are contiguous (no gaps)', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Rohini', 5, 1,
    );
    for (let i = 1; i < result.mahaDashas.length; i++) {
      expect(result.mahaDashas[i].startDate).toBe(result.mahaDashas[i - 1].endDate);
    }
  });

  test('first Maha Dasha starts at birth date', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Rohini', 0, 1,
    );
    expect(result.mahaDashas[0].startDate).toBe('2000-01-01');
  });

  // ── Antar Dashas ──────────────────────────────────────────────────────────

  test('Antar Dashas within Maha', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 2,
    );
    const firstMaha = result.mahaDashas[0];
    expect(firstMaha.subPeriods).toBeDefined();
    expect(firstMaha.subPeriods).toHaveLength(9);
  });

  test('Antar Dasha sequence starts from Maha lord', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 2,
    );
    const firstMaha = result.mahaDashas[0]; // Ketu
    expect(firstMaha.subPeriods![0].planet).toBe('Ketu');  // Ketu-Ketu
    expect(firstMaha.subPeriods![1].planet).toBe('Venus'); // Ketu-Venus
  });

  test('Antar Dasha durations sum to Maha Dasha duration', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 2,
    );
    for (const maha of result.mahaDashas) {
      if (maha.subPeriods) {
        const subTotal = maha.subPeriods.reduce((s, p) => s + p.durationDays, 0);
        expect(subTotal).toBeCloseTo(maha.durationDays, 0);
      }
    }
  });

  test('Antar Dashas are level 2', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 2,
    );
    const firstMaha = result.mahaDashas[0];
    for (const antar of firstMaha.subPeriods!) {
      expect(antar.level).toBe(2);
      expect(antar.levelName).toBe('Antar Dasha');
    }
  });

  // ── Deep Levels ───────────────────────────────────────────────────────────

  test('5-level depth generates all levels', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 6.667, 5,
    );
    expect(result.currentDasha.maha).toBeTruthy();
    expect(result.currentDasha.antar).toBeTruthy();
    expect(result.currentDasha.pratyantar).toBeTruthy();
    expect(result.currentDasha.sookshma).toBeTruthy();
    expect(result.currentDasha.prana).toBeTruthy();
  });

  test('depth=1 only generates Maha Dashas', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 0, 1,
    );
    const firstMaha = result.mahaDashas[0];
    expect(firstMaha.subPeriods).toBeUndefined();
  });

  // ── Current Dasha Detection ───────────────────────────────────────────────

  test('current dasha detection', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 6.667, 3,
    );
    // Born 2000, Ketu balance ~3.5 years → Ketu ends ~mid-2003
    // Then Venus 20 years → ~mid-2023
    // Then Sun 6 years → ~mid-2029
    // Current (2026) should be in Sun Maha Dasha
    expect(result.currentDasha.maha).toBe('Sun');
  });

  test('exactly one Maha Dasha is active', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 6.667, 1,
    );
    const activeCount = result.mahaDashas.filter(d => d.isActive).length;
    expect(activeCount).toBe(1);
  });

  // ── Different Nakshatras ──────────────────────────────────────────────────

  test('Rohini starts with Moon dasha', () => {
    const result = calculateVimshottariDasha(
      new Date('1990-06-15'), 'Rohini', 3, 1,
    );
    expect(result.birthNakshatraLord).toBe('Moon');
    expect(result.mahaDashas[0].planet).toBe('Moon');
  });

  test('Bharani starts with Venus dasha', () => {
    const result = calculateVimshottariDasha(
      new Date('1985-03-20'), 'Bharani', 0, 1,
    );
    expect(result.birthNakshatraLord).toBe('Venus');
    expect(result.mahaDashas[0].planet).toBe('Venus');
    // Full Venus dasha = 20 years
    expect(result.mahaDashas[0].durationDays).toBeCloseTo(20 * 365.25, 0);
  });

  // ── Edge Cases ────────────────────────────────────────────────────────────

  test('throws on unknown nakshatra', () => {
    expect(() => {
      calculateVimshottariDasha(new Date('2000-01-01'), 'InvalidNakshatra', 0, 1);
    }).toThrow('Unknown nakshatra');
  });

  test('throws on out-of-range degree', () => {
    expect(() => {
      calculateVimshottariDasha(new Date('2000-01-01'), 'Ashwini', -1, 1);
    }).toThrow('moonNakshatraDegree');
  });

  test('VimshottariResult has all required fields', () => {
    const result = calculateVimshottariDasha(
      new Date('2000-01-01'), 'Ashwini', 6.667, 2,
    );
    expect(result.birthNakshatra).toBe('Ashwini');
    expect(result.birthNakshatraLord).toBe('Ketu');
    expect(result.balanceAtBirth).toBeDefined();
    expect(result.mahaDashas).toBeDefined();
    expect(result.currentDasha).toBeDefined();
  });
});
