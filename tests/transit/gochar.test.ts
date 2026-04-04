import { calculateDailyHoroscope, getDailyHoroscope } from '../../panchang/src/transit/index';

describe('Daily Horoscope (Gochar)', () => {
  it('should calculate horoscope for each moon sign', () => {
    const date = new Date('2026-04-04T06:00:00Z');

    for (let sign = 1; sign <= 12; sign++) {
      const result = getDailyHoroscope(date, sign);

      expect(result).toBeDefined();
      expect(result.moonSignNumber).toBe(sign);
      expect(result.moonSign).toBeTruthy();
      expect(result.moonSignHi).toBeTruthy();
      expect(result.overallScore).toBeGreaterThanOrEqual(-100);
      expect(result.overallScore).toBeLessThanOrEqual(100);
      expect(['excellent', 'good', 'average', 'challenging', 'difficult']).toContain(result.rating);
      expect(result.summary).toBeTruthy();
      expect(result.summaryHi).toBeTruthy();
      expect(result.transits.length).toBeGreaterThan(0);
      expect(result.areas.length).toBe(5);
      expect(result.lucky).toBeDefined();
      expect(result.caution).toBeTruthy();
    }
  });

  it('should return correct moon sign names', () => {
    const date = new Date('2026-04-04T06:00:00Z');

    const aries = getDailyHoroscope(date, 1);
    expect(aries.moonSign).toBe('Aries');
    expect(aries.moonSignHi).toBe('मेष');

    const cancer = getDailyHoroscope(date, 4);
    expect(cancer.moonSign).toBe('Cancer');
    expect(cancer.moonSignHi).toBe('कर्क');
  });

  it('should have transits for all 9 planets', () => {
    const date = new Date('2026-04-04T06:00:00Z');
    const result = getDailyHoroscope(date, 1);

    const planetNames = result.transits.map(t => t.planet);
    expect(planetNames).toContain('Sun');
    expect(planetNames).toContain('Moon');
    expect(planetNames).toContain('Mars');
    expect(planetNames).toContain('Mercury');
    expect(planetNames).toContain('Jupiter');
    expect(planetNames).toContain('Venus');
    expect(planetNames).toContain('Saturn');
    expect(planetNames).toContain('Rahu');
    expect(planetNames).toContain('Ketu');
  });

  it('should have valid house numbers (1-12)', () => {
    const date = new Date('2026-04-04T06:00:00Z');
    const result = getDailyHoroscope(date, 7);

    for (const transit of result.transits) {
      expect(transit.houseFromMoon).toBeGreaterThanOrEqual(1);
      expect(transit.houseFromMoon).toBeLessThanOrEqual(12);
    }
  });

  it('should have life area predictions with valid scores', () => {
    const date = new Date('2026-04-04T06:00:00Z');
    const result = getDailyHoroscope(date, 10);

    const areaNames = result.areas.map(a => a.area);
    expect(areaNames).toContain('career');
    expect(areaNames).toContain('finance');
    expect(areaNames).toContain('health');
    expect(areaNames).toContain('relationships');
    expect(areaNames).toContain('spiritual');

    for (const area of result.areas) {
      expect(area.score).toBeGreaterThanOrEqual(-100);
      expect(area.score).toBeLessThanOrEqual(100);
      expect(area.prediction).toBeTruthy();
      expect(area.predictionHi).toBeTruthy();
    }
  });

  it('should throw for invalid moon sign', () => {
    const date = new Date('2026-04-04T06:00:00Z');
    expect(() => getDailyHoroscope(date, 0)).toThrow();
    expect(() => getDailyHoroscope(date, 13)).toThrow();
  });

  it('should work with calculateDailyHoroscope full input', () => {
    const result = calculateDailyHoroscope({
      date: new Date('2026-04-04T06:00:00Z'),
      moonSignNumber: 5,
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 'Asia/Kolkata',
    });

    expect(result).toBeDefined();
    expect(result.moonSign).toBe('Leo');
    expect(result.transits.length).toBe(9);
  });

  it('should produce different scores for different signs on same day', () => {
    const date = new Date('2026-04-04T06:00:00Z');
    const scores = new Set<number>();

    for (let sign = 1; sign <= 12; sign++) {
      const result = getDailyHoroscope(date, sign);
      scores.add(result.overallScore);
    }

    // At least some signs should have different scores
    expect(scores.size).toBeGreaterThan(1);
  });

  it('should detect Vedha when applicable', () => {
    const date = new Date('2026-04-04T06:00:00Z');
    let vedhaFound = false;

    // Check across all signs for any Vedha detection
    for (let sign = 1; sign <= 12; sign++) {
      const result = getDailyHoroscope(date, sign);
      for (const transit of result.transits) {
        if (transit.isVedhaActive) {
          vedhaFound = true;
          expect(transit.vedhaPlanet).toBeTruthy();
          break;
        }
      }
      if (vedhaFound) break;
    }

    // Vedha is common enough that we should find at least one
    expect(vedhaFound).toBe(true);
  });
});
