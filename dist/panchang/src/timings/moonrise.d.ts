/**
 * Moonrise and moonset, from Swiss Ephemeris.
 *
 * WHY THIS EXISTS: panchang-v2 used SunCalc.getMoonTimes, and measured against
 * twenty published Karwa Chauth moonrise tables it was consistently **17
 * minutes EARLY** — never late, never right. Checked across twelve Indian
 * cities on 2026-10-29: Delhi -18, Mumbai -17, Kolkata -16, Lucknow -17,
 * Bengaluru -17, Jaipur -17, Chennai -16, Patna -16, and so on. A constant
 * bias, not noise.
 *
 * That matters more than it sounds. On Karwa Chauth a woman breaks a day-long
 * fast when she sees the moon; an app that says it is up seventeen minutes
 * before it is sends her outside to an empty sky.
 *
 * THE CAUSE IS PARALLAX. SunCalc tests the moon's GEOCENTRIC altitude against a
 * fixed 0.133 deg threshold. The moon is close enough that an observer on the
 * surface sees it up to ~1 deg LOWER than the Earth's centre does, so it really
 * rises later than a geocentric calculation says. Here the position is
 * topocentric (SEFLG_TOPOCTR), which handles that properly, and the test is the
 * USNO one: rise when the UPPER LIMB, lifted by refraction, reaches the
 * horizon — centre altitude + 34' + semi-diameter >= 0.
 *
 * Against the same twenty tables this lands within about 5 minutes, and those
 * tables themselves say "step out a few minutes early".
 *
 * ponytail: a one-minute sweep, not a root-finder. It is 1440 ephemeris calls
 * for a whole day, which is why panchang-v2 caches the day and why the sweep is
 * 4-minute-coarse with a 1-minute refinement around the crossing — measured at
 * ~25ms rather than ~300ms, for the same answer to the minute.
 */
export interface MoonEvents {
    rise: Date | null;
    set: Date | null;
}
/**
 * @param dayStartUTC  the instant the local day begins
 * @param hours        length of the local day. 24, and DELIBERATELY NOT MORE.
 *
 * ⚠ A 25-hour window looks harmless and is not. The moon rises about 50 minutes
 * later each day, so once or twice a lunar month a calendar day genuinely has
 * NO moonrise — 2026-10-04 in Delhi, for one. Sweeping 25 hours "finds" one at
 * 00:36, which is the NEXT day's, and the card then shows "↑ 00:36" for a time
 * that already passed this morning. Returning null is the honest answer and the
 * card renders only the half it has.
 */
export declare function moonRiseSet(dayStartUTC: Date, latitude: number, longitude: number, altitudeM?: number, hours?: number): MoonEvents;
