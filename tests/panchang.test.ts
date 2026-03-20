import { calculateFullPanchang } from '../panchang/src/panchang-v2';
import fixture from './fixtures/drik-2026-03-20-delhi.json';

describe('calculateFullPanchang integration', () => {
  const result = calculateFullPanchang(
    '2026-03-20',
    fixture.meta.latitude,
    fixture.meta.longitude,
    fixture.meta.timezone,
  );

  test('returns valid shape', () => {
    expect(result.date).toBe('2026-03-20');
    expect(result.tithi.length).toBeGreaterThanOrEqual(1);
    expect(result.nakshatra.length).toBeGreaterThanOrEqual(1);
    expect(result.yoga.length).toBeGreaterThanOrEqual(1);
    expect(result.karana.length).toBeGreaterThanOrEqual(1);
    expect(result.vara.name).toBe(fixture.vara.name);
  });

  test('paksha matches', () => {
    expect(result.paksha).toBe(fixture.paksha);
  });

  test('moon sign matches', () => {
    expect(result.moonSign.name).toBe(fixture.moonSign);
  });

  test('sun sign matches', () => {
    expect(result.sunSign.name).toBe(fixture.sunSign);
  });
});
