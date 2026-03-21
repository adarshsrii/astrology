/**
 * Tests for house calculation and planet-to-house assignment.
 */

import { calculateHouses, assignPlanetsToHouses, populateHousePlanets } from '../../panchang/src/birthchart/core/houses';
import { GrahaPosition } from '../../panchang/src/birthchart/types';

describe('calculateHouses (whole_sign)', () => {
  test('Lagna in Aries (sign 1): house 1 = Aries, house 2 = Taurus, etc.', () => {
    const houses = calculateHouses(1, 'whole_sign');
    expect(houses).toHaveLength(12);
    expect(houses[0].number).toBe(1);
    expect(houses[0].signNumber).toBe(1);
    expect(houses[0].signName).toBe('Aries');
    expect(houses[1].number).toBe(2);
    expect(houses[1].signNumber).toBe(2);
    expect(houses[1].signName).toBe('Taurus');
    expect(houses[11].number).toBe(12);
    expect(houses[11].signNumber).toBe(12);
    expect(houses[11].signName).toBe('Pisces');
  });

  test('Lagna in Scorpio (sign 8): house 1 = Scorpio, house 2 = Sagittarius', () => {
    const houses = calculateHouses(8, 'whole_sign');
    expect(houses[0].signNumber).toBe(8);
    expect(houses[0].signName).toBe('Scorpio');
    expect(houses[1].signNumber).toBe(9);
    expect(houses[1].signName).toBe('Sagittarius');
    expect(houses[5].signNumber).toBe(1); // house 6 = Aries
    expect(houses[5].signName).toBe('Aries');
  });

  test('houses wrap around correctly for lagna in Pisces (sign 12)', () => {
    const houses = calculateHouses(12, 'whole_sign');
    expect(houses[0].signNumber).toBe(12); // house 1 = Pisces
    expect(houses[1].signNumber).toBe(1);  // house 2 = Aries
    expect(houses[2].signNumber).toBe(2);  // house 3 = Taurus
  });

  test('each house has empty planets array initially', () => {
    const houses = calculateHouses(1, 'whole_sign');
    for (const h of houses) {
      expect(h.planets).toEqual([]);
    }
  });
});

describe('assignPlanetsToHouses', () => {
  // Create minimal mock planet positions
  function makePlanet(name: string, signNumber: number): GrahaPosition {
    return {
      name: name as any,
      longitude: (signNumber - 1) * 30 + 15,
      latitude: 0,
      speed: 1,
      retrograde: false,
      signName: '',
      signNumber,
      degreeInSign: 15,
      nakshatra: '',
      nakshatraNumber: 1,
      nakshatraPada: 1,
      nakshatraLord: '',
      dignity: 'neutral',
      isCombust: false,
      combustOrb: 0,
      symbol: '',
    };
  }

  test('planet in lagna sign goes to house 1', () => {
    const planets = [makePlanet('Sun', 8)]; // Sun in Scorpio, lagna = Scorpio
    const assignment = assignPlanetsToHouses(planets, 8, 'whole_sign');
    expect(assignment['Sun']).toBe(1);
  });

  test('planet in next sign goes to house 2', () => {
    const planets = [makePlanet('Moon', 9)]; // Moon in Sagittarius, lagna = Scorpio
    const assignment = assignPlanetsToHouses(planets, 8, 'whole_sign');
    expect(assignment['Moon']).toBe(2);
  });

  test('planet wrapping around (sign before lagna)', () => {
    const planets = [makePlanet('Venus', 7)]; // Venus in Libra, lagna = Scorpio(8)
    const assignment = assignPlanetsToHouses(planets, 8, 'whole_sign');
    // (7 - 8 + 12) % 12 + 1 = 11 % 12 + 1 = 12
    expect(assignment['Venus']).toBe(12);
  });

  test('all planets assigned for Delhi fixture scenario', () => {
    // Lagna = Scorpio (8)
    const planets = [
      makePlanet('Sun', 9),      // Sagittarius -> house 2
      makePlanet('Moon', 6),     // Virgo -> house 11
      makePlanet('Mars', 11),    // Aquarius -> house 4
      makePlanet('Mercury', 9),  // Sagittarius -> house 2
      makePlanet('Jupiter', 1),  // Aries -> house 6
      makePlanet('Venus', 10),   // Capricorn -> house 3
      makePlanet('Saturn', 1),   // Aries -> house 6
      makePlanet('Rahu', 4),     // Cancer -> house 9
      makePlanet('Ketu', 10),    // Capricorn -> house 3
    ];
    const assignment = assignPlanetsToHouses(planets, 8, 'whole_sign');

    expect(assignment['Sun']).toBe(2);
    expect(assignment['Moon']).toBe(11);
    expect(assignment['Mars']).toBe(4);
    expect(assignment['Mercury']).toBe(2);
    expect(assignment['Jupiter']).toBe(6);
    expect(assignment['Venus']).toBe(3);
    expect(assignment['Saturn']).toBe(6);
    expect(assignment['Rahu']).toBe(9);
    expect(assignment['Ketu']).toBe(3);
  });
});

describe('populateHousePlanets', () => {
  function makePlanet(name: string, signNumber: number): GrahaPosition {
    return {
      name: name as any,
      longitude: (signNumber - 1) * 30 + 15,
      latitude: 0,
      speed: 1,
      retrograde: false,
      signName: '',
      signNumber,
      degreeInSign: 15,
      nakshatra: '',
      nakshatraNumber: 1,
      nakshatraPada: 1,
      nakshatraLord: '',
      dignity: 'neutral',
      isCombust: false,
      combustOrb: 0,
      symbol: '',
    };
  }

  test('planets are placed in correct house arrays', () => {
    const houses = calculateHouses(1, 'whole_sign');
    const planets = [makePlanet('Sun', 1), makePlanet('Moon', 1), makePlanet('Mars', 5)];
    const assignment = { Sun: 1, Moon: 1, Mars: 5 };

    populateHousePlanets(houses, planets, assignment);

    expect(houses[0].planets).toEqual(['Sun', 'Moon']);
    expect(houses[4].planets).toEqual(['Mars']);
    // Other houses should be empty
    expect(houses[1].planets).toEqual([]);
  });
});
