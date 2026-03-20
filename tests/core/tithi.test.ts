import { calculateTithi } from '../../panchang/src/core/tithi';

describe('calculateTithi', () => {
  test('Shukla Dwitiya when Moon ~20° ahead of Sun', () => {
    const result = calculateTithi(0, 20); // diff=20°, tithi index=1 (0-based) → Dwitiya
    expect(result.name).toContain('Dwitiya');
    expect(result.number).toBe(2);
    expect(result.paksha).toBe('Shukla');
    expect(result.progress).toBeGreaterThan(0);
    expect(result.progress).toBeLessThan(100);
  });

  test('Shukla Chaturdashi when diff ~156-168°', () => {
    const result = calculateTithi(0, 160); // diff=160°, index=13 → Chaturdashi
    expect(result.name).toContain('Chaturdashi');
    expect(result.paksha).toBe('Shukla');
  });

  test('Purnima at diff ~180°', () => {
    const result = calculateTithi(0, 182); // diff=182°, index=15 → tithiIndex 16 (1-based)
    expect(result.tithiIndex).toBe(16); // 1-based: 16th tithi
  });

  test('Amavasya near 0° diff', () => {
    const result = calculateTithi(100, 103); // diff=3°, index=0 → tithiIndex 1 (1-based)
    expect(result.tithiIndex).toBe(1);
    expect(result.paksha).toBe('Shukla');
  });

  test('Krishna paksha when diff > 180°', () => {
    const result = calculateTithi(0, 200); // diff=200°, index=16
    expect(result.paksha).toBe('Krishna');
  });

  test('progress 0-100', () => {
    const result = calculateTithi(0, 50);
    expect(result.progress).toBeGreaterThanOrEqual(0);
    expect(result.progress).toBeLessThanOrEqual(100);
  });
});
