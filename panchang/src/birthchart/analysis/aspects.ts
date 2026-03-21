/**
 * Vedic Planetary Aspects (Graha Drishti)
 *
 * Every planet fully aspects the 7th house from its position.
 * Mars, Jupiter, Saturn, Rahu, and Ketu have additional special aspects.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface PlanetaryAspect {
  planet: string;
  aspectsHouse: number;      // House number being aspected (1-12)
  aspectsPlanets: string[];   // Planets in that house
  aspectType: 'full' | 'three_quarter' | 'half' | 'quarter';
  strength: number;           // 100, 75, 50, 25
}

export interface AspectResult {
  aspects: PlanetaryAspect[];
  houseAspects: Record<number, { aspectedBy: string[] }>;
}

// ── Input types ──────────────────────────────────────────────────────────────

export interface AspectPlanetInput {
  name: string;
  houseNumber: number; // 1-12
}

// ── Aspect rules ─────────────────────────────────────────────────────────────

/**
 * Returns the Vedic house numbers (counted from the planet's house as 1)
 * that a planet aspects, with strength.
 * "7th house" means counting the planet's own house as 1.
 */
function getAspectedHouseNumbers(planetName: string): { nthHouse: number; type: PlanetaryAspect['aspectType']; strength: number }[] {
  // All planets aspect the 7th house from their position
  const aspects: { nthHouse: number; type: PlanetaryAspect['aspectType']; strength: number }[] = [
    { nthHouse: 7, type: 'full', strength: 100 },
  ];

  switch (planetName) {
    case 'Mars':
      aspects.push(
        { nthHouse: 4, type: 'full', strength: 100 },
        { nthHouse: 8, type: 'full', strength: 100 },
      );
      break;
    case 'Jupiter':
      aspects.push(
        { nthHouse: 5, type: 'full', strength: 100 },
        { nthHouse: 9, type: 'full', strength: 100 },
      );
      break;
    case 'Saturn':
      aspects.push(
        { nthHouse: 3, type: 'full', strength: 100 },
        { nthHouse: 10, type: 'full', strength: 100 },
      );
      break;
    case 'Rahu':
    case 'Ketu':
      aspects.push(
        { nthHouse: 5, type: 'full', strength: 100 },
        { nthHouse: 9, type: 'full', strength: 100 },
      );
      break;
  }

  return aspects;
}

/**
 * Given a base house and an nth-house count (Vedic style, where 1 = own house),
 * return the absolute house number (1-12).
 * E.g., nthHouse=7 from baseHouse=1 => house 7; nthHouse=7 from baseHouse=8 => house 2.
 */
function resolveHouse(baseHouse: number, nthHouse: number): number {
  return ((baseHouse - 1 + (nthHouse - 1)) % 12) + 1;
}

// ── Calculator ───────────────────────────────────────────────────────────────

export function calculateAspects(planets: AspectPlanetInput[]): AspectResult {
  // Build a map of house -> planets in that house
  const housePlanets: Record<number, string[]> = {};
  for (let h = 1; h <= 12; h++) {
    housePlanets[h] = [];
  }
  for (const p of planets) {
    housePlanets[p.houseNumber]?.push(p.name);
  }

  const aspects: PlanetaryAspect[] = [];
  const houseAspects: Record<number, { aspectedBy: string[] }> = {};
  for (let h = 1; h <= 12; h++) {
    houseAspects[h] = { aspectedBy: [] };
  }

  for (const planet of planets) {
    const aspectRules = getAspectedHouseNumbers(planet.name);

    for (const { nthHouse, type, strength } of aspectRules) {
      const target = resolveHouse(planet.houseNumber, nthHouse);
      const planetsInTarget = housePlanets[target] ?? [];

      aspects.push({
        planet: planet.name,
        aspectsHouse: target,
        aspectsPlanets: [...planetsInTarget],
        aspectType: type,
        strength,
      });

      houseAspects[target].aspectedBy.push(planet.name);
    }
  }

  return { aspects, houseAspects };
}
