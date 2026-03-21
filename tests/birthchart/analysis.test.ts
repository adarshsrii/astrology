/**
 * Tests for Birth Chart Analysis modules:
 * Tattva Balance, Planetary Friendships, Planetary Aspects.
 */

import { calculateTattvaBalance, TattvaInput } from '../../panchang/src/birthchart/analysis/tattva';
import {
  calculateFriendships,
  calculateTemporalFriendships,
  NATURAL_FRIENDSHIPS,
  FriendshipInput,
} from '../../panchang/src/birthchart/analysis/friendships';
import { calculateAspects, AspectPlanetInput } from '../../panchang/src/birthchart/analysis/aspects';

// ── Tattva Balance ──────────────────────────────────────────────────────────

describe('Tattva Balance', () => {
  test('counts elements correctly', () => {
    const placements: TattvaInput[] = [
      { name: 'Lagna', signNumber: 1 },   // Aries -> Fire
      { name: 'Sun', signNumber: 5 },     // Leo -> Fire
      { name: 'Moon', signNumber: 4 },    // Cancer -> Water
      { name: 'Mars', signNumber: 10 },   // Capricorn -> Earth
      { name: 'Mercury', signNumber: 3 }, // Gemini -> Air
      { name: 'Jupiter', signNumber: 9 }, // Sagittarius -> Fire
      { name: 'Venus', signNumber: 2 },   // Taurus -> Earth
      { name: 'Saturn', signNumber: 11 }, // Aquarius -> Air
      { name: 'Rahu', signNumber: 7 },    // Libra -> Air
      { name: 'Ketu', signNumber: 1 },    // Aries -> Fire
    ];

    const result = calculateTattvaBalance(placements);

    expect(result.fire.count).toBe(4);
    expect(result.fire.planets).toEqual(['Lagna', 'Sun', 'Jupiter', 'Ketu']);
    expect(result.earth.count).toBe(2);
    expect(result.earth.planets).toEqual(['Mars', 'Venus']);
    expect(result.air.count).toBe(3);
    expect(result.air.planets).toEqual(['Mercury', 'Saturn', 'Rahu']);
    expect(result.water.count).toBe(1);
    expect(result.water.planets).toEqual(['Moon']);
  });

  test('identifies dominant and deficient', () => {
    const placements: TattvaInput[] = [
      { name: 'Sun', signNumber: 1 },     // Fire
      { name: 'Moon', signNumber: 5 },    // Fire
      { name: 'Mars', signNumber: 9 },    // Fire
      { name: 'Mercury', signNumber: 2 }, // Earth
      { name: 'Jupiter', signNumber: 4 }, // Water
      { name: 'Venus', signNumber: 8 },   // Water
      { name: 'Saturn', signNumber: 3 },  // Air
    ];

    const result = calculateTattvaBalance(placements);

    expect(result.dominant).toBe('Fire');
    expect(result.fire.count).toBe(3);
    // Earth and Air each have 1; deficient should be the last in sorted order.
    // Earth(1), Air(1), Water(2) — Earth and Air tie at 1, first alphabetically in declaration order
    expect(result.deficient).toBe('Air');
  });

  test('percentages add up correctly', () => {
    const placements: TattvaInput[] = [
      { name: 'Sun', signNumber: 1 },     // Fire
      { name: 'Moon', signNumber: 2 },    // Earth
      { name: 'Mars', signNumber: 3 },    // Air
      { name: 'Jupiter', signNumber: 4 }, // Water
    ];

    const result = calculateTattvaBalance(placements);

    expect(result.fire.percentage).toBe(25);
    expect(result.earth.percentage).toBe(25);
    expect(result.air.percentage).toBe(25);
    expect(result.water.percentage).toBe(25);
  });

  test('handles empty placements gracefully', () => {
    const result = calculateTattvaBalance([]);
    expect(result.fire.count).toBe(0);
    expect(result.earth.count).toBe(0);
    expect(result.air.count).toBe(0);
    expect(result.water.count).toBe(0);
  });
});

// ── Planetary Friendships ───────────────────────────────────────────────────

