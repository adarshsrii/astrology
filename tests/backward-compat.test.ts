describe('Backward Compatibility', () => {
  const pkg = require('../index');

  test('all existing exports present', () => {
    expect(typeof pkg.calculateSunriseSunset).toBe('function');
    expect(typeof pkg.calculateAbhijeetMuhurt).toBe('function');
    expect(typeof pkg.calculateChoghadiya).toBe('function');
    expect(typeof pkg.calculateRahuKalam).toBe('function');
    expect(typeof pkg.calculateBioRhythms).toBe('function');
    expect(typeof pkg.calculateMoonPosition).toBe('function');
    expect(typeof pkg.calculateNakshatras).toBe('function');
    expect(typeof pkg.calculatePanchang).toBe('function');
  });

  test('new export present', () => {
    expect(typeof pkg.calculateFullPanchang).toBe('function');
  });

  test('calculateSunriseSunset returns correct shape', () => {
    const result = pkg.calculateSunriseSunset('2026-03-20', 28.6139, 77.209, 'Asia/Kolkata');
    expect(result).toHaveProperty('sunrise');
    expect(result).toHaveProperty('sunset');
  });

  test('calculateChoghadiya returns correct shape', () => {
    const sun = pkg.calculateSunriseSunset('2026-03-20', 28.6139, 77.209, 'Asia/Kolkata');
    const result = pkg.calculateChoghadiya('2026-03-20', sun.sunrise, sun.sunset, 'Asia/Kolkata');
    expect(result).toHaveProperty('daytimeChoghadiyas');
    expect(result).toHaveProperty('nighttimeChoghadiyas');
    expect(result).toHaveProperty('auspicious');
  });

  test('calculateBioRhythms returns correct shape', () => {
    const result = pkg.calculateBioRhythms('2026-03-20', '1994-12-09', 'Asia/Kolkata', 7);
    expect(result).toHaveProperty('survivalDays');
    expect(result.data).toHaveLength(4);
  });
});
