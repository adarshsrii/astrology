import { calculateKalams, KalamEntry } from '../../panchang/src/timings/kalam';

/**
 * Reference data: Delhi, March 20 2026 (Friday)
 * Sunrise: 06:10, Sunset: 18:17
 * Day duration: 727 min, segment = 727/8 ≈ 90.875 min
 *
 * Rahu Kalam for Friday = 4th segment:
 *   Start: 06:10 + 3*90.875 = 06:10 + 272.6 = 10:43
 *   End: 10:43 + 90.875 = 12:14
 */

describe('calculateKalams', () => {
  const sunrise = '06:10';
  const sunset = '18:17';
  const date = '2026-03-20';
  const lat = 26.98;
  const lon = 80.92;
  const tz = 'Asia/Kolkata';

  let kalams: KalamEntry[];

  beforeAll(() => {
    kalams = calculateKalams(sunrise, sunset, date, lat, lon, tz);
  });

  test('returns at least 4 kalam entries', () => {
    // Rahu, Gulika, Yamaganda, Varjyam (placeholder), + Dur Muhurtam(s)
    expect(kalams.length).toBeGreaterThanOrEqual(4);
  });

  test('all entries have name and description', () => {
    for (const k of kalams) {
      expect(k.name).toBeTruthy();
      expect(k.description).toBeTruthy();
    }
  });

  test('Rahu Kalam for Friday is around 10:43-12:14', () => {
    const rahu = kalams.find(k => k.name === 'Rahu Kalam')!;
    expect(rahu).toBeDefined();
    expect(rahu.startTime).toMatch(/^10:4[0-5]$/);
    expect(rahu.endTime).toMatch(/^12:1[2-6]$/);
  });

  test('Gulika Kalam is present', () => {
    const gulika = kalams.find(k => k.name === 'Gulika Kalam')!;
    expect(gulika).toBeDefined();
    // Friday Gulika: 13:30-15:00
    expect(gulika.startTime).toBe('13:30');
    expect(gulika.endTime).toBe('15:00');
  });

  test('Yamaganda is present', () => {
    const yama = kalams.find(k => k.name === 'Yamaganda')!;
    expect(yama).toBeDefined();
    // Friday = 7th section
    const startParts = yama.startTime.split(':').map(Number);
    const startMin = startParts[0] * 60 + startParts[1];
    // Section 7: 06:10 + 6*90.875 = 06:10 + 545.25 = 15:15
    expect(startMin).toBeGreaterThanOrEqual(15 * 60);
    expect(startMin).toBeLessThanOrEqual(15 * 60 + 30);
  });

  test('Varjyam placeholder is present', () => {
    const varjyam = kalams.find(k => k.name === 'Varjyam')!;
    expect(varjyam).toBeDefined();
    // Placeholder has empty times
    expect(varjyam.startTime).toBe('');
    expect(varjyam.endTime).toBe('');
  });

  test('Dur Muhurtam entries are present', () => {
    const dur = kalams.filter(k => k.name.startsWith('Dur Muhurtam'));
    // Friday has 2 Dur Muhurtam periods
    expect(dur.length).toBeGreaterThanOrEqual(1);
    for (const d of dur) {
      expect(d.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(d.endTime).toMatch(/^\d{2}:\d{2}$/);
    }
  });
});
