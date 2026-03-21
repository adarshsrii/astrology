/**
 * Recommendations Module Tests — Name Suggestions & Remedies
 */

import {
  getNameSuggestions,
  NAKSHATRA_SYLLABLES,
} from '../../panchang/src/birthchart/recommendations/names';

import {
  getRemedies,
  getPlanetRemedy,
} from '../../panchang/src/birthchart/recommendations/remedies';

// ── Name Suggestions ────────────────────────────────────────────────────────────

describe('Name Suggestions', () => {
  test('all 27 nakshatras have syllable mappings', () => {
    expect(Object.keys(NAKSHATRA_SYLLABLES)).toHaveLength(27);
  });

  test('each nakshatra has exactly 4 padas', () => {
    for (const [nakshatra, syllables] of Object.entries(NAKSHATRA_SYLLABLES)) {
      expect(syllables).toHaveLength(4);
    }
  });

  test('Ashwini Pada 1 syllable is "Chu"', () => {
    expect(NAKSHATRA_SYLLABLES['Ashwini'][0]).toBe('Chu');
  });

  test('Ashwini Pada 1 returns name suggestions', () => {
    const results = getNameSuggestions('Ashwini', 1);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].syllable).toBe('Chu');
    expect(results[0].nakshatra).toBe('Ashwini');
    expect(results[0].pada).toBe(1);
  });

  test('returned names start with the correct syllable', () => {
    const results = getNameSuggestions('Ashwini', 1);
    for (const group of results) {
      for (const entry of group.names) {
        expect(entry.name.startsWith('Chu') || entry.name.startsWith('chu')).toBe(true);
      }
    }
  });

  test('Rohini Pada 2 syllable is "Va"', () => {
    const results = getNameSuggestions('Rohini', 2);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].syllable).toBe('Va');
  });

  test('Magha Pada 1 returns names starting with "Ma"', () => {
    const results = getNameSuggestions('Magha', 1);
    expect(results.length).toBeGreaterThan(0);
    for (const group of results) {
      for (const entry of group.names) {
        expect(entry.name.startsWith('Ma')).toBe(true);
      }
    }
  });

  test('names include gender information', () => {
    const results = getNameSuggestions('Krittika', 1); // syllable "A"
    expect(results.length).toBeGreaterThan(0);
    for (const group of results) {
      expect(['male', 'female', 'unisex']).toContain(group.gender);
      for (const entry of group.names) {
        expect(['male', 'female', 'unisex']).toContain(entry.gender);
      }
    }
  });

  test('invalid nakshatra returns empty array', () => {
    const results = getNameSuggestions('InvalidNakshatra', 1);
    expect(results).toEqual([]);
  });

  test('invalid pada returns empty array', () => {
    expect(getNameSuggestions('Ashwini', 0)).toEqual([]);
    expect(getNameSuggestions('Ashwini', 5)).toEqual([]);
  });

  test('Revati Pada 3 syllable is "Cha"', () => {
    const results = getNameSuggestions('Revati', 3);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].syllable).toBe('Cha');
  });
});

// ── Remedies ────────────────────────────────────────────────────────────────────

describe('Planetary Remedies', () => {
  test('debilitated Saturn recommends Blue Sapphire', () => {
    const result = getRemedies([
      { name: 'Saturn', dignity: 'debilitated', isCombust: false, house: 1 },
    ]);
    expect(result.weakPlanets).toHaveLength(1);
    expect(result.weakPlanets[0].planet).toBe('Saturn');
    expect(result.weakPlanets[0].remedy.gemstone.name).toBe('Blue Sapphire');
  });

  test('strong planets do not get remedies', () => {
    const result = getRemedies([
      { name: 'Jupiter', dignity: 'exalted', isCombust: false, house: 1 },
      { name: 'Venus', dignity: 'own_sign', isCombust: false, house: 7 },
      { name: 'Mars', dignity: 'moolatrikona', isCombust: false, house: 10 },
    ]);
    expect(result.weakPlanets).toHaveLength(0);
  });

  test('combust planet receives remedy', () => {
    const result = getRemedies([
      { name: 'Mercury', dignity: 'neutral', isCombust: true, house: 5 },
    ]);
    expect(result.weakPlanets).toHaveLength(1);
    expect(result.weakPlanets[0].planet).toBe('Mercury');
    expect(result.weakPlanets[0].reason).toContain('combust');
    expect(result.weakPlanets[0].remedy.gemstone.name).toBe('Emerald');
  });

  test('planet in dusthana house receives remedy', () => {
    const result = getRemedies([
      { name: 'Jupiter', dignity: 'neutral', isCombust: false, house: 8 },
    ]);
    expect(result.weakPlanets).toHaveLength(1);
    expect(result.weakPlanets[0].reason).toContain('house 8');
    expect(result.weakPlanets[0].reason).toContain('dusthana');
  });

  test('dusthana houses are 6, 8, 12', () => {
    for (const house of [6, 8, 12]) {
      const result = getRemedies([
        { name: 'Sun', dignity: 'neutral', isCombust: false, house },
      ]);
      expect(result.weakPlanets).toHaveLength(1);
    }

    // Non-dusthana — no remedy
    for (const house of [1, 2, 3, 4, 5, 7, 9, 10, 11]) {
      const result = getRemedies([
        { name: 'Sun', dignity: 'neutral', isCombust: false, house },
      ]);
      expect(result.weakPlanets).toHaveLength(0);
    }
  });

  test('multiple afflictions show combined reason', () => {
    const result = getRemedies([
      { name: 'Venus', dignity: 'debilitated', isCombust: true, house: 6 },
    ]);
    expect(result.weakPlanets).toHaveLength(1);
    expect(result.weakPlanets[0].reason).toContain('debilitated');
    expect(result.weakPlanets[0].reason).toContain('combust');
    expect(result.weakPlanets[0].reason).toContain('dusthana');
  });

  test('general remedies always present', () => {
    const result = getRemedies([]);
    expect(result.generalRemedies.length).toBeGreaterThan(0);
  });

  test('Saturn affliction adds crow-feeding advice', () => {
    const result = getRemedies([
      { name: 'Saturn', dignity: 'debilitated', isCombust: false, house: 1 },
    ]);
    expect(result.generalRemedies.some(r => r.includes('crow'))).toBe(true);
  });

  test('getPlanetRemedy returns data for valid planet', () => {
    const remedy = getPlanetRemedy('Sun');
    expect(remedy).not.toBeNull();
    expect(remedy!.gemstone.name).toBe('Ruby');
    expect(remedy!.mantra.vedic).toBe('Om Suryaya Namah');
  });

  test('getPlanetRemedy returns null for invalid planet', () => {
    expect(getPlanetRemedy('Pluto')).toBeNull();
  });

  test('all 9 planets have remedy data', () => {
    const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];
    for (const planet of planets) {
      expect(getPlanetRemedy(planet)).not.toBeNull();
    }
  });

  test('peak_debilitated also triggers remedy', () => {
    const result = getRemedies([
      { name: 'Moon', dignity: 'peak_debilitated', isCombust: false, house: 1 },
    ]);
    expect(result.weakPlanets).toHaveLength(1);
    expect(result.weakPlanets[0].remedy.gemstone.name).toBe('Pearl');
  });
});
