/**
 * Rashi (sign) lordship — THE single source of truth.
 *
 * This table used to live privately in two places that could drift apart:
 * SIGN_LORD in analysis/yogas.ts and RASHI_LORD in analysis/ashtakoot.ts.
 * Both now import from here; do not re-declare it anywhere else.
 */
import { Dignity, GrahaName, GrahaPosition, HouseInfo } from '../types';
/** Sign number (1 = Aries) → ruling graha. */
export declare const SIGN_LORDS: Record<number, GrahaName>;
/**
 * Lord of a sign. Accepts any integer and wraps it to 1-12, so callers doing
 * their own "+6 signs from here" arithmetic cannot hand us a 13 and get undefined.
 *
 * ponytail: classical (Parashari) lordship only — Rahu/Ketu are co-lords of
 * Aquarius/Scorpio in some schools and that is a content decision, not a fix.
 */
export declare function getSignLord(signNumber: number): GrahaName;
export interface HouseLordInfo {
    house: number;
    signName: string;
    signNumber: number;
    lord: GrahaName;
    /** Where the lord actually sits. null only if the lord is absent from `planets`. */
    lordHouse: number | null;
    lordSignName: string | null;
    lordSignNumber: number | null;
    lordDegreeInSign: number | null;
    lordDignity: Dignity | null;
    lordRetrograde: boolean | null;
    lordCombust: boolean | null;
}
/**
 * For each of the 12 houses: its sign, its lord, and where that lord is placed
 * (house, sign, degree, dignity, retrograde, combust).
 *
 * This is the backbone of house-by-house prediction: "the 10th lord sits in the
 * 6th, debilitated and combust" is the sentence every kundli report is built on.
 *
 * @param houses  the 12 houses from calculateHouses()
 * @param planets the 9 grahas from calculateAllPlanets()
 */
export declare function getHouseLords(houses: HouseInfo[], planets: GrahaPosition[]): HouseLordInfo[];
/** Sign name for a sign number, wrapping 1-12 (convenience for report code). */
export declare function getSignName(signNumber: number): string;
