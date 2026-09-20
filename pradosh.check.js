#!/usr/bin/env node
/**
 * Self-check for Pradosh Vrat.  node pradosh.check.js
 *
 * Runs against **dist**, not src — index.rn.js loads dist, so a fix that has
 * not been rebuilt has not shipped. That is the trap from 14 Sep, where a
 * sunrise repair sat in src for five months and never reached a phone.
 */
'use strict';
const assert = require('node:assert/strict');
const { calculateFullPanchang } = require('./dist/panchang/src/panchang-v2');

// Varanasi — where Pradosh Vrat is most observed, and a real timezone.
const LOC = { latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' };
const run = (d) => calculateFullPanchang(new Date(d + 'T12:00:00+05:30'),
  LOC.latitude, LOC.longitude, LOC.timezone);
const find = (p, n) => (p.auspiciousMuhurats || []).find((m) => m.name === n);
const mins = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

// Walk a whole lunar month so both pakshas are covered whatever today is.
let days = 0, pradoshDays = [];
for (let i = 0; i < 31; i++) {
  const d = new Date(Date.UTC(2026, 8, 20) + i * 86400000).toISOString().slice(0, 10);
  const p = run(d);
  days++;
  const pk = find(p, 'Pradosh Vrat');
  // tithi is an ARRAY — a civil day can carry two. The one that matters for
  // Pradosh is the one running at sunset, i.e. the last entry.
  const t = Array.isArray(p.tithi) ? p.tithi[p.tithi.length - 1] : p.tithi;
  if (pk) pradoshDays.push({ d, tithi: t && t.name, pk });
}

// 1 ── It appears, and it appears TWICE a month — Pradosh is observed in both
//      pakshas. One hit in 31 days means the paksha-relative numbering was
//      misread as 1–30 and Krishna Pradosh is silently missing.
assert.ok(pradoshDays.length >= 2,
  `expected Pradosh on ~2 days in a lunar month, got ${pradoshDays.length} in ${days} days`);
assert.ok(pradoshDays.length <= 3, `too many Pradosh days: ${pradoshDays.length}`);

// 2 ── THE ASSERTION WITH TEETH. It must land on TRAYODASHI and nothing else.
for (const { d, tithi } of pradoshDays) {
  assert.match(String(tithi), /Trayodashi/i,
    `Pradosh Vrat was offered on ${d}, whose tithi is "${tithi}" — it belongs only to Trayodashi`);
}

// 3 ── the window: starts exactly at sunset, runs 48 minutes.
for (const { d, pk } of pradoshDays) {
  const p = run(d);
  assert.equal(pk.startTime, p.sunset,
    `${d}: Pradosh must start at sunset (${p.sunset}), got ${pk.startTime}`);
  assert.equal(mins(pk.endTime) - mins(pk.startTime), 48,
    `${d}: Pradosh must run 2 ghatis = 48 minutes`);
}

// 4 ── it must not have displaced or duplicated the windows already on screen.
//      Godhuli and Sayahna Sandhya are different observances that also key off
//      sunset, and a user seeing three identical rows would read it as a bug.
const sample = run(pradoshDays[0].d);
for (const n of ['Godhuli Muhurat', 'Sayahna Sandhya', 'Abhijit Muhurat', 'Brahma Muhurta']) {
  assert.ok(find(sample, n), `${n} disappeared when Pradosh Vrat was added`);
}
assert.notEqual(find(sample, 'Pradosh Vrat').endTime, find(sample, 'Sayahna Sandhya').endTime,
  'Pradosh Vrat and Sayahna Sandhya ended up identical — one of them is then pointless');

// 5 ── every other day is untouched: same muhurats as before, no stray row.
const plain = run(new Date(Date.UTC(2026, 8, 20) + 2 * 86400000).toISOString().slice(0, 10));
if (!find(plain, 'Pradosh Vrat')) {
  assert.ok(find(plain, 'Sayahna Sandhya'), 'a non-Pradosh day lost its evening muhurat');
}

// ── findNextPradosh ─────────────────────────────────────────────────────────
// It does NOT scan day by day: it guesses from the tithi number and probes a
// small window, because a blind scan is up to 14 full panchang computations and
// this runs on the home screen of a budget Android.
//
// THE ASSERTION WITH TEETH: the shortcut must agree with the brute-force answer
// on EVERY start date. A guess that is off by a day silently shows the wrong
// date on screen, and nothing else in the app would ever catch it.
const { findNextPradosh } = require('./dist/panchang/src/panchang-v2');
const blind = (from) => {
  for (let i = 0; i <= 32; i++) {
    const d = new Date(from.getTime() + i * 86400000);
    const p = calculateFullPanchang(d, LOC.latitude, LOC.longitude, LOC.timezone);
    const m = (p.auspiciousMuhurats || []).find((x) => x.name === 'Pradosh Vrat');
    if (m) return { iso: d.toISOString().slice(0, 10), startTime: m.startTime, endTime: m.endTime };
  }
  return null;
};

let checked = 0;
for (let i = 0; i < 31; i++) {
  const from = new Date(Date.UTC(2026, 8, 20, 6) + i * 86400000);
  const fast = findNextPradosh(from, LOC.latitude, LOC.longitude, LOC.timezone);
  const slow = blind(from);
  assert.ok(fast, `findNextPradosh returned nothing for ${from.toISOString().slice(0, 10)}`);
  assert.equal(fast.date.toISOString().slice(0, 10), slow.iso,
    `from ${from.toISOString().slice(0, 10)}: the tithi guess landed on ${fast.date.toISOString().slice(0, 10)}, a day-by-day scan says ${slow.iso}`);
  // And the times must be READ BACK from the day's own muhurat list, not
  // recomputed — one definition of the window, not two.
  assert.equal(fast.startTime, slow.startTime);
  assert.equal(fast.endTime, slow.endTime);
  checked++;
}

// On a Pradosh day it must answer "today", not skip to the next one — the card
// would otherwise advertise a window two weeks away while one is running.
const onDay = findNextPradosh(new Date(pradoshDays[0].d + 'T06:00:00Z'),
  LOC.latitude, LOC.longitude, LOC.timezone);
assert.equal(onDay.daysAhead, 0, 'on a Pradosh day, the next Pradosh is today');

console.log(`  findNextPradosh matched a day-by-day scan on all ${checked} start dates`);
console.log(`  ${days} days scanned · Pradosh on ${pradoshDays.length}:`);
for (const { d, tithi, pk } of pradoshDays)
  console.log(`    ${d}  ${tithi}  ${pk.startTime}–${pk.endTime}`);
console.log('\npradosh self-check: all assertions passed');