describe('Planetary Friendships', () => {
  test('natural friendships are correct', () => {
    // Sun's friends should include Moon, Mars, Jupiter
    expect(NATURAL_FRIENDSHIPS.Sun.friends).toEqual(['Moon', 'Mars', 'Jupiter']);
    expect(NATURAL_FRIENDSHIPS.Sun.neutral).toEqual(['Mercury']);
    expect(NATURAL_FRIENDSHIPS.Sun.enemies).toEqual(['Venus', 'Saturn', 'Rahu', 'Ketu']);

    // Venus
    expect(NATURAL_FRIENDSHIPS.Venus.friends).toEqual(['Mercury', 'Saturn']);
    expect(NATURAL_FRIENDSHIPS.Venus.enemies).toContain('Sun');
    expect(NATURAL_FRIENDSHIPS.Venus.enemies).toContain('Moon');

    // Rahu
    expect(NATURAL_FRIENDSHIPS.Rahu.friends).toEqual(['Mercury', 'Venus', 'Saturn']);
    expect(NATURAL_FRIENDSHIPS.Rahu.enemies).toEqual(['Sun', 'Moon', 'Mars']);
  });

  test('temporal friendships based on house positions', () => {
    // Planet in house 1, other in house 3 -> distance 2 -> temporal friend
    // Planet in house 1, other in house 6 -> distance 5 -> temporal enemy
    const planets: FriendshipInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Moon', houseNumber: 3 },    // dist 2 from Sun -> friend
      { name: 'Mars', houseNumber: 6 },    // dist 5 from Sun -> enemy
      { name: 'Jupiter', houseNumber: 12 }, // dist 11 from Sun -> friend
    ];

    const temporal = calculateTemporalFriendships(planets);

    expect(temporal.Sun.friends).toContain('Moon');
    expect(temporal.Sun.friends).toContain('Jupiter');
    expect(temporal.Sun.enemies).toContain('Mars');
  });

  test('temporal friendships — houses 2,3,4,10,11,12 are friends', () => {
    // Sun in house 5, test all 12 offsets
    const planets: FriendshipInput[] = [
      { name: 'Sun', houseNumber: 5 },
      { name: 'P2', houseNumber: 6 },   // dist 1 -> enemy (house 1 from)
      // wait, dist from 5->6 = 1, which is in enemy set {1,5,6,7,8,9}
    ];

    // Let's test with explicit positions
    const allPlanets: FriendshipInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'H2', houseNumber: 2 },   // dist 1 -> enemy
      { name: 'H3', houseNumber: 3 },   // dist 2 -> friend
      { name: 'H4', houseNumber: 4 },   // dist 3 -> friend
      { name: 'H5', houseNumber: 5 },   // dist 4 -> friend
      { name: 'H6', houseNumber: 11 },  // dist 10 -> friend
      { name: 'H7', houseNumber: 12 },  // dist 11 -> friend
      { name: 'H8', houseNumber: 7 },   // dist 6 -> enemy
    ];

    const temporal = calculateTemporalFriendships(allPlanets);

    // From Sun in house 1:
    // H2 (house 2, dist 1) -> enemy
    expect(temporal.Sun.enemies).toContain('H2');
    // H3 (house 3, dist 2) -> friend
    expect(temporal.Sun.friends).toContain('H3');
    // H4 (house 4, dist 3) -> friend
    expect(temporal.Sun.friends).toContain('H4');
    // H5 (house 5, dist 4) -> friend
    expect(temporal.Sun.friends).toContain('H5');
    // H6 (house 11, dist 10) -> friend
    expect(temporal.Sun.friends).toContain('H6');
    // H7 (house 12, dist 11) -> friend
    expect(temporal.Sun.friends).toContain('H7');
    // H8 (house 7, dist 6) -> enemy
    expect(temporal.Sun.enemies).toContain('H8');
  });

  test('compound friendships combine correctly', () => {
    const planets: FriendshipInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Moon', houseNumber: 3 },    // dist 2 -> temporal friend; natural friend -> bestFriend
      { name: 'Venus', houseNumber: 6 },   // dist 5 -> temporal enemy; natural enemy -> bitterEnemy
      { name: 'Mercury', houseNumber: 12 }, // dist 11 -> temporal friend; natural neutral -> friend
      { name: 'Saturn', houseNumber: 7 },  // dist 6 -> temporal enemy; natural enemy -> bitterEnemy
    ];

    const result = calculateFriendships(planets);

    // Sun + Moon: natural friend + temporal friend = bestFriend
    expect(result.compound.Sun.bestFriend).toContain('Moon');
    // Sun + Venus: natural enemy + temporal enemy = bitterEnemy
    expect(result.compound.Sun.bitterEnemy).toContain('Venus');
    // Sun + Mercury: natural neutral + temporal friend = friend
    expect(result.compound.Sun.friend).toContain('Mercury');
    // Sun + Saturn: natural enemy + temporal enemy = bitterEnemy
    expect(result.compound.Sun.bitterEnemy).toContain('Saturn');
  });

  test('compound: natural friend + temporal enemy = neutral', () => {
    const planets: FriendshipInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Mars', houseNumber: 6 },  // dist 5 -> temporal enemy; natural friend -> neutral
    ];

    const result = calculateFriendships(planets);
    expect(result.compound.Sun.neutral).toContain('Mars');
  });

  test('compound: natural enemy + temporal friend = neutral', () => {
    const planets: FriendshipInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Venus', houseNumber: 3 }, // dist 2 -> temporal friend; natural enemy -> neutral
    ];

    const result = calculateFriendships(planets);
    expect(result.compound.Sun.neutral).toContain('Venus');
  });
});

