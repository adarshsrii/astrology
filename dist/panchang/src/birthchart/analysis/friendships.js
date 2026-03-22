"use strict";
/**
 * Planetary Friendships — Naisargika (Natural), Tatkalika (Temporal), Panchada (Compound)
 *
 * Natural friendships are fixed. Temporal friendships depend on actual house positions.
 * Compound friendships combine the two using standard Vedic rules.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFriendships = exports.calculateCompoundFriendships = exports.calculateTemporalFriendships = exports.NATURAL_FRIENDSHIPS = void 0;
// ── Natural Friendship Table (Naisargika Maitri) ────────────────────────────
exports.NATURAL_FRIENDSHIPS = {
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
// ── Temporal Friendships (Tatkalika Maitri) ─────────────────────────────────
/**
 * Planets in houses 2, 3, 4, 10, 11, 12 from a given planet are temporal friends.
 * Planets in houses 1, 5, 6, 7, 8, 9 from a given planet are temporal enemies.
 */
function houseDistance(fromHouse, toHouse) {
    // Returns 1-12: house 1 means same house
    return ((toHouse - fromHouse + 12) % 12) || 12;
}
const TEMPORAL_FRIEND_HOUSES = new Set([2, 3, 4, 10, 11, 12]);
function calculateTemporalFriendships(planets) {
    const result = {};
    for (const planet of planets) {
        const friends = [];
        const enemies = [];
        for (const other of planets) {
            if (other.name === planet.name)
                continue;
            const dist = houseDistance(planet.houseNumber, other.houseNumber);
            if (TEMPORAL_FRIEND_HOUSES.has(dist)) {
                friends.push(other.name);
            }
            else {
                enemies.push(other.name);
            }
        }
        result[planet.name] = { friends, enemies };
    }
    return result;
}
exports.calculateTemporalFriendships = calculateTemporalFriendships;
function getNaturalStatus(planet, other) {
    const rel = exports.NATURAL_FRIENDSHIPS[planet];
    if (!rel)
        return 'neutral';
    if (rel.friends.includes(other))
        return 'friend';
    if (rel.enemies.includes(other))
        return 'enemy';
    return 'neutral';
}
function compoundCategory(natural, temporal) {
    if (natural === 'friend' && temporal === 'friend')
        return 'bestFriend';
    if (natural === 'friend' && temporal === 'enemy')
        return 'neutral';
    if (natural === 'neutral' && temporal === 'friend')
        return 'friend';
    if (natural === 'neutral' && temporal === 'enemy')
        return 'enemy';
    if (natural === 'enemy' && temporal === 'friend')
        return 'neutral';
    // natural === 'enemy' && temporal === 'enemy'
    return 'bitterEnemy';
}
function calculateCompoundFriendships(planets, temporal) {
    const result = {};
    for (const planet of planets) {
        const rel = {
            bestFriend: [],
            friend: [],
            neutral: [],
            enemy: [],
            bitterEnemy: [],
        };
        for (const other of planets) {
            if (other.name === planet.name)
                continue;
            const nat = getNaturalStatus(planet.name, other.name);
            const temp = temporal[planet.name];
            const tempStatus = temp?.friends.includes(other.name) ? 'friend' : 'enemy';
            const category = compoundCategory(nat, tempStatus);
            rel[category].push(other.name);
        }
        result[planet.name] = rel;
    }
    return result;
}
exports.calculateCompoundFriendships = calculateCompoundFriendships;
// ── Main entry point ─────────────────────────────────────────────────────────
function calculateFriendships(planets) {
    const temporal = calculateTemporalFriendships(planets);
    const compound = calculateCompoundFriendships(planets, temporal);
    // Extract natural friendships only for the planets present in the chart
    const natural = {};
    for (const planet of planets) {
        natural[planet.name] = exports.NATURAL_FRIENDSHIPS[planet.name] ?? {
            friends: [],
            neutral: [],
            enemies: [],
        };
    }
    return { natural, temporal, compound };
}
exports.calculateFriendships = calculateFriendships;
