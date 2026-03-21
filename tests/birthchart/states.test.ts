/**
 * Tests for planetary dignity and combustion logic.
 */

import { determineDignity, determineCombustion } from '../../panchang/src/birthchart/core/states';

describe('determineDignity', () => {
  // ── Sun ──────────────────────────────────────────────────────────────────

  test('Sun peak exalted in Aries at 10°', () => {
    expect(determineDignity('Sun', 1, 10)).toBe('peak_exalted');
  });

  test('Sun exalted in Aries at 20°', () => {
    expect(determineDignity('Sun', 1, 20)).toBe('exalted');
  });

  test('Sun debilitated in Libra at 20°', () => {
    expect(determineDignity('Sun', 7, 20)).toBe('debilitated');
  });

  test('Sun peak debilitated in Libra at 10°', () => {
    expect(determineDignity('Sun', 7, 10)).toBe('peak_debilitated');
  });

  test('Sun moolatrikona in Leo 0-20°', () => {
    expect(determineDignity('Sun', 5, 10)).toBe('moolatrikona');
  });

  test('Sun own sign in Leo at 25° (outside moolatrikona range)', () => {
    expect(determineDignity('Sun', 5, 25)).toBe('own_sign');
  });

  test('Sun neutral in Gemini', () => {
    expect(determineDignity('Sun', 3, 15)).toBe('neutral');
  });

  // ── Moon ─────────────────────────────────────────────────────────────────

  test('Moon exalted in Taurus', () => {
    expect(determineDignity('Moon', 2, 15)).toBe('exalted');
    // Note: Moon peak exalted at 3° would also be 'exalted' region,
    // but Taurus 3-30° is moolatrikona. Peak exalted takes priority at 3°.
  });

  test('Moon peak exalted in Taurus at 3°', () => {
    expect(determineDignity('Moon', 2, 3)).toBe('peak_exalted');
  });

  test('Moon debilitated in Scorpio', () => {
    expect(determineDignity('Moon', 8, 15)).toBe('debilitated');
  });

  test('Moon own sign in Cancer', () => {
    expect(determineDignity('Moon', 4, 15)).toBe('own_sign');
  });

  // ── Jupiter ──────────────────────────────────────────────────────────────

  test('Jupiter exalted in Cancer', () => {
    expect(determineDignity('Jupiter', 4, 15)).toBe('exalted');
  });

  test('Jupiter debilitated in Capricorn', () => {
    expect(determineDignity('Jupiter', 10, 15)).toBe('debilitated');
  });

  test('Jupiter moolatrikona in Sagittarius 0-10°', () => {
    expect(determineDignity('Jupiter', 9, 5)).toBe('moolatrikona');
  });

  test('Jupiter own sign in Sagittarius 15°', () => {
    expect(determineDignity('Jupiter', 9, 15)).toBe('own_sign');
  });

  test('Jupiter own sign in Pisces', () => {
    expect(determineDignity('Jupiter', 12, 15)).toBe('own_sign');
  });

  // ── Mars ─────────────────────────────────────────────────────────────────

  test('Mars exalted in Capricorn', () => {
    expect(determineDignity('Mars', 10, 15)).toBe('exalted');
  });

  test('Mars debilitated in Cancer', () => {
    expect(determineDignity('Mars', 4, 15)).toBe('debilitated');
  });

  test('Mars own sign in Scorpio', () => {
    expect(determineDignity('Mars', 8, 15)).toBe('own_sign');
  });

  // ── Saturn ───────────────────────────────────────────────────────────────

  test('Saturn exalted in Libra', () => {
    expect(determineDignity('Saturn', 7, 10)).toBe('exalted');
  });

  test('Saturn debilitated in Aries', () => {
    expect(determineDignity('Saturn', 1, 10)).toBe('debilitated');
  });
});

describe('determineCombustion', () => {
  // Sun is never combust
  test('Sun is never combust', () => {
    const result = determineCombustion('Sun', 100, 100, false);
    expect(result.isCombust).toBe(false);
  });

  // Rahu is never combust
  test('Rahu is never combust', () => {
    const result = determineCombustion('Rahu', 100, 105, true);
    expect(result.isCombust).toBe(false);
  });

  // Ketu is never combust
  test('Ketu is never combust', () => {
    const result = determineCombustion('Ketu', 280, 285, true);
    expect(result.isCombust).toBe(false);
  });

  // Moon combust within 12°
  test('Moon combust when within 12° of Sun', () => {
    const result = determineCombustion('Moon', 100, 108, false);
    expect(result.isCombust).toBe(true);
    expect(result.orb).toBe(8);
  });

  test('Moon not combust when more than 12° from Sun', () => {
    const result = determineCombustion('Moon', 100, 115, false);
    expect(result.isCombust).toBe(false);
  });

  // Mercury has different orbs for direct (14°) vs retrograde (12°)
  test('Mercury combust (direct) within 14°', () => {
    const result = determineCombustion('Mercury', 250, 260, false);
    expect(result.isCombust).toBe(true);
  });

  test('Mercury not combust (retrograde) at 13° — retrograde orb is 12°', () => {
    const result = determineCombustion('Mercury', 250, 263, true);
    expect(result.isCombust).toBe(false);
    expect(result.orb).toBe(13);
  });

  test('Mercury combust (retrograde) within 12°', () => {
    const result = determineCombustion('Mercury', 250, 260, true);
    expect(result.isCombust).toBe(true);
    expect(result.orb).toBe(10);
  });

  // Wrap-around near 0°/360°
  test('Combustion check handles wrap-around (planet at 355°, Sun at 5°)', () => {
    const result = determineCombustion('Venus', 355, 5, false);
    // Angular distance = 10°, Venus direct orb = 10°
    expect(result.isCombust).toBe(true);
    expect(result.orb).toBe(10);
  });
});
