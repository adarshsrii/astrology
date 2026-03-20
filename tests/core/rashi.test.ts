import { calculateRashi } from '../../panchang/src/core/rashi';

describe('calculateRashi', () => {
  test('Pisces at 330-360°', () => {
    const result = calculateRashi(350);
    expect(result.name).toBe('Pisces');
    expect(result.lord).toBe('Jupiter');
    expect(result.number).toBe(12);
    expect(result.degree).toBeCloseTo(20, 0);
  });

  test('Aries at 0-30°', () => {
    const result = calculateRashi(15);
    expect(result.name).toBe('Aries');
    expect(result.number).toBe(1);
  });

  test('degree within sign 0-30', () => {
    const result = calculateRashi(45);
    expect(result.name).toBe('Taurus');
    expect(result.degree).toBeCloseTo(15, 0);
  });

  test('Cancer at 90-120°', () => {
    const result = calculateRashi(100);
    expect(result.name).toBe('Cancer');
    expect(result.lord).toBe('Moon');
  });

  test('wraps at 360°', () => {
    const result = calculateRashi(365);
    expect(result.name).toBe('Aries');
    expect(result.degree).toBeCloseTo(5, 0);
  });
});
