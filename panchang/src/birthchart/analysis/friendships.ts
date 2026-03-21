/**
 * Planetary Friendships — Naisargika (Natural), Tatkalika (Temporal), Panchada (Compound)
 *
 * Natural friendships are fixed. Temporal friendships depend on actual house positions.
 * Compound friendships combine the two using standard Vedic rules.
 */

// ── Types ────────────────────────────────────────────────────────────────────

export interface NaturalRelation {
  friends: string[];
  neutral: string[];
  enemies: string[];
}

export interface TemporalRelation {
  friends: string[];
  enemies: string[];
}

export interface CompoundRelation {
  bestFriend: string[];
  friend: string[];
  neutral: string[];
  enemy: string[];
  bitterEnemy: string[];
}

export interface PlanetaryFriendships {
  natural: Record<string, NaturalRelation>;
  temporal: Record<string, TemporalRelation>;
  compound: Record<string, CompoundRelation>;
}

// ── Natural Friendship Table (Naisargika Maitri) ────────────────────────────

export const NATURAL_FRIENDSHIPS: Record<string, NaturalRelation> = {
  Sun: {
    friends: ['Moon', 'Mars', 'Jupiter'],
    neutral: ['Mercury'],
    enemies: ['Venus', 'Saturn', 'Rahu', 'Ketu'],
  },
  Moon: {
    friends: ['Sun', 'Mercury'],
    neutral: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
    enemies: ['Rahu', 'Ketu'],
  },
  Mars: {
    friends: ['Sun', 'Moon', 'Jupiter'],
    neutral: ['Venus', 'Saturn'],
    enemies: ['Mercury', 'Rahu', 'Ketu'],
  },
  Mercury: {
    friends: ['Sun', 'Venus'],
    neutral: ['Mars', 'Jupiter', 'Saturn'],
    enemies: ['Moon', 'Rahu', 'Ketu'],
  },
  Jupiter: {
    friends: ['Sun', 'Moon', 'Mars'],
    neutral: ['Saturn'],
    enemies: ['Mercury', 'Venus', 'Rahu', 'Ketu'],
  },
  Venus: {
    friends: ['Mercury', 'Saturn'],
    neutral: ['Mars', 'Jupiter'],
    enemies: ['Sun', 'Moon', 'Rahu', 'Ketu'],
  },
  Saturn: {
    friends: ['Mercury', 'Venus'],
    neutral: ['Jupiter'],
    enemies: ['Sun', 'Moon', 'Mars', 'Rahu', 'Ketu'],
  },
  Rahu: {
    friends: ['Mercury', 'Venus', 'Saturn'],
    neutral: ['Jupiter'],
    enemies: ['Sun', 'Moon', 'Mars'],
  },
  Ketu: {
    friends: ['Mars', 'Venus', 'Saturn'],
    neutral: ['Mercury', 'Jupiter'],
    enemies: ['Sun', 'Moon'],
  },
};

// ── Input type ───────────────────────────────────────────────────────────────

export interface FriendshipInput {
  name: string;        // planet name
  houseNumber: number; // 1-12
}

// ── Temporal Friendships (Tatkalika Maitri) ─────────────────────────────────

/**
 * Planets in houses 2, 3, 4, 10, 11, 12 from a given planet are temporal friends.
 * Planets in houses 1, 5, 6, 7, 8, 9 from a given planet are temporal enemies.
 */
function houseDistance(fromHouse: number, toHouse: number): number {
  // Returns 1-12: house 1 means same house
  return ((toHouse - fromHouse + 12) % 12) || 12;
}

const TEMPORAL_FRIEND_HOUSES = new Set([2, 3, 4, 10, 11, 12]);

export function calculateTemporalFriendships(
  planets: FriendshipInput[],
): Record<string, TemporalRelation> {
  const result: Record<string, TemporalRelation> = {};

  for (const planet of planets) {
    const friends: string[] = [];
    const enemies: string[] = [];

    for (const other of planets) {
      if (other.name === planet.name) continue;
      const dist = houseDistance(planet.houseNumber, other.houseNumber);
      if (TEMPORAL_FRIEND_HOUSES.has(dist)) {
        friends.push(other.name);
      } else {
        enemies.push(other.name);
      }
    }

    result[planet.name] = { friends, enemies };
  }

  return result;
}

// ── Compound Friendships (Panchada Maitri) ──────────────────────────────────

type NaturalStatus = 'friend' | 'neutral' | 'enemy';
type TemporalStatus = 'friend' | 'enemy';

function getNaturalStatus(planet: string, other: string): NaturalStatus {
  const rel = NATURAL_FRIENDSHIPS[planet];
  if (!rel) return 'neutral';
  if (rel.friends.includes(other)) return 'friend';
  if (rel.enemies.includes(other)) return 'enemy';
  return 'neutral';
}

type CompoundCategory = 'bestFriend' | 'friend' | 'neutral' | 'enemy' | 'bitterEnemy';

function compoundCategory(natural: NaturalStatus, temporal: TemporalStatus): CompoundCategory {
  if (natural === 'friend' && temporal === 'friend') return 'bestFriend';
  if (natural === 'friend' && temporal === 'enemy') return 'neutral';
  if (natural === 'neutral' && temporal === 'friend') return 'friend';
  if (natural === 'neutral' && temporal === 'enemy') return 'enemy';
  if (natural === 'enemy' && temporal === 'friend') return 'neutral';
  // natural === 'enemy' && temporal === 'enemy'
  return 'bitterEnemy';
}

export function calculateCompoundFriendships(
  planets: FriendshipInput[],
  temporal: Record<string, TemporalRelation>,
): Record<string, CompoundRelation> {
  const result: Record<string, CompoundRelation> = {};

  for (const planet of planets) {
    const rel: CompoundRelation = {
      bestFriend: [],
      friend: [],
      neutral: [],
      enemy: [],
      bitterEnemy: [],
    };

    for (const other of planets) {
      if (other.name === planet.name) continue;

      const nat = getNaturalStatus(planet.name, other.name);
      const temp = temporal[planet.name];
      const tempStatus: TemporalStatus = temp?.friends.includes(other.name) ? 'friend' : 'enemy';
      const category = compoundCategory(nat, tempStatus);
      rel[category].push(other.name);
    }

    result[planet.name] = rel;
  }

  return result;
}

// ── Main entry point ─────────────────────────────────────────────────────────

export function calculateFriendships(planets: FriendshipInput[]): PlanetaryFriendships {
  const temporal = calculateTemporalFriendships(planets);
  const compound = calculateCompoundFriendships(planets, temporal);

  // Extract natural friendships only for the planets present in the chart
  const natural: Record<string, NaturalRelation> = {};
  for (const planet of planets) {
    natural[planet.name] = NATURAL_FRIENDSHIPS[planet.name] ?? {
      friends: [],
      neutral: [],
      enemies: [],
    };
  }

  return { natural, temporal, compound };
}
