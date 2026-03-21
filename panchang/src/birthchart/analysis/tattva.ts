/**
 * Tattva (Element) Balance Analysis
 *
 * Calculates the elemental distribution of planets across the four tattvas:
 * Fire (Agni), Earth (Prithvi), Air (Vayu), Water (Jala).
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface TattvaElementInfo {
  count: number;
  planets: string[];
  percentage: number;
}

export interface TattvaBalance {
  fire: TattvaElementInfo;
  earth: TattvaElementInfo;
  air: TattvaElementInfo;
  water: TattvaElementInfo;
  dominant: string;   // "Fire", "Earth", "Air", or "Water"
  deficient: string;  // Element with least planets
}

// ── Sign-to-Element mapping (sign number 1-12) ──────────────────────────────

type TattvaName = 'Fire' | 'Earth' | 'Air' | 'Water';

const SIGN_TATTVA: Record<number, TattvaName> = {
  1: 'Fire',    // Aries
  2: 'Earth',   // Taurus
  3: 'Air',     // Gemini
  4: 'Water',   // Cancer
  5: 'Fire',    // Leo
  6: 'Earth',   // Virgo
  7: 'Air',     // Libra
  8: 'Water',   // Scorpio
  9: 'Fire',    // Sagittarius
  10: 'Earth',  // Capricorn
  11: 'Air',    // Aquarius
  12: 'Water',  // Pisces
};

// ── Input type ───────────────────────────────────────────────────────────────

export interface TattvaInput {
  name: string;       // planet name or "Lagna"
  signNumber: number; // 1-12
}

// ── Calculator ───────────────────────────────────────────────────────────────

export function calculateTattvaBalance(placements: TattvaInput[]): TattvaBalance {
  const buckets: Record<TattvaName, string[]> = {
    Fire: [],
    Earth: [],
    Air: [],
    Water: [],
  };

  for (const p of placements) {
    const tattva = SIGN_TATTVA[p.signNumber];
    if (tattva) {
      buckets[tattva].push(p.name);
    }
  }

  const total = placements.length || 1; // avoid division by zero

  const toInfo = (planets: string[]): TattvaElementInfo => ({
    count: planets.length,
    planets,
    percentage: Math.round((planets.length / total) * 100),
  });

  const elements: { name: TattvaName; count: number }[] = [
    { name: 'Fire', count: buckets.Fire.length },
    { name: 'Earth', count: buckets.Earth.length },
    { name: 'Air', count: buckets.Air.length },
    { name: 'Water', count: buckets.Water.length },
  ];

  // Sort descending by count; ties broken by declaration order
  const sorted = [...elements].sort((a, b) => b.count - a.count);
  const dominant = sorted[0].name;
  const deficient = sorted[sorted.length - 1].name;

  return {
    fire: toInfo(buckets.Fire),
    earth: toInfo(buckets.Earth),
    air: toInfo(buckets.Air),
    water: toInfo(buckets.Water),
    dominant,
    deficient,
  };
}
