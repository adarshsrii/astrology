/**
 * Guard for the Sep-2026 "unreachable engine capability" audit. Everything here
 * is loaded through ./index.rn.js — the RN entry point the PHONE actually uses,
 * which requires dist/, not the TypeScript source. That is the whole point: a
 * change that lives only in panchang/src and was never rebuilt into dist/ ships
 * to nobody, and a check that imported the .ts would happily pass anyway.
 *
 * Covers:
 *  1. House LORDSHIP is exported and correct (sign -> lord -> where the lord sits).
 *  2. Exactly ONE sign-lord table survives in dist (it used to be two private copies).
 *  3. Sudarshana Chakra reads the same chart from Lagna, Moon and Sun.
 *  4. PLANET_DIRECTIONS is reachable for ARBITRARY planets, not just weak ones.
 *  5. getVargaDignity can finally return 'friendly'/'enemy' — the FR/EN marks in
 *     the report's dignity map were unreachable, so every such cell scored 5.
 *
 * ponytail: plain asserts, no framework. Run: node house-lords-sudarshana.check.js
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ai = require('./index.rn.js');

// Reference chart: 1992-05-03 22:05, 25.99N 79.45E, Asia/Kolkata.
// Sagittarius lagna 4.26 deg. Same chart the varga-node audit used.
const BIRTH = { date: '1992-05-03', time: '22:05', latitude: 25.99, longitude: 79.45, timezone: 'Asia/Kolkata' };

// ── 0. every new capability is reachable THROUGH index.rn.js ────────────────
for (const name of [
  'SIGN_LORDS', 'getSignLord', 'getSignName', 'getHouseLords',
  'calculateHouses', 'assignPlanetsToHouses', 'populateHousePlanets',
  'calculateSudarshanaChakra',
  'PLANET_DIRECTIONS', 'getPlanetDirection', 'getPlanetRemedy',
]) {
  assert.ok(
    ai[name] !== undefined,
    `index.rn.js does not export ${name} — the app cannot see it. ` +
    `Export it from index.rn.js AND rebuild dist/ (npm run build's file list does not cover birthchart).`,
  );
}
console.log('ok  all 11 new/exposed symbols are reachable through index.rn.js');

// ── 1. the lord table itself ────────────────────────────────────────────────
assert.deepStrictEqual(
  Array.from({ length: 12 }, (_, i) => ai.getSignLord(i + 1)),
  ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'],
  'classical Parashari sign lordship is wrong',
);
// Callers do their own "+6 signs from here" arithmetic; 13 must not be undefined.
assert.strictEqual(ai.getSignLord(13), 'Mars', 'getSignLord must wrap out-of-range sign numbers');
assert.strictEqual(ai.getSignLord(0), 'Jupiter', 'getSignLord must wrap out-of-range sign numbers');
console.log('ok  SIGN_LORDS / getSignLord correct for all 12 signs and wraps out of range');

// ── 2. ONE table, not two ───────────────────────────────────────────────────
// The reason this module exists: yogas.ts and ashtakoot.ts each carried a private
// copy. A third copy anywhere in dist is the drift starting over.
const distFiles = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.name.endsWith('.js') && !e.name.includes('.bak')) distFiles.push(full);
  }
})('./dist/panchang/src');
// A copy of the table is 12 CONSECUTIVE string literals in lordship order.
// Consecutive on purpose: the nakshatra table in core/constants.js also lists
// these planet names, but interleaved with deity strings, so it is not a match.
const ORDER = ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'];
const hasLordTable = (src) => {
  const strs = [...src.matchAll(/'([^']*)'|"([^"]*)"/g)].map(m => (m[1] !== undefined ? m[1] : m[2]));
  return strs.some((_, i) => ORDER.every((want, k) => strs[i + k] === want));
};
const copies = distFiles.filter(f => hasLordTable(fs.readFileSync(f, 'utf8')));
assert.deepStrictEqual(
  copies.map(f => path.basename(f)).sort(), ['lords.js'],
  `the sign-lord table is duplicated in dist: ${copies.join(', ')}. ` +
  `It belongs in core/lords.ts only — two copies is how yogas.ts and ashtakoot.ts drifted.`,
);
console.log('ok  exactly one sign-lord table in dist (core/lords.js)');

// ── 3. per-house lordship on a known chart ──────────────────────────────────
const chart = ai.calculateBirthChart(BIRTH);
assert.strictEqual(chart.lagna.signName, 'Sagittarius', 'reference chart moved — recheck the fixture below');
const lords = ai.getHouseLords(chart.houses, chart.planets);
assert.strictEqual(lords.length, 12);

// house -> [sign, lord, lord's house, lord's sign, dignity]
const EXPECTED = [
  [1,  'Sagittarius', 'Jupiter',  9, 'Leo',       'neutral'],
  [2,  'Capricorn',   'Saturn',   2, 'Capricorn', 'own_sign'],
  [3,  'Aquarius',    'Saturn',   2, 'Capricorn', 'own_sign'],
  [4,  'Pisces',      'Jupiter',  9, 'Leo',       'neutral'],
  [5,  'Aries',       'Mars',     4, 'Pisces',    'neutral'],
  [6,  'Taurus',      'Venus',    5, 'Aries',     'neutral'],
  [7,  'Gemini',      'Mercury',  4, 'Pisces',    'debilitated'],
  [8,  'Cancer',      'Moon',     6, 'Taurus',    'exalted'],
  [9,  'Leo',         'Sun',      5, 'Aries',     'exalted'],
  [10, 'Virgo',       'Mercury',  4, 'Pisces',    'debilitated'],
  [11, 'Libra',       'Venus',    5, 'Aries',     'neutral'],
  [12, 'Scorpio',     'Mars',     4, 'Pisces',    'neutral'],
];
for (const [house, sign, lord, lordHouse, lordSign, dignity] of EXPECTED) {
  const row = lords.find(l => l.house === house);
  assert.strictEqual(row.signName, sign, `house ${house} sign`);
  assert.strictEqual(row.lord, lord, `house ${house} lord`);
  assert.strictEqual(row.lordHouse, lordHouse, `house ${house}: ${lord} should sit in house ${lordHouse}`);
  assert.strictEqual(row.lordSignName, lordSign, `house ${house}: ${lord}'s sign`);
  assert.strictEqual(row.lordDignity, dignity, `house ${house}: ${lord}'s dignity`);
  assert.strictEqual(typeof row.lordRetrograde, 'boolean', `house ${house}: retrograde flag missing`);
  assert.strictEqual(typeof row.lordCombust, 'boolean', `house ${house}: combust flag missing`);
  assert.ok(row.lordDegreeInSign >= 0 && row.lordDegreeInSign < 30, `house ${house}: lord degree out of range`);
}
// Independent cross-check of the placement arithmetic, from the planet's sign.
for (const row of lords) {
  const expected = ((row.lordSignNumber - chart.lagna.signNumber + 12) % 12) + 1;
  assert.strictEqual(row.lordHouse, expected, `house ${row.house}: ${row.lord}'s house disagrees with whole-sign arithmetic`);
}
console.log('ok  all 12 house lords, their placements and their dignities are correct');

// ── 4. Sudarshana Chakra ────────────────────────────────────────────────────
const sudarshana = ai.calculateSudarshanaChakra(chart.planets, chart.lagna.signNumber);
assert.deepStrictEqual(Object.keys(sudarshana).sort(), ['lagna', 'moon', 'sun']);
const moonSign = chart.planets.find(p => p.name === 'Moon').signNumber;
const sunSign = chart.planets.find(p => p.name === 'Sun').signNumber;
assert.strictEqual(sudarshana.lagna.referenceSignNumber, chart.lagna.signNumber);
assert.strictEqual(sudarshana.moon.referenceSignNumber, moonSign, 'moon view must be counted from the Moon SIGN');
assert.strictEqual(sudarshana.sun.referenceSignNumber, sunSign, 'sun view must be counted from the Sun SIGN');
// The defining property: the reference body sits in the 1st house of its own view.
assert.ok(sudarshana.moon.houses[0].planets.includes('Moon'), 'Moon must be in the 1st house of the Chandra lagna view');
assert.ok(sudarshana.sun.houses[0].planets.includes('Sun'), 'Sun must be in the 1st house of the Surya lagna view');
for (const key of ['lagna', 'moon', 'sun']) {
  const view = sudarshana[key];
  assert.strictEqual(view.houses.length, 12, `${key} view must have 12 houses`);
  const placed = view.houses.reduce((n, h) => n + h.planets.length, 0);
  assert.strictEqual(placed, 9, `${key} view lost planets: ${placed} of 9 placed`);
}
// Lagna view must reproduce the chart's own houses — same wheel, same answer.
assert.deepStrictEqual(
  sudarshana.lagna.houses.map(h => [h.number, h.signNumber, h.planets.slice().sort()]),
  chart.houses.map(h => [h.number, h.signNumber, h.planets.slice().sort()]),
  'the lagna view of the Sudarshana Chakra must equal the birth chart houses',
);
console.log('ok  Sudarshana Chakra: 3 views, 9 planets each, reference body in its own 1st house');

// ── 5. planet -> direction, for ANY planet ──────────────────────────────────
const DIRECTIONS = {
  Sun: 'East', Moon: 'Northwest', Mars: 'South', Mercury: 'North', Jupiter: 'Northeast',
  Venus: 'Southeast', Saturn: 'West', Rahu: 'Southwest', Ketu: 'Southwest',
};
for (const [planet, dir] of Object.entries(DIRECTIONS)) {
  assert.strictEqual(ai.PLANET_DIRECTIONS[planet], dir, `direction for ${planet}`);
  assert.strictEqual(ai.getPlanetDirection(planet), dir, `getPlanetDirection('${planet}')`);
}
assert.strictEqual(ai.getPlanetDirection('Pluto'), null, 'unknown planet must be null, not undefined');
// PINNED ON PURPOSE, NOT ENDORSED: Rahu and Ketu carry the SAME direction. Several
// traditional sources put Ketu elsewhere. If this assertion ever fails it means
// somebody made that content decision — confirm it was deliberate, then update it.
assert.strictEqual(
  ai.PLANET_DIRECTIONS.Rahu, ai.PLANET_DIRECTIONS.Ketu,
  'Rahu/Ketu directions have been split — this is a CONTENT decision, see remedies.ts',
);
console.log("ok  PLANET_DIRECTIONS complete for all 9 grahas (Rahu/Ketu still share 'Southwest' — pending content call)");

// ── 6. varga dignity can reach 'friendly' and 'enemy' ───────────────────────
const varga = ai.calculateShodashvarga(
  chart.planets.map(p => ({ name: p.name, signNumber: p.signNumber, degreeInSign: p.degreeInSign })),
  chart.lagna.signNumber,
  chart.lagna.degreeInSign,
);
const seen = new Set();
for (const entry of varga) for (const s of entry.scores) seen.add(s.dignity);
for (const mark of ['friendly', 'enemy']) {
  assert.ok(
    seen.has(mark),
    `getVargaDignity never returned '${mark}' across all 9 planets x 16 vargas. ` +
    `The FR/EN marks in the report's dignity map are unreachable and those cells score a flat 5. ` +
    `It must compare the planet with the LORD of the varga sign (NATURAL_FRIENDSHIPS).`,
  );
}
// Spot-check one cell we can reason about: Sun in a Saturn-ruled sign is an enemy sign.
assert.strictEqual(
  (function () {
    const d1 = varga.find(e => e.planet === 'Saturn').scores.find(s => s.chart === 'D1');
    return d1.dignity;
  })(), 'own_sign', 'Saturn in Capricorn in D1 must still read own_sign — dignity order broke',
);
console.log(`ok  varga dignity now reaches ${[...seen].sort().join(', ')}`);

console.log('\nAll checks passed.');