// ── Planetary Aspects ───────────────────────────────────────────────────────

describe('Planetary Aspects', () => {
  test('all planets aspect 7th house', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Moon', houseNumber: 4 },
      { name: 'Mercury', houseNumber: 10 },
    ];

    const result = calculateAspects(planets);

    // Sun in 1 aspects house 7
    const sunAspects = result.aspects.filter(a => a.planet === 'Sun');
    expect(sunAspects.some(a => a.aspectsHouse === 7)).toBe(true);

    // Moon in 4 aspects house 10
    const moonAspects = result.aspects.filter(a => a.planet === 'Moon');
    expect(moonAspects.some(a => a.aspectsHouse === 10)).toBe(true);

    // Mercury in 10 aspects house 4
    const mercAspects = result.aspects.filter(a => a.planet === 'Mercury');
    expect(mercAspects.some(a => a.aspectsHouse === 4)).toBe(true);
  });

  test('Mars aspects 4th and 8th additionally', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Mars', houseNumber: 1 },
    ];

    const result = calculateAspects(planets);
    const marsAspects = result.aspects.filter(a => a.planet === 'Mars');
    const houses = marsAspects.map(a => a.aspectsHouse).sort((a, b) => a - b);

    // Mars in house 1: 4th house = 4, 7th house = 7, 8th house = 8
    expect(houses).toEqual([4, 7, 8]);
  });

  test('Jupiter aspects 5th and 9th', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Jupiter', houseNumber: 2 },
    ];

    const result = calculateAspects(planets);
    const jupAspects = result.aspects.filter(a => a.planet === 'Jupiter');
    const houses = jupAspects.map(a => a.aspectsHouse).sort((a, b) => a - b);

    // Jupiter in house 2: 5th = 6, 7th = 8, 9th = 10
    expect(houses).toEqual([6, 8, 10]);
  });

  test('Saturn aspects 3rd and 10th', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Saturn', houseNumber: 3 },
    ];

    const result = calculateAspects(planets);
    const satAspects = result.aspects.filter(a => a.planet === 'Saturn');
    const houses = satAspects.map(a => a.aspectsHouse).sort((a, b) => a - b);

    // Saturn in house 3: 3rd = 5, 7th = 9, 10th = 12
    expect(houses).toEqual([5, 9, 12]);
  });

  test('Rahu and Ketu aspect 5th, 7th, and 9th', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Rahu', houseNumber: 1 },
      { name: 'Ketu', houseNumber: 7 },
    ];

    const result = calculateAspects(planets);

    const rahuHouses = result.aspects.filter(a => a.planet === 'Rahu').map(a => a.aspectsHouse).sort((a, b) => a - b);
    // Rahu in 1: 5th = 5, 7th = 7, 9th = 9
    expect(rahuHouses).toEqual([5, 7, 9]);

    const ketuHouses = result.aspects.filter(a => a.planet === 'Ketu').map(a => a.aspectsHouse).sort((a, b) => a - b);
    // Ketu in 7: 5th = 11, 7th = 1, 9th = 3
    expect(ketuHouses).toEqual([1, 3, 11]);
  });

  test('houseAspects tracks which planets aspect each house', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Mars', houseNumber: 1 },
    ];

    const result = calculateAspects(planets);

    // Both Sun and Mars aspect house 7 (7th from 1)
    expect(result.houseAspects[7].aspectedBy).toContain('Sun');
    expect(result.houseAspects[7].aspectedBy).toContain('Mars');

    // Mars also aspects house 4 (4th from 1) and house 8 (8th from 1)
    expect(result.houseAspects[4].aspectedBy).toContain('Mars');
    expect(result.houseAspects[8].aspectedBy).toContain('Mars');
  });

  test('aspectsPlanets lists planets in the aspected house', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Sun', houseNumber: 1 },
      { name: 'Moon', houseNumber: 7 },  // Moon is in house 7, Sun's 7th aspect
    ];

    const result = calculateAspects(planets);
    const sunTo7 = result.aspects.find(a => a.planet === 'Sun' && a.aspectsHouse === 7);

    expect(sunTo7).toBeDefined();
    expect(sunTo7!.aspectsPlanets).toContain('Moon');
  });

  test('wrap-around: planet in house 10 aspects house 4 (7th)', () => {
    const planets: AspectPlanetInput[] = [
      { name: 'Venus', houseNumber: 10 },
    ];

    const result = calculateAspects(planets);
    const venusAspects = result.aspects.filter(a => a.planet === 'Venus');

    // 7th from house 10: (10-1+6)%12+1 = 15%12+1 = 4
    expect(venusAspects[0].aspectsHouse).toBe(4);
  });
});
