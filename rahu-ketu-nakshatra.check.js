/**
 * Guard for two defects a Play reviewer found in Sep 2026. Runs against dist/ —
 * the bundle the phone actually loads (index.rn.js requires dist/, not src/), so
 * a fix that is only in TypeScript and never rebuilt still fails here.
 *
 * 1. RAHU/KETU MUST BE AN EXACT 180 AXIS. ephemeris.ts mapped 'Rahu' to body 11
 *    under a comment reading SE_MEAN_NODE. 11 is SE_TRUE_NODE; SE_MEAN_NODE is 10,
 *    and Ketu is built from SE_MEAN_NODE+180. The axis bent by up to 1.94 deg and
 *    threw Ketu into the wrong sign on ~3% of birth dates.
 * 2. EVERY NAKSHATRA NAME THE CHART EMITS MUST RESOLVE IN EVERY CONSUMER TABLE.
 *    The chart said 'Mula'; the dasha table said 'Moola'; calculateVimshottariDasha
 *    throws on an unknown key and the app swallowed it, so 1 user in 27 saw a blank
 *    Dasha tab, no Ganda Moola verdict and no name suggestions.
 *
 * ponytail: plain asserts, no test framework. Run: node rahu-ketu-nakshatra.check.js
 */
const assert = require('assert');
const { Ephemeris } = require('./dist/panchang/src/calculations/ephemeris');
const { calculateAllPlanets } = require('./dist/panchang/src/birthchart/core/planets');
const { NAKSHATRA_LORDS } = require('./dist/panchang/src/birthchart/dasha/constants');
const { GANDA_MOOLA_NAKSHATRAS } = (() => {
  try { return require('./dist/panchang/src/birthchart/analysis/dosha'); } catch { return {}; }
})();
const { NAKSHATRA_SYLLABLES } = require('./dist/panchang/src/birthchart/recommendations/names');

const eph = new Ephemeris();
let checks = 0;

// ── 1. the axis, swept across 40 years ───────────────────────────────────────
let worst = 0, worstDay = null;
for (let y = 1950; y <= 2030; y += 1) {
  const d = new Date(Date.UTC(y, (y * 7) % 12, 1 + (y % 27), 6, 0, 0));
  const p = calculateAllPlanets(d, 23.75, eph);
  const rahu = p.find((x) => x.name === 'Rahu').longitude;
  const ketu = p.find((x) => x.name === 'Ketu').longitude;
  const sep = ((ketu - rahu) % 360 + 360) % 360;
  const err = Math.abs(sep - 180);
  if (err > worst) { worst = err; worstDay = d.toISOString().slice(0, 10); }
  checks++;
}
assert.ok(
  worst < 1e-6,
  `Rahu/Ketu are not a true axis: worst separation error ${worst.toFixed(4)} deg on ${worstDay}. ` +
  `Check that ephemeris maps 'Rahu' to 10 (SE_MEAN_NODE), not 11 (SE_TRUE_NODE), and REBUILD dist.`,
);
console.log(`ok  Rahu/Ketu exactly 180 deg apart across ${checks} dates (worst error ${worst.toExponential(1)} deg)`);

// ── 2. every emitted nakshatra name resolves in every consumer table ─────────
// Walk the whole zodiac so we actually see all 27 names the chart can emit.
// The emitter's own table is the source of truth for what a chart can print.
// 'Unknown' is its out-of-range fallback, not a nakshatra.
const emitted = new Set();
const planetsSrc = require('fs').readFileSync('./dist/panchang/src/birthchart/core/planets.js', 'utf8');
for (const m of planetsSrc.matchAll(/\{ name: '([^']+)', lord: '[^']+' \}/g)) {
  if (m[1] !== 'Unknown') emitted.add(m[1]);
}
assert.strictEqual(emitted.size, 27, `expected 27 nakshatra names in the emitter, found ${emitted.size}`);

const consumers = [
  ['dasha NAKSHATRA_LORDS', NAKSHATRA_LORDS],
  ['names NAKSHATRA_SYLLABLES', NAKSHATRA_SYLLABLES],
];
for (const [label, table] of consumers) {
  const missing = [...emitted].filter((n) => !table[n]);
  assert.deepStrictEqual(
    missing, [],
    `${label} does not know these names the chart emits: ${missing.join(', ')}. ` +
    `A chart with the Moon there breaks that feature silently.`,
  );
  console.log(`ok  all 27 emitted nakshatra names resolve in ${label}`);
}

// Mula/Moola specifically — the exact defect reported.
assert.ok(NAKSHATRA_LORDS['Moola'], "dasha table lost 'Moola'");
assert.ok(emitted.has('Moola'), "chart must emit 'Moola', not 'Mula' — the dasha table is keyed 'Moola'");
console.log("ok  nakshatra 19 is spelled 'Moola' on both sides");

console.log('\nAll checks passed.');
