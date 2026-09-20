import { Lang } from './core/constants';
import { PanchangResult } from './types';
export declare function calculateFullPanchang(date: Date | string, latitude: number, longitude: number, timezone: string, lang?: Lang): PanchangResult;
/**
 * The next Pradosh Vrat on or after `from`, or null if none inside `maxDays`.
 *
 * ⚠ IT READS THE WINDOW BACK OUT OF calculateFullPanchang RATHER THAN
 * RECOMPUTING IT. There is exactly one definition of the window — the push
 * site in timings/muhurat.ts — so the "next Pradosh" line on the home screen
 * can never disagree with the row that appears on the day itself. Recomputing
 * sunset + 48 here would be the second definition, and this repo already has a
 * live example of that going wrong (sayahnaSandhya is sunset+72min in
 * timings/muhurat.ts and sunset±12min in panchang/index.ts).
 *
 * COST, MEASURED NOT GUESSED: calculateFullPanchang is ~23ms on a laptop, so a
 * blind day-by-day scan averages ~7 calls and worst-cases at 15. On a budget
 * Android that is seconds of blocked JS. So the tithi number gives a first
 * guess — tithis advance about one a day — and only a small window around it is
 * actually computed. The linear sweep stays as a fallback because tithi length
 * runs 19–26h and the guess can legitimately be a day or two out.
 */
export declare function findNextPradosh(from: Date, latitude: number, longitude: number, timezone: string, maxDays?: number): {
    date: Date;
    startTime: string;
    endTime: string;
    daysAhead: number;
} | null;
