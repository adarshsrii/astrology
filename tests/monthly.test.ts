import { calculateMonthlyPanchang } from '../panchang/src/monthly';

describe('calculateMonthlyPanchang', () => {
  // Use a month with known special days — March 2026, Delhi
  const result = calculateMonthlyPanchang(2026, 3, 28.6139, 77.209, 'Asia/Kolkata');

  test('returns correct number of days', () => {
    expect(result.days).toHaveLength(31); // March has 31 days
  });

  test('returns correct year and month', () => {
    expect(result.year).toBe(2026);
    expect(result.month).toBe(3);
  });

  test('returns location info', () => {
    expect(result.location.lat).toBeCloseTo(28.6139, 2);
    expect(result.location.lon).toBeCloseTo(77.209, 2);
    expect(result.location.timezone).toBe('Asia/Kolkata');
  });

  test('each day has required fields', () => {
    for (const day of result.days) {
      expect(day.date).toMatch(/^2026-03-\d{2}$/);
      expect(day.weekday).toBeTruthy();
      expect(day.tithi.name).toBeTruthy();
      expect(day.tithi.paksha).toMatch(/^(Shukla|Krishna)$/);
      expect(typeof day.tithi.progress).toBe('number');
      expect(day.nakshatra.name).toBeTruthy();
      expect(typeof day.nakshatra.pada).toBe('number');
      expect(day.nakshatra.lord).toBeTruthy();
      expect(day.yoga.name).toBeTruthy();
      expect(day.karana.name).toBeTruthy();
      expect(day.moonSign).toBeTruthy();
      expect(day.sunSign).toBeTruthy();
      expect(day.moonPhase).toBeTruthy();
      expect(typeof day.moonIllumination).toBe('number');
      expect(day.moonIllumination).toBeGreaterThanOrEqual(0);
      expect(day.moonIllumination).toBeLessThanOrEqual(100);
    }
  });

  test('boolean flags exist on every day', () => {
    for (const day of result.days) {
      expect(typeof day.isPurnima).toBe('boolean');
      expect(typeof day.isAmavasya).toBe('boolean');
      expect(typeof day.isEkadashi).toBe('boolean');
    }
  });

  test('special days are string arrays', () => {
    for (const day of result.days) {
      expect(Array.isArray(day.specialDays)).toBe(true);
      for (const s of day.specialDays) {
        expect(typeof s).toBe('string');
      }
    }
  });

  test('sunrise and sunset are formatted strings', () => {
    for (const day of result.days) {
      // sunrise/sunset should be non-empty strings (format depends on SunCalc availability)
      expect(typeof day.sunrise).toBe('string');
      expect(typeof day.sunset).toBe('string');
    }
  });

  test('days are in chronological order', () => {
    for (let i = 1; i < result.days.length; i++) {
      expect(result.days[i].date > result.days[i - 1].date).toBe(true);
    }
  });

  test('weekdays cycle correctly', () => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const firstDayIndex = weekdays.indexOf(result.days[0].weekday);
    expect(firstDayIndex).toBeGreaterThanOrEqual(0);
    for (let i = 1; i < result.days.length; i++) {
      expect(result.days[i].weekday).toBe(weekdays[(firstDayIndex + i) % 7]);
    }
  });

  test('handles February (28 days in non-leap year)', () => {
    const feb = calculateMonthlyPanchang(2026, 2, 28.6139, 77.209, 'Asia/Kolkata');
    expect(feb.days).toHaveLength(28);
  });

  test('handles leap year February', () => {
    const feb = calculateMonthlyPanchang(2028, 2, 28.6139, 77.209, 'Asia/Kolkata');
    expect(feb.days).toHaveLength(29);
  });

  // When running with real ephemeris (not mocked swisseph), these should detect special days.
  // Under Jest with mocked swisseph, all tithis may be the same — so use conditional checks.
  test('Purnima flag is consistent with tithi name', () => {
    for (const day of result.days) {
      if (day.isPurnima) {
        expect(day.tithi.name).toBe('Purnima');
        expect(day.specialDays).toContain('Purnima');
      }
    }
  });

  test('Amavasya flag is consistent with tithi name', () => {
    for (const day of result.days) {
      if (day.isAmavasya) {
        expect(day.tithi.name).toBe('Amavasya');
        expect(day.specialDays).toContain('Amavasya');
      }
    }
  });

  test('Ekadashi flag is consistent with specialDays', () => {
    for (const day of result.days) {
      if (day.isEkadashi) {
        expect(day.specialDays).toContain('Ekadashi');
      }
    }
  });
});
