import { calculateYoga } from '../../panchang/src/core/yoga';

describe('calculateYoga', () => {
  test('Yoga = (Sun + Moon) / 13.33', () => {
    // Sun=335.5 + Moon=359.8 = 695.3, normalized=335.3
    // 335.3 / 13.333 = 25.15 → index 25 → Indra (0-indexed)
    const result = calculateYoga(335.5, 359.8);
    expect(result.name).toBe('Indra');
    expect(result.number).toBe(26); // 1-indexed
  });

  test('Brahma yoga at sum ~320-333', () => {
    const result = calculateYoga(160, 165); // sum=325
    expect(result.name).toBe('Brahma');
    expect(result.number).toBe(25);
  });

  test('Vishkambha at sum 0-13.33', () => {
    const result = calculateYoga(3, 5); // sum=8
    expect(result.name).toBe('Vishkumbha');
    expect(result.number).toBe(1);
  });

  test('progress 0-100', () => {
    const result = calculateYoga(100, 100);
    expect(result.progress).toBeGreaterThanOrEqual(0);
    expect(result.progress).toBeLessThanOrEqual(100);
  });
});
