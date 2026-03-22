/**
 * Planetary Friendships — Naisargika (Natural), Tatkalika (Temporal), Panchada (Compound)
 *
 * Natural friendships are fixed. Temporal friendships depend on actual house positions.
 * Compound friendships combine the two using standard Vedic rules.
 */
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
export declare const NATURAL_FRIENDSHIPS: Record<string, NaturalRelation>;
export interface FriendshipInput {
    name: string;
    houseNumber: number;
}
export declare function calculateTemporalFriendships(planets: FriendshipInput[]): Record<string, TemporalRelation>;
export declare function calculateCompoundFriendships(planets: FriendshipInput[], temporal: Record<string, TemporalRelation>): Record<string, CompoundRelation>;
export declare function calculateFriendships(planets: FriendshipInput[]): PlanetaryFriendships;
