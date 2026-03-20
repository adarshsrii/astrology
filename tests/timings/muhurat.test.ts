import { calculateMuhurats, MuhuratEntry } from '../../panchang/src/timings/muhurat';

/**
 * Reference data: Delhi, March 20 2026 (Friday)
 * Sunrise: 06:10, Sunset: 18:17
 * Day duration: 727 min, muhurta = 727/15 ≈ 48.47 min
 *
 * Expected (approx from Nakshatrica/DrikPanchang):
 *   Brahma Muhurta: ~04:33 - 05:22
 *   Abhijit Muhurat: ~11:49 - 12:38 (7th-9th muhurta)
 */

describe('calculateMuhurats', () => {
  const sunrise = '06:10';
  const sunset = '18:17';
  const date = '2026-03-20';
  const lat = 26.98;
  const lon = 80.92;
  const tz = 'Asia/Kolkata';

  let muhurats: MuhuratEntry[];

  beforeAll(() => {
    muhurats = calculateMuhurats(sunrise, sunset, date, lat, lon, tz);
  });

  test('returns 7 muhurats', () => {
    expect(muhurats.length).toBe(7);
  });

  test('all entries have required fields', () => {
    for (const m of muhurats) {
      expect(m.name).toBeTruthy();
      expect(m.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(m.endTime).toMatch(/^\d{2}:\d{2}$/);
      expect(m.description).toBeTruthy();
    }
  });

  test('Brahma Muhurta is about 1h36m before sunrise', () => {
    const brahma = muhurats.find(m => m.name === 'Brahma Muhurta')!;
    expect(brahma).toBeDefined();
    // Should start around 04:33 (06:10 - 97min = 04:33)
    const startParts = brahma.startTime.split(':').map(Number);
    const startMin = startParts[0] * 60 + startParts[1];
    // Expect between 04:20 and 04:50
    expect(startMin).toBeGreaterThanOrEqual(4 * 60 + 20);
    expect(startMin).toBeLessThanOrEqual(4 * 60 + 50);
  });

  test('Abhijit Muhurat is around midday', () => {
    const abhijit = muhurats.find(m => m.name === 'Abhijit Muhurat')!;
    expect(abhijit).toBeDefined();
    const startParts = abhijit.startTime.split(':').map(Number);
    const startMin = startParts[0] * 60 + startParts[1];
    // Should be around 11:49 (sunrise + 7*48.47 = 06:10 + 339 = 11:49)
    expect(startMin).toBeGreaterThanOrEqual(11 * 60 + 30);
    expect(startMin).toBeLessThanOrEqual(12 * 60 + 10);
  });

  test('Vijaya Muhurat is in the afternoon', () => {
    const vijaya = muhurats.find(m => m.name === 'Vijaya Muhurat')!;
    expect(vijaya).toBeDefined();
    const startParts = vijaya.startTime.split(':').map(Number);
    const startMin = startParts[0] * 60 + startParts[1];
    // 13th muhurta: 06:10 + 12*48.47 = 06:10 + 582 = 15:52
    expect(startMin).toBeGreaterThanOrEqual(15 * 60);
    expect(startMin).toBeLessThanOrEqual(16 * 60 + 30);
  });

  test('Godhuli Muhurat is around sunset', () => {
    const godhuli = muhurats.find(m => m.name === 'Godhuli Muhurat')!;
    expect(godhuli).toBeDefined();
    expect(godhuli.startTime).toBe('18:05');
    expect(godhuli.endTime).toBe('18:29');
  });

  test('Nishita Muhurat is around midnight', () => {
    const nishita = muhurats.find(m => m.name === 'Nishita Muhurat')!;
    expect(nishita).toBeDefined();
    const startParts = nishita.startTime.split(':').map(Number);
    const startMin = startParts[0] * 60 + startParts[1];
    // Midnight = sunset + nightDuration/2 = 18:17 + (713/2) = 18:17 + 356.5 = ~00:14 next day
    // So nishita: ~23:50 - 00:38
    expect(startMin).toBeGreaterThanOrEqual(23 * 60 + 30);
  });
});
