// Choghadiya is built from clock times, so it must not depend on the machine's own
// timezone. It used to: `new Date("2026-09-04T05:59:00")` was read in the system zone
// and setZone then moved the instant, so the same sunrise gave a different Choghadiya
// on a phone in Nepal (right), India (+15 min) and the US (+9h45m). A jatak in Nepal
// spotted it when his printed patro said Kaal and the app said Labh.
//
// NOTE: the zone matrix runs in CHILD PROCESSES on purpose. Node reads TZ once at
// startup, so setting process.env.TZ inside a running test changes nothing and a
// same-process matrix passes even against the bug.
import { execFileSync } from 'child_process';
import * as path from 'path';

const calculateChoghadiya = require('../lib/chaughadiya');

const DATE = '2026-09-04';        // a Friday in Kathmandu
const SUNRISE = '05:59:00';
const SUNSET = '18:24:00';
const ZONE = 'Asia/Kathmandu';

// Real device zones we actually see: Nepal, and Nepalis living abroad.
const SYSTEM_ZONES = ['Asia/Kathmandu', 'Asia/Calcutta', 'America/New_York', 'Australia/Perth', 'Asia/Riyadh', 'UTC'];

const runIn = (tz: string): string => execFileSync(
  process.execPath,
  ['-e', `process.stdout.write(JSON.stringify(require(${JSON.stringify(path.resolve(__dirname, '../lib/chaughadiya'))})(${JSON.stringify(DATE)},${JSON.stringify(SUNRISE)},${JSON.stringify(SUNSET)},${JSON.stringify(ZONE)})))`],
  { env: { ...process.env, TZ: tz }, encoding: 'utf8' },
);

describe('choghadiya is independent of the machine timezone', () => {
  // Teeth: fails on the old code whenever the machine zone is not Asia/Kathmandu.
  it('starts the day and the night at the times it was given', () => {
    const r = calculateChoghadiya(DATE, SUNRISE, SUNSET, ZONE);
    expect(r.daytimeChoghadiyas[0].start).toBe(SUNRISE);
    expect(r.nighttimeChoghadiyas[0].start).toBe(SUNSET);
  });

  // Teeth: fails on the old code unconditionally, whatever the machine zone is.
  it('gives identical output from every device timezone', () => {
    const results = SYSTEM_ZONES.map(runIn);
    expect(new Set(results).size).toBe(1);
    expect(JSON.parse(results[0]).daytimeChoghadiyas[0].start).toBe(SUNRISE);
  });

  it('takes the weekday from the given zone, not the machine', () => {
    // Friday in Kathmandu; Friday's first day slot is Char.
    const r = JSON.parse(runIn('America/New_York'));
    expect(r.daytimeChoghadiyas[0].type).toBe('Char');
  });
});
