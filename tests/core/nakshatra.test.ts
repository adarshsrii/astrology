import { calculateNakshatra } from '../../panchang/src/core/nakshatra';

describe('calculateNakshatra', () => {
  test('Revati at 346.67-360°', () => {
    const result = calculateNakshatra(355.0);
    expect(result.name).toBe('Revati');
    expect(result.lord).toBe('Mercury');
  });

  test('Ashwini at 0-13.33°', () => {
    const result = calculateNakshatra(5.0);
    expect(result.name).toBe('Ashwini');
    expect(result.pada).toBe(2);
  });

  test('Pada calculation across all 4', () => {
    expect(calculateNakshatra(1.0).pada).toBe(1);
    expect(calculateNakshatra(5.0).pada).toBe(2);
    expect(calculateNakshatra(8.0).pada).toBe(3);
    expect(calculateNakshatra(12.0).pada).toBe(4);
  });

  test('progress 0-100', () => {
    const result = calculateNakshatra(200.0);
    expect(result.progress).toBeGreaterThanOrEqual(0);
    expect(result.progress).toBeLessThanOrEqual(100);
  });

  test('Pushya (8th nakshatra) at ~93-107°', () => {
    const result = calculateNakshatra(100.0);
    expect(result.name).toBe('Pushya');
    expect(result.number).toBe(8);
  });
});
