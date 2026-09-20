#!/usr/bin/env node
/**
 * Self-check for moonrise / moonset.  node moonrise.check.js
 *
 * Runs against **dist**, because that is what the app loads.
 *
 * WHY THIS IS PINNED AT ALL: panchang-v2 used SunCalc.getMoonTimes, which tests
 * the moon's GEOCENTRIC altitude. The moon is close enough that an observer on
 * the surface sees it up to a degree lower, so it really rises later — and the
 * app was telling people it was up 17 minutes before it was. The people who
 * care most are Karwa Chauth fasters, who break a day-long fast on first sight
 * of the moon.
 *
 * The reference times below are the published Karwa Chauth 2026 moonrise tables
 * for 29 October. They are not gospel — the sites themselves say "step out a
 * few minutes early" — so the tolerance is deliberately loose. It is tight
 * enough to fail the geocentric calculation and nothing else.
 */
'use strict';
const assert = require('node:assert/strict');
const { calculateFullPanchang } = require('./dist/panchang/src/panchang-v2');

const KARWA_CHAUTH = '2026-10-29';
const CITIES = [
  ['New Delhi',  28.6139, 77.2090, '20:18'],
  ['Mumbai',     19.0760, 72.8777, '21:02'],
  ['Kolkata',    22.5726, 88.3639, '19:48'],
  ['Lucknow',    26.8467, 80.9462, '20:08'],
  ['Bengaluru',  12.9716, 77.5946, '20:57'],
  ['Jaipur',     26.9124, 75.7873, '20:29'],
  ['Chennai',    13.0827, 80.2707, '20:45'],
  ['Patna',      25.5941, 85.1376, '19:53'],
  ['Ahmedabad',  23.0225, 72.5714, '20:53'],
  ['Chandigarh', 30.7333, 76.7794, '20:14'],
];
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const run = (iso, lat, lon) =>
  calculateFullPanchang(new Date(iso + 'T12:00:00+05:30'), lat, lon, 'Asia/Kolkata');

const errs = [];
for (const [name, lat, lon, published] of CITIES) {
  const p = run(KARWA_CHAUTH, lat, lon);
  assert.match(p.moonrise, /^\d{2}:\d{2}$/, `${name}: no moonrise at all`);
  const d = mins(p.moonrise) - mins(published);
  errs.push(d);

  // THE ASSERTION WITH TEETH. The geocentric answer sits at -16..-18 in every
  // one of these cities, so a 10-minute band fails it everywhere while leaving
  // room for the disagreement between published tables.
  assert.ok(Math.abs(d) <= 10,
    `${name}: moonrise ${p.moonrise} vs published ${published} (${d} min). ` +
    `A flat -17 here means the topocentric parallax correction is gone and the ` +
    `moon is being reported before it is visible.`);

  // Early is the dangerous direction: a faster goes out and sees nothing.
  assert.ok(d >= -10, `${name}: ${d} min EARLY — worse than showing nothing`);
}
const median = [...errs].sort((a, b) => a - b)[Math.floor(errs.length / 2)];
assert.ok(Math.abs(median) <= 8, `median error ${median} min across ${errs.length} cities`);

// ── the answer must not depend on where the PHONE is ────────────────────────
// SunCalc.getMoonTimes built its day window from the machine's local midnight,
// so the same place viewed from another timezone could return a different day's
// moon entirely. The sweep now starts at local midnight of the target zone.
const here = run(KARWA_CHAUTH, 28.6139, 77.2090).moonrise;
const wasTZ = process.env.TZ;
for (const tz of ['America/New_York', 'Pacific/Auckland', 'UTC']) {
  process.env.TZ = tz;
  delete require.cache[require.resolve('./dist/panchang/src/panchang-v2')];
  const { calculateFullPanchang: f } = require('./dist/panchang/src/panchang-v2');
  const there = f(new Date(KARWA_CHAUTH + 'T12:00:00+05:30'), 28.6139, 77.2090, 'Asia/Kolkata').moonrise;
  assert.equal(there, here, `Delhi's moonrise changed to ${there} when the phone moved to ${tz}`);
}
if (wasTZ) process.env.TZ = wasTZ; else delete process.env.TZ;

// ── A DAY WITH NO MOONRISE MUST SAY SO, NOT BORROW TOMORROW'S ───────────────
// The moon rises ~50 min later each day, so once or twice a lunar month a
// calendar day has no moonrise at all. Sweeping past local midnight "finds" the
// next day's — 2026-10-04 in Delhi returns 00:36 that way — and the card then
// shows a time that already passed this morning. Null is the honest answer.
{
  const gaps = [];
  for (let i = 0; i < 32; i++) {
    const iso = new Date(Date.UTC(2026, 8, 20) + i * 86400000).toISOString().slice(0, 10);
    const p = run(iso, 28.6139, 77.2090);
    if (!p.moonrise || !p.moonset) gaps.push(iso);
    // Whatever IS returned must be a real time, never a placeholder.
    if (p.moonrise) assert.match(p.moonrise, /^\d{2}:\d{2}$/, `${iso}: bad moonrise`);
    if (p.moonset) assert.match(p.moonset, /^\d{2}:\d{2}$/, `${iso}: bad moonset`);
  }
  assert.ok(gaps.length >= 2 && gaps.length <= 5,
    `expected 2-4 days in 32 with no rise or no set, got ${gaps.length} (${gaps}). ` +
    `Zero means the sweep is running past local midnight and reporting the next ` +
    `day's event as today's.`);
  assert.equal(run('2026-10-04', 28.6139, 77.2090).moonrise, '',
    "2026-10-04 in Delhi has no moonrise — it must not borrow 2026-10-05's 00:36");
  console.log(`  ${gaps.length} days in 32 correctly report no rise / no set: ${gaps.join(', ')}`);
}

// ── moonset still comes back, and the two are not the same instant ──────────
const delhi = run(KARWA_CHAUTH, 28.6139, 77.2090);
assert.match(delhi.moonset, /^\d{2}:\d{2}$/, 'moonset disappeared');
assert.notEqual(delhi.moonrise, delhi.moonset);

// ── a full moon rises about at sunset; a new moon does not ──────────────────
// Cheap sanity that the sweep is finding the right crossing rather than any
// crossing: on Purnima the moon is opposite the sun.
for (let i = 0; i < 40; i++) {
  const iso = new Date(Date.UTC(2026, 9, 1) + i * 86400000).toISOString().slice(0, 10);
  const p = run(iso, 28.6139, 77.2090);
  const t = (p.tithi || []).map((x) => x.name).join();
  if (/Purnima/.test(t) && p.moonrise && p.sunset) {
    const gap = Math.abs(mins(p.moonrise) - mins(p.sunset));
    assert.ok(gap <= 75,
      `on Purnima (${iso}) moonrise ${p.moonrise} should be near sunset ${p.sunset}, off by ${gap} min`);
    console.log(`  Purnima ${iso}: moonrise ${p.moonrise} vs sunset ${p.sunset} (${gap} min apart)`);
    break;
  }
}

console.log(`  Karwa Chauth 2026, ${CITIES.length} cities: median ${median} min vs published`);
console.log(`  (the geocentric calculation this replaced was a flat -17)`);
console.log('  moonrise is identical from New York, Auckland and UTC');
console.log('\nmoonrise self-check: all assertions passed');
