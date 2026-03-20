import { calculateKarana } from '../../panchang/src/core/karana';

describe('calculateKarana', () => {
  test('first karana (0-6° diff) is Kimstughna', () => {
    const result = calculateKarana(0, 3);
    expect(result.name).toBe('Kimstughna');
    expect(result.number).toBe(1);
  });

  test('Balava at diff 12-18° (index 2)', () => {
    const result = calculateKarana(0, 15); // diff=15°, index=2
    expect(result.name).toBe('Balava');
  });

  test('repeating cycle works', () => {
    // Index 1 → Bava, 2→Balava, 3→Kaulava, 4→Taitila, 5→Garija, 6→Vanija, 7→Vishti
    // Index 8 → Bava (repeats)
    const r1 = calculateKarana(0, 7);  // index 1 → Bava
    const r8 = calculateKarana(0, 49); // index 8 → Bava
    expect(r1.name).toBe('Bava');
    expect(r8.name).toBe('Bava');
  });

  test('fixed last karanas (57-59)', () => {
    // diff=342-348° → index 57 → Shakuni
    const result = calculateKarana(0, 345);
    expect(result.name).toBe('Shakuni');
  });

  test('progress 0-100', () => {
    const result = calculateKarana(0, 100);
    expect(result.progress).toBeGreaterThanOrEqual(0);
    expect(result.progress).toBeLessThanOrEqual(100);
  });
});
